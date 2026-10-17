import psycopg
import pytest
from helpers import insert_app, unique_usn

DB_ERRORS = (psycopg.IntegrityError, psycopg.DataError)


# ---------- schema file ----------

def test_tables_exist(conn):
    rows = conn.execute(
        "select table_name from information_schema.tables where table_schema = 'public'"
    ).fetchall()
    assert {"applications", "application_domains"} <= {r[0] for r in rows}


def test_schema_can_be_applied_twice(db_url, schema_sql):
    """schema.sql must be safe to re-run (IF NOT EXISTS) and must not touch existing data."""
    with psycopg.connect(db_url, autocommit=True) as c:
        c.execute(schema_sql)
        c.execute(schema_sql)


# ---------- defaults ----------

def test_valid_application_gets_defaults(conn):
    app_id = insert_app(conn)
    status, sent_at, created_at = conn.execute(
        "select confirmation_email_status, confirmation_email_sent_at, created_at "
        "from applications where id = %s", (app_id,)).fetchone()
    assert status == "pending"
    assert sent_at is None
    assert created_at is not None
    assert str(app_id).count("-") == 4  # a UUID


# ---------- USN (no fixed format, but normalized) ----------

@pytest.mark.parametrize("usn", [
    "1AB23CD001", "24BTRCS001", "ABC123", "123456789012", "U1", "X" * 20,
    "1JU24CS042", "A1B2C3D4E5F6",
])
def test_usn_has_no_fixed_format(conn, usn):
    insert_app(conn, usn=usn)


@pytest.mark.parametrize("usn", ["1ab23cd001", " 1AB23CD001", "1AB23CD001 ", "", "   "])
def test_usn_must_be_trimmed_uppercase_and_not_blank(conn, usn):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, usn=usn)


def test_same_usn_same_cycle_is_rejected(conn):
    insert_app(conn, usn="1AB23CD001", cycle="2026-hiring")
    with pytest.raises(psycopg.IntegrityError):
        insert_app(conn, usn="1AB23CD001", cycle="2026-hiring")


def test_same_usn_different_cycle_is_allowed(conn):
    insert_app(conn, usn="1AB23CD001", cycle="2026-hiring")
    insert_app(conn, usn="1AB23CD001", cycle="2027-hiring")


def test_different_usn_same_personal_email_is_allowed(conn):
    insert_app(conn, usn=unique_usn(), personal_email="same@example.com")
    insert_app(conn, usn=unique_usn(), personal_email="same@example.com")


def test_case_variant_duplicate_cannot_be_stored(conn):
    """A lowercase USN is rejected by the check, so the unique key can't be bypassed by casing."""
    insert_app(conn, usn="1AB23CD001")
    with pytest.raises(DB_ERRORS):
        insert_app(conn, usn="1ab23cd001")


# ---------- emails ----------

def test_college_email_is_optional_null(conn):
    insert_app(conn, college_email=None)


def test_college_email_valid_lowercase_ok(conn):
    insert_app(conn, college_email="asha@jainuniversity.ac.in")


@pytest.mark.parametrize("email", ["", "ASHA@Example.com", " asha@example.com"])
def test_college_email_empty_or_unnormalized_rejected(conn, email):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, college_email=email)


@pytest.mark.parametrize("email", ["", "Asha@Example.com", "asha@example.com "])
def test_personal_email_empty_or_unnormalized_rejected(conn, email):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, personal_email=email)


# ---------- other columns ----------

@pytest.mark.parametrize("mobile", [
    "9876543210", "6000000000", "7123456789", "8123456789",
])
def test_mobile_valid(conn, mobile):
    insert_app(conn, mobile=mobile)


@pytest.mark.parametrize("mobile", [
    "987654321", "98765432101", "5876543210", "0876543210", "98765abcde",
    "+919876543210", "98765 43210", "",
])
def test_mobile_invalid_rejected(conn, mobile):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, mobile=mobile)


@pytest.mark.parametrize("field", ["name", "cycle", "resume_object_key"])
def test_blank_required_text_rejected(conn, field):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, **{field: "   "})


@pytest.mark.parametrize("size", [0, -1])
def test_resume_size_must_be_positive(conn, size):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, resume_size_bytes=size)


@pytest.mark.parametrize("status", ["pending", "sent", "failed"])
def test_email_status_valid_values(conn, status):
    insert_app(conn, confirmation_email_status=status)


def test_email_status_invalid_rejected(conn):
    with pytest.raises(DB_ERRORS):
        insert_app(conn, confirmation_email_status="delivered")


@pytest.mark.parametrize("field", [
    "cycle", "name", "usn", "personal_email", "mobile",
    "resume_object_key", "resume_original_filename", "resume_size_bytes",
])
def test_required_columns_cannot_be_null(conn, field):
    with pytest.raises(psycopg.IntegrityError):
        insert_app(conn, **{field: None})


# ---------- domains ----------

def _add_domain(conn, app_id, domain):
    conn.execute(
        "insert into application_domains (application_id, domain) values (%s, %s)",
        (app_id, domain))


@pytest.mark.parametrize("domain", [
    "technology", "photography", "design", "marketing", "social-media"])
def test_all_five_domains_accepted(conn, domain):
    _add_domain(conn, insert_app(conn), domain)


@pytest.mark.parametrize("domain", ["Technology", "tech", "social_media", "events", ""])
def test_unknown_or_wrong_case_domain_rejected(conn, domain):
    app_id = insert_app(conn)
    with pytest.raises(DB_ERRORS):
        _add_domain(conn, app_id, domain)


def test_one_application_can_have_many_domains(conn):
    app_id = insert_app(conn)
    for d in ("technology", "design", "social-media"):
        _add_domain(conn, app_id, d)
    count = conn.execute(
        "select count(*) from application_domains where application_id = %s",
        (app_id,)).fetchone()[0]
    assert count == 3


def test_same_domain_twice_for_one_application_rejected(conn):
    app_id = insert_app(conn)
    _add_domain(conn, app_id, "design")
    with pytest.raises(psycopg.IntegrityError):
        _add_domain(conn, app_id, "design")


def test_domain_requires_existing_application(conn):
    with pytest.raises(psycopg.IntegrityError):
        _add_domain(conn, "00000000-0000-0000-0000-000000000000", "design")


def test_deleting_application_removes_its_domains(conn):
    app_id = insert_app(conn)
    _add_domain(conn, app_id, "design")
    _add_domain(conn, app_id, "technology")
    conn.execute("delete from applications where id = %s", (app_id,))
    left = conn.execute(
        "select count(*) from application_domains where application_id = %s",
        (app_id,)).fetchone()[0]
    assert left == 0


def test_domain_column_is_indexed(conn):
    idx = {r[0] for r in conn.execute(
        "select indexname from pg_indexes where tablename = 'application_domains'")}
    assert "ix_application_domains_domain" in idx