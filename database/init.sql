CREATE TABLE IF NOT EXISTS students (
 id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL,
 email VARCHAR(160) UNIQUE NOT NULL, branch VARCHAR(40) NOT NULL DEFAULT 'CSE',
 graduation_year INTEGER NOT NULL DEFAULT 2027, skills TEXT DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS companies (
 id SERIAL PRIMARY KEY, name VARCHAR(160) NOT NULL, role VARCHAR(120) NOT NULL,
 location VARCHAR(120) DEFAULT '', package_lpa NUMERIC(8,2),
 status VARCHAR(20) NOT NULL DEFAULT 'Open', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS applications (
 id SERIAL PRIMARY KEY,
 student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
 company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
 status VARCHAR(30) NOT NULL DEFAULT 'Applied', applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(student_id, company_id)
);
INSERT INTO students (name,email,branch,graduation_year,skills) VALUES
('Aarav Sharma','aarav.sharma@example.com','CSE',2027,'Java, AWS, SQL'),
('Meera Verma','meera.verma@example.com','CSE',2027,'Python, React, PostgreSQL'),
('Kabir Singh','kabir.singh@example.com','IT',2027,'JavaScript, Docker, Linux')
ON CONFLICT (email) DO NOTHING;
INSERT INTO companies (name,role,location,package_lpa,status) VALUES
('CloudNova Technologies','Cloud Engineer','Noida',8.50,'Open'),
('DataBridge Systems','Software Engineer','Gurugram',7.20,'Open'),
('NextGen Digital','DevOps Trainee','Delhi NCR',6.00,'Open');
