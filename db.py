import os
import json
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

PROSPECTS_FILE = os.path.join(os.path.dirname(__file__), "data", "prospects.json")
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Normalize postgres:// to postgresql:// for compatibility
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def is_db_connected():
    return bool(DATABASE_URL)

def get_db_connection():
    import psycopg2
    from psycopg2.extras import RealDictCursor
    # Ensure sslmode=require for Neon if not specified
    conn_str = DATABASE_URL
    if "sslmode" not in conn_str and "localhost" not in conn_str:
        connector = "&" if "?" in conn_str else "?"
        conn_str = f"{conn_str}{connector}sslmode=require"
    return psycopg2.connect(conn_str, cursor_factory=RealDictCursor)

def init_db():
    """Initializes the PostgreSQL database schema and seeds initial prospects if empty."""
    if not is_db_connected():
        return False
    try:
        import psycopg2
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS prospects (
                        id VARCHAR(64) PRIMARY KEY,
                        date_added VARCHAR(32),
                        business VARCHAR(255) NOT NULL,
                        owner VARCHAR(255),
                        phone VARCHAR(64),
                        website VARCHAR(255),
                        niche VARCHAR(255),
                        location VARCHAR(255),
                        weakness TEXT,
                        stage VARCHAR(64) DEFAULT 'PITCH_READY',
                        has_replied BOOLEAN DEFAULT FALSE,
                        reply_notes TEXT,
                        notes TEXT,
                        last_contacted VARCHAR(64),
                        follow_up_date VARCHAR(64),
                        deal_value INT DEFAULT 29999,
                        pitch TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                # Check if table is empty, seed from prospects.json
                cur.execute("SELECT COUNT(*) as count FROM prospects;")
                row = cur.fetchone()
                if row and row["count"] == 0:
                    seed_from_json(cur)
            conn.commit()
        print("Neon PostgreSQL database initialized and synced successfully.")
        return True
    except Exception as e:
        print(f"Warning: Database connection failed ({e}). Falling back to JSON storage.")
        return False

def seed_from_json(cur):
    """Seeds initial prospects from data/prospects.json into PostgreSQL."""
    if not os.path.exists(PROSPECTS_FILE):
        return
    try:
        with open(PROSPECTS_FILE, "r", encoding="utf-8") as f:
            leads = json.load(f)
        for p in leads:
            cur.execute("""
                INSERT INTO prospects (
                    id, date_added, business, owner, phone, website, niche,
                    location, weakness, stage, has_replied, reply_notes, notes,
                    last_contacted, follow_up_date, deal_value, pitch
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                ) ON CONFLICT (id) DO NOTHING;
            """, (
                p.get("id"),
                p.get("date_added", datetime.now().strftime("%Y-%m-%d")),
                p.get("business", "Unnamed"),
                p.get("owner", "Founder"),
                p.get("phone", ""),
                p.get("website", ""),
                p.get("niche", "General"),
                p.get("location", ""),
                p.get("weakness", ""),
                p.get("stage", "PITCH_READY"),
                p.get("has_replied", False),
                p.get("reply_notes", ""),
                p.get("notes", ""),
                p.get("last_contacted", ""),
                p.get("follow_up_date", ""),
                int(p.get("deal_value", 29999)),
                p.get("pitch", "")
            ))
        print(f"Successfully seeded {len(leads)} prospects from prospects.json to Neon DB.")
    except Exception as e:
        print(f"Error seeding prospects: {e}")

# JSON File Fallback Helpers
def load_json_prospects():
    if os.path.exists(PROSPECTS_FILE):
        try:
            with open(PROSPECTS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    if "has_replied" not in item:
                        item["has_replied"] = item.get("stage") in ["REPLIED", "DEMO_SHARED", "CALL_BOOKED", "CLOSED_WON"]
                    if "reply_notes" not in item:
                        item["reply_notes"] = ""
                    if "deal_value" not in item:
                        item["deal_value"] = 29999
                    if "last_contacted" not in item:
                        item["last_contacted"] = ""
                return data
        except Exception:
            return []
    return []

def save_json_prospects(prospects):
    with open(PROSPECTS_FILE, "w", encoding="utf-8") as f:
        json.dump(prospects, f, indent=2)

def serialize_row(row):
    """Converts a database row dict to a JSON-safe dictionary (converting datetimes/dates)."""
    if not row:
        return row
    d = dict(row)
    for k, v in d.items():
        if hasattr(v, "isoformat"):
            d[k] = v.isoformat()
    return d

# Unified CRUD Interface
def get_all_prospects():
    if is_db_connected():
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM prospects ORDER BY created_at DESC;")
                    rows = cur.fetchall()
                    return [serialize_row(r) for r in rows]
        except Exception as e:
            print(f"DB Read Error: {e}, falling back to JSON")
    return load_json_prospects()

def add_new_prospect(data):
    new_id = data.get("id") or f"p_{int(time.time()*1000)}"
    entry = {
        "id": new_id,
        "date_added": data.get("date_added") or datetime.now().strftime("%Y-%m-%d"),
        "business": data.get("business", "Unnamed"),
        "owner": data.get("owner", "Founder"),
        "phone": data.get("phone", ""),
        "website": data.get("website", ""),
        "niche": data.get("niche", "Clinic"),
        "location": data.get("location", ""),
        "weakness": data.get("weakness", ""),
        "stage": data.get("stage", "PITCH_READY"),
        "has_replied": bool(data.get("has_replied", False)),
        "reply_notes": data.get("reply_notes", ""),
        "notes": data.get("notes", ""),
        "last_contacted": data.get("last_contacted", ""),
        "follow_up_date": data.get("follow_up_date", ""),
        "deal_value": int(data.get("deal_value", 29999)),
        "pitch": data.get("pitch", "")
    }

    if is_db_connected():
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO prospects (
                            id, date_added, business, owner, phone, website, niche,
                            location, weakness, stage, has_replied, reply_notes, notes,
                            last_contacted, follow_up_date, deal_value, pitch
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        );
                    """, (
                        entry["id"], entry["date_added"], entry["business"], entry["owner"],
                        entry["phone"], entry["website"], entry["niche"], entry["location"],
                        entry["weakness"], entry["stage"], entry["has_replied"], entry["reply_notes"],
                        entry["notes"], entry["last_contacted"], entry["follow_up_date"],
                        entry["deal_value"], entry["pitch"]
                    ))
                conn.commit()
            return entry
        except Exception as e:
            print(f"DB Insert Error: {e}, saving to JSON fallback")

    leads = load_json_prospects()
    leads.insert(0, entry)
    save_json_prospects(leads)
    return entry

def update_existing_prospect(prospect_id, updates):
    if is_db_connected():
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    fields = []
                    vals = []
                    for k, v in updates.items():
                        if k in ["business", "owner", "phone", "website", "niche", "location", "weakness", "stage", "has_replied", "reply_notes", "notes", "last_contacted", "follow_up_date", "deal_value", "pitch"]:
                            fields.append(f"{k} = %s")
                            vals.append(v)
                    if fields:
                        fields.append("updated_at = CURRENT_TIMESTAMP")
                        vals.append(prospect_id)
                        query = f"UPDATE prospects SET {', '.join(fields)} WHERE id = %s RETURNING *;"
                        cur.execute(query, tuple(vals))
                        row = cur.fetchone()
                        conn.commit()
                        if row:
                            return serialize_row(row)
        except Exception as e:
            print(f"DB Update Error: {e}, updating JSON fallback")

    leads = load_json_prospects()
    updated = None
    for p in leads:
        if p["id"] == prospect_id:
            for k, v in updates.items():
                if k in p or k in ["has_replied", "reply_notes", "deal_value", "follow_up_date"]:
                    p[k] = v
            if updates.get("stage") in ["REPLIED", "DEMO_SHARED", "CALL_BOOKED", "CLOSED_WON"]:
                p["has_replied"] = True
            updated = p
            break
    save_json_prospects(leads)
    return updated

def delete_existing_prospect(prospect_id):
    if is_db_connected():
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM prospects WHERE id = %s;", (prospect_id,))
                conn.commit()
            return True
        except Exception as e:
            print(f"DB Delete Error: {e}, deleting from JSON fallback")

    leads = load_json_prospects()
    leads = [p for p in leads if p["id"] != prospect_id]
    save_json_prospects(leads)
    return True

