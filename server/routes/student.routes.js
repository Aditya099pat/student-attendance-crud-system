import express from 'express';
import db from '../db.js';

const student_router = express.Router();

student_router.get('/get-students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});


student_router.get('/get-student/:id', (req, res) => {
    db.query(
        'SELECT * FROM students WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results[0]);
        }
    );
});


student_router.post('/add-student', (req, res) => {
    const { roll_no, name, email, department, year } = req.body;

    const sql = `
        INSERT INTO students (roll_no, name, email, department, year)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [roll_no, name, email, department, year], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Student added successfully' });
    });
});


student_router.put('/update-student/:id', (req, res) => {
    const { roll_no, name, email, department, year } = req.body;

    const sql = `
        UPDATE students
        SET roll_no=?, name=?, email=?, department=?, year=?
        WHERE id=?
    `;

    db.query(sql, [roll_no, name, email, department, year, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Student updated successfully' });
    });
});


student_router.delete('/delete-student/:id', (req, res) => {
    db.query(
        'DELETE FROM students WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Student deleted successfully' });
        }
    );
});

export default student_router;