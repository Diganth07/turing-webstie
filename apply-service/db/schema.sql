-- apply-service database schema (Neon / PostgreSQL)
-- Owner: Darsh
--
-- This one file creates everything. It is safe to run more than once
-- (IF NOT EXISTS), and it runs inside a single transaction: all or nothing.
--
-- Rules enforced by the database itself (the backend must normalize BEFORE inserting):
--   usn            trimmed + UPPERCASE, not blank. NO fixed format (it changes every year)
--   personal_email trimmed + lowercase, not blank
--   college_email  NULL when not given (never ''); if present: trimmed + lowercase
--   mobile         exactly 10 digits, starting 6-9 (no +91, no spaces)
--   domain         one of: technology, photography, design, marketing, social-media

BEGIN;

CREATE TABLE IF NOT EXISTS applications (
    id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle                       text        NOT NULL,  -- hiring round, e.g. '2026-hiring'
    name                        text        NOT NULL,
    usn                         text        NOT NULL,
    college_email               text,                  -- optional
    personal_email              text        NOT NULL,
    mobile                      text        NOT NULL,
    resume_object_key           text        NOT NULL,  -- key of the PDF inside MinIO
    resume_original_filename    text        NOT NULL,
    resume_size_bytes           integer     NOT NULL,
    confirmation_email_status   text        NOT NULL DEFAULT 'pending',
    confirmation_email_sent_at  timestamptz,
    created_at                  timestamptz NOT NULL DEFAULT now(),

    -- one application per student per hiring cycle
    CONSTRAINT uq_applications_usn_cycle UNIQUE (usn, cycle),

    CONSTRAINT ck_applications_cycle_not_blank  CHECK (btrim(cycle) <> ''),
    CONSTRAINT ck_applications_name_not_blank   CHECK (btrim(name) <> ''),
    CONSTRAINT ck_applications_usn_normalized   CHECK (usn <> '' AND usn = upper(btrim(usn))),
    CONSTRAINT ck_applications_personal_email_normalized
        CHECK (personal_email <> '' AND personal_email = lower(btrim(personal_email))),
    CONSTRAINT ck_applications_college_email_normalized
        CHECK (college_email IS NULL
               OR (college_email <> '' AND college_email = lower(btrim(college_email)))),
    CONSTRAINT ck_applications_mobile_format    CHECK (mobile ~ '^[6-9][0-9]{9}$'),
    CONSTRAINT ck_applications_resume_key_not_blank CHECK (btrim(resume_object_key) <> ''),
    CONSTRAINT ck_applications_resume_size_positive CHECK (resume_size_bytes > 0),
    CONSTRAINT ck_applications_email_status_valid
        CHECK (confirmation_email_status IN ('pending', 'sent', 'failed'))
);

-- One row per domain the applicant chose (an applicant can choose several).
CREATE TABLE IF NOT EXISTS application_domains (
    application_id  uuid NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
    domain          text NOT NULL,

    PRIMARY KEY (application_id, domain),
    CONSTRAINT ck_application_domains_domain_valid
        CHECK (domain IN ('technology', 'photography', 'design', 'marketing', 'social-media'))
);

CREATE INDEX IF NOT EXISTS ix_application_domains_domain ON application_domains (domain);

COMMIT;