import express from 'express';
import db from '../db.js';

const attendance_router = express.Router();


attendance_router.get('/get-attendance', (req, res) => {
    const sql = `
        SELECT attendance.id, students.name, students.roll_no, attendance.date, attendance.status
        FROM attendance
        JOIN students ON attendance.student_id = students.id
        ORDER BY attendance.date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});


attendance_router.post('/add-attendance', (req, res) => {
    const { student_id, date, status } = req.body;

    const sql = `
        INSERT INTO attendance (student_id, date, status)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [student_id, date, status], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Attendance marked successfully' });
    });
});

export default attendance_router;