# Student Placement Portal — 3-Tier Starter

Teaching application: React frontend, Node.js/Express API, PostgreSQL database.
This is a classroom starter, not a production-ready student information system.

## Features
- Dashboard counts
- Add/list/delete students
- Add/list/delete company drives
- Submit and view student applications

## Requirements
Ubuntu 24.04 LTS, Node.js 20+, npm, PostgreSQL 15+, Git (optional).

## 1. Install PostgreSQL
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Create database and user:
```bash
sudo -u postgres psql
```
Then run:
```sql
CREATE USER placement_user WITH PASSWORD 'placement_lab_password';
CREATE DATABASE placement_portal OWNER placement_user;
\q
```
Initialize tables and sample data:
```bash
PGPASSWORD=placement_lab_password psql -h localhost -U placement_user -d placement_portal -f database/init.sql
```

## 2. Run backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
API: http://localhost:5000
Check: `curl http://localhost:5000/api/health`

## 3. Run frontend
Open another terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## 4. Test API
```bash
curl http://localhost:5000/api/students
curl http://localhost:5000/api/companies
curl http://localhost:5000/api/applications
```
Create student:
```bash
curl -X POST http://localhost:5000/api/students -H "Content-Type: application/json" -d '{"name":"Aarav Sharma","email":"aarav@example.com","branch":"CSE","graduation_year":2027,"skills":"Java, AWS, SQL"}'
```
Create company:
```bash
curl -X POST http://localhost:5000/api/companies -H "Content-Type: application/json" -d '{"name":"CloudNova Technologies","role":"Cloud Engineer","location":"Noida","package_lpa":8.5}'
```
Apply student ID 1 to company ID 1:
```bash
curl -X POST http://localhost:5000/api/applications -H "Content-Type: application/json" -d '{"student_id":1,"company_id":1}'
```

## Architecture learning points
- Browser calls the React frontend.
- React calls the Express REST API.
- Express connects to PostgreSQL.
- Browser must never connect directly to PostgreSQL.
- Credentials are in environment variables; never commit `.env`.
- The later Docker practical will add Dockerfiles and Docker Compose.
- Kubernetes/EKS is intentionally not included yet; it will be set up separately when that module begins.

## T3.micro lab note
A t3.micro is resource-constrained for running frontend, backend and PostgreSQL together. It may work for a lightweight demonstration with careful resource monitoring, but do not treat it as production sizing. AWS Free Tier eligibility and limits depend on account age, offer and Region. Stop/delete resources when not in use.
