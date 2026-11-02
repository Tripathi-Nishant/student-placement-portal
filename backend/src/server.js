import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(cors({origin:true}));
app.use(express.json());

app.get('/api/health', async (_req,res) => {
 try { await pool.query('SELECT 1'); res.json({status:'ok',service:'placement-api',database:'connected'}); }
 catch(e) { res.status(503).json({status:'error',database:'unavailable',message:e.message}); }
});
app.get('/api/dashboard', async (_req,res) => {
 try {
  const [s,c,a] = await Promise.all([
   pool.query('SELECT COUNT(*)::int AS count FROM students'),
   pool.query("SELECT COUNT(*)::int AS count FROM companies WHERE status='Open'"),
   pool.query('SELECT COUNT(*)::int AS count FROM applications')]);
  res.json({students:s.rows[0].count,openCompanies:c.rows[0].count,applications:a.rows[0].count});
 } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/students', async (_req,res) => {
 try { res.json((await pool.query('SELECT * FROM students ORDER BY id DESC')).rows); }
 catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/students', async (req,res) => {
 const {name,email,branch='CSE',graduation_year=2027,skills=''}=req.body;
 if(!name||!email) return res.status(400).json({error:'name and email are required'});
 try {
  const r=await pool.query('INSERT INTO students(name,email,branch,graduation_year,skills) VALUES($1,$2,$3,$4,$5) RETURNING *',[name,email,branch,graduation_year,skills]);
  res.status(201).json(r.rows[0]);
 } catch(e) { res.status(e.code==='23505'?409:500).json({error:e.message}); }
});
app.delete('/api/students/:id', async (req,res) => {
 try { const r=await pool.query('DELETE FROM students WHERE id=$1 RETURNING id',[req.params.id]); if(!r.rowCount)return res.status(404).json({error:'Student not found'}); res.status(204).end(); }
 catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/companies', async (_req,res) => {
 try { res.json((await pool.query('SELECT * FROM companies ORDER BY id DESC')).rows); }
 catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/companies', async (req,res) => {
 const {name,role,location='',package_lpa=null}=req.body;
 if(!name||!role)return res.status(400).json({error:'name and role are required'});
 try { const r=await pool.query('INSERT INTO companies(name,role,location,package_lpa) VALUES($1,$2,$3,$4) RETURNING *',[name,role,location,package_lpa]); res.status(201).json(r.rows[0]); }
 catch(e) { res.status(500).json({error:e.message}); }
});
app.delete('/api/companies/:id', async (req,res) => {
 try { const r=await pool.query('DELETE FROM companies WHERE id=$1 RETURNING id',[req.params.id]); if(!r.rowCount)return res.status(404).json({error:'Company not found'}); res.status(204).end(); }
 catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/applications', async (_req,res) => {
 try {
  const q=await pool.query(`SELECT a.id,a.status,a.applied_at,s.name AS student_name,s.email AS student_email,c.name AS company_name,c.role FROM applications a JOIN students s ON s.id=a.student_id JOIN companies c ON c.id=a.company_id ORDER BY a.id DESC`);
  res.json(q.rows);
 } catch(e) { res.status(500).json({error:e.message}); }
});
app.post('/api/applications', async (req,res) => {
 const {student_id,company_id}=req.body;
 if(!student_id||!company_id)return res.status(400).json({error:'student_id and company_id are required'});
 try { const r=await pool.query('INSERT INTO applications(student_id,company_id) VALUES($1,$2) RETURNING *',[student_id,company_id]); res.status(201).json(r.rows[0]); }
 catch(e) { res.status(e.code==='23505'?409:500).json({error:e.message}); }
});
app.use((req,res)=>res.status(404).json({error:`Route not found: ${req.method} ${req.path}`}));
app.listen(PORT,'0.0.0.0',()=>console.log(`Placement Portal API listening on port ${PORT}`));
