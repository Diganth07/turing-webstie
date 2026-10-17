"""Schema tests run against a REAL Postgres server.

TEST_DATABASE_URL must point at a Postgres SERVER where the connecting role may
create databases (CREATEDB). The tests never touch the database named in the URL:
for each run they create a brand-new temporary database (apply_test_<random>),
build it from db/schema.sql, run, and drop it again at the end.

Example: postgresql://postgres:PASSWORD@localhost:5432/postgres
"""
import os
import uuid
from pathlib import Path

import psycopg
import pytest
from psycopg.conninfo import make_conninfo

SCHEMA_FILE = Path(__file__).resolve().parent.parent / "db" / "schema.sql"


def _url() -> str:
    url = os.environ.get("TEST_DATABASE_URL")
    if not url:
        raise RuntimeError(
            "Set TEST_DATABASE_URL to a Postgres server URL, "
            "e.g. postgresql://postgres:PASSWORD@localhost:5432/postgres"
        )
    return url


@pytest.fixture(scope="session")
def schema_sql() -> str:
    return SCHEMA_FILE.read_text(encoding="utf-8")


@pytest.fixture(scope="session")
def db_url(schema_sql):
    """Connection string of a fresh temporary database, dropped after the run."""
    admin_url = _url()
    name = "apply_test_" + uuid.uuid4().hex[:8]
    with psycopg.connect(admin_url, autocommit=True) as admin:
        try:
            admin.execute(f'CREATE DATABASE "{name}"')
        except psycopg.errors.InsufficientPrivilege as exc:
            raise RuntimeError(
                "The role in TEST_DATABASE_URL may not create databases. "
                "Use a role with CREATEDB (for example the postgres user)."
            ) from exc
        try:
            test_url = make_conninfo(admin_url, dbname=name)
            with psycopg.connect(test_url, autocommit=True) as setup:
                setup.execute(schema_sql)
            yield test_url
        finally:
            admin.execute(f'DROP DATABASE IF EXISTS "{name}" WITH (FORCE)')


@pytest.fixture()
def conn(db_url):
    """Each test runs inside a transaction that is rolled back at the end."""
    connection = psycopg.connect(db_url)
    yield connection
    connection.rollback()
    connection.close()