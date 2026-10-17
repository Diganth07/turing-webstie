"""Small helpers shared by the schema tests."""
import uuid

VALID = {
    "cycle": "2026-hiring",
    "name": "Asha Rao",
    "usn": "1AB23CD001",
    "college_email": None,
    "personal_email": "asha@example.com",
    "mobile": "9876543210",
    "resume_object_key": "resumes/2026-hiring/x.pdf",
    "resume_original_filename": "resume.pdf",
    "resume_size_bytes": 1234,
}


def insert_app(conn, **overrides):
    """Insert an application with valid defaults; return its id."""
    row = {**VALID, **overrides}
    cols = ", ".join(row)
    params = ", ".join(f"%({k})s" for k in row)
    cur = conn.execute(f"INSERT INTO applications ({cols}) VALUES ({params}) RETURNING id", row)
    return cur.fetchone()[0]


def unique_usn() -> str:
    return "U" + uuid.uuid4().hex[:9].upper()