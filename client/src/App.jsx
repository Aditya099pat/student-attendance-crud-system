import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3000'

const emptyStudent = {
  roll_no: '',
  name: '',
  email: '',
  department: '',
  year: '',
}

const emptyAttendance = {
  student_id: '',
  date: '',
  status: 'Present',
}

function App() {
  const [activeTab, setActiveTab] = useState('students')

  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])

  const [studentForm, setStudentForm] = useState(emptyStudent)
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendance)

  const [editingStudentId, setEditingStudentId] = useState(null)

  const [studentSearch, setStudentSearch] = useState('')
  const [attendanceSearch, setAttendanceSearch] = useState('')

  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [submittingStudent, setSubmittingStudent] = useState(false)
  const [submittingAttendance, setSubmittingAttendance] = useState(false)

  const [studentMessage, setStudentMessage] = useState('')
  const [attendanceMessage, setAttendanceMessage] = useState('')
  const [studentError, setStudentError] = useState('')
  const [attendanceError, setAttendanceError] = useState('')

  useEffect(() => {
    fetchStudents()
    fetchAttendance()
  }, [])

  async function handleApiResponse(response) {
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(
        data?.message || data?.sqlMessage || data?.error || `Request failed with status ${response.status}`
      )
    }
    return data
  }

  async function fetchStudents() {
    try {
      setLoadingStudents(true)
      setStudentError('')
      const response = await fetch(`${API_BASE}/api/students/get-students`)
      const data = await handleApiResponse(response)
      setStudents(Array.isArray(data) ? data : [])
    } catch (error) {
      setStudentError(error.message || 'Failed to load students')
    } finally {
      setLoadingStudents(false)
    }
  }

  async function fetchAttendance() {
    try {
      setLoadingAttendance(true)
      setAttendanceError('')
      const response = await fetch(`${API_BASE}/api/attendance/get-attendance`)
      const data = await handleApiResponse(response)
      setAttendance(Array.isArray(data) ? data : [])
    } catch (error) {
      setAttendanceError(error.message || 'Failed to load attendance')
    } finally {
      setLoadingAttendance(false)
    }
  }

  function handleStudentInputChange(e) {
    const { name, value } = e.target
    setStudentForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleAttendanceInputChange(e) {
    const { name, value } = e.target
    setAttendanceForm((prev) => ({ ...prev, [name]: value }))
  }

  function resetStudentForm() {
    setStudentForm(emptyStudent)
    setEditingStudentId(null)
    setStudentError('')
    setStudentMessage('')
  }

  function resetAttendanceForm() {
    setAttendanceForm(emptyAttendance)
    setAttendanceError('')
    setAttendanceMessage('')
  }

  async function handleStudentSubmit(e) {
    e.preventDefault()
    setSubmittingStudent(true)
    setStudentError('')
    setStudentMessage('')

    const isEditing = Boolean(editingStudentId)
    const url = isEditing
      ? `${API_BASE}/api/students/update-student/${editingStudentId}`
      : `${API_BASE}/api/students/add-student`
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentForm),
      })

      const data = await handleApiResponse(response)
      setStudentMessage(
        data?.message ||
          (isEditing ? 'Student updated successfully' : 'Student added successfully')
      )
      resetStudentForm()
      await fetchStudents()
    } catch (error) {
      setStudentError(error.message || 'Failed to save student')
    } finally {
      setSubmittingStudent(false)
    }
  }

  function handleStudentEdit(student) {
    setEditingStudentId(student.id)
    setStudentForm({
      roll_no: student.roll_no || '',
      name: student.name || '',
      email: student.email || '',
      department: student.department || '',
      year: student.year || '',
    })
    setActiveTab('students')
    setStudentMessage('')
    setStudentError('')
  }

  async function handleStudentDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this student?')
    if (!confirmed) return

    try {
      setStudentError('')
      setStudentMessage('')
      const response = await fetch(`${API_BASE}/api/students/delete-student/${id}`, {
        method: 'DELETE',
      })
      const data = await handleApiResponse(response)
      setStudentMessage(data?.message || 'Student deleted successfully')

      if (editingStudentId === id) resetStudentForm()

      await fetchStudents()
      await fetchAttendance()
    } catch (error) {
      setStudentError(error.message || 'Failed to delete student')
    }
  }

  async function handleAttendanceSubmit(e) {
    e.preventDefault()
    setSubmittingAttendance(true)
    setAttendanceError('')
    setAttendanceMessage('')

    try {
      const response = await fetch(`${API_BASE}/api/attendance/add-attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...attendanceForm,
          student_id: Number(attendanceForm.student_id),
        }),
      })

      const data = await handleApiResponse(response)
      setAttendanceMessage(data?.message || 'Attendance marked successfully')
      resetAttendanceForm()
      await fetchAttendance()
    } catch (error) {
      setAttendanceError(error.message || 'Failed to mark attendance')
    } finally {
      setSubmittingAttendance(false)
    }
  }

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase()
    if (!q) return students

    return students.filter((student) =>
      [student.roll_no, student.name, student.email, student.department, student.year]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [students, studentSearch])

  const filteredAttendance = useMemo(() => {
    const q = attendanceSearch.trim().toLowerCase()
    if (!q) return attendance

    return attendance.filter((row) =>
      [row.name, row.roll_no, row.date, row.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [attendance, attendanceSearch])

  return (
    <div className="app-shell">
      <div className="container">
        <div className="header-card">
          <h1>Student & Attendance Management</h1>
          <p>Manage student details and track attendance records in one place.</p>
        </div>

        <div className="tab-row">
          <button
            className={activeTab === 'students' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={activeTab === 'attendance' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>

        {activeTab === 'students' && (
          <div className="grid-layout">
            <div className="card form-card">
              <div className="card-head">
                <h2>{editingStudentId ? 'Update Student' : 'Add Student'}</h2>
                {editingStudentId && (
                  <button type="button" className="secondary-btn" onClick={resetStudentForm}>
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleStudentSubmit} className="form-grid">
                <Input
                  label="Roll No"
                  name="roll_no"
                  value={studentForm.roll_no}
                  onChange={handleStudentInputChange}
                  required
                />
                <Input
                  label="Name"
                  name="name"
                  value={studentForm.name}
                  onChange={handleStudentInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={studentForm.email}
                  onChange={handleStudentInputChange}
                  required
                />
                <Input
                  label="Department"
                  name="department"
                  value={studentForm.department}
                  onChange={handleStudentInputChange}
                  required
                />
                <Input
                  label="Year"
                  name="year"
                  value={studentForm.year}
                  onChange={handleStudentInputChange}
                  required
                />

                {studentMessage && <div className="message success">{studentMessage}</div>}
                {studentError && <div className="message error">{studentError}</div>}

                <button className="primary-btn" type="submit" disabled={submittingStudent}>
                  {submittingStudent
                    ? editingStudentId
                      ? 'Updating...'
                      : 'Adding...'
                    : editingStudentId
                    ? 'Update Student'
                    : 'Add Student'}
                </button>
              </form>
            </div>

            <div className="card table-card wide">
              <div className="card-head responsive-head">
                <h2>Student Records</h2>
                <div className="action-row">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                  <button type="button" className="secondary-btn" onClick={fetchStudents}>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingStudents ? (
                <p className="helper-text">Loading students...</p>
              ) : studentError && !students.length ? (
                <div className="message error">{studentError}</div>
              ) : filteredStudents.length === 0 ? (
                <p className="helper-text">No students found.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.roll_no}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.department}</td>
                          <td>{student.year}</td>
                          <td>
                            <div className="row-actions">
                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() => handleStudentEdit(student)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() => handleStudentDelete(student.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="grid-layout">
            <div className="card form-card">
              <div className="card-head">
                <h2>Mark Attendance</h2>
              </div>

              <form onSubmit={handleAttendanceSubmit} className="form-grid">
                <div className="input-group">
                  <label>Student</label>
                  <select
                    name="student_id"
                    value={attendanceForm.student_id}
                    onChange={handleAttendanceInputChange}
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.roll_no})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={attendanceForm.date}
                  onChange={handleAttendanceInputChange}
                  required
                />

                <div className="input-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={attendanceForm.status}
                    onChange={handleAttendanceInputChange}
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>

                {attendanceMessage && (
                  <div className="message success">{attendanceMessage}</div>
                )}
                {attendanceError && <div className="message error">{attendanceError}</div>}

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={submittingAttendance}
                >
                  {submittingAttendance ? 'Saving...' : 'Add Attendance'}
                </button>
              </form>

              
            </div>

            <div className="card table-card wide">
              <div className="card-head responsive-head">
                <h2>Attendance Log</h2>
                <div className="action-row">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search attendance..."
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                  />
                  <button type="button" className="secondary-btn" onClick={fetchAttendance}>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingAttendance ? (
                <p className="helper-text">Loading attendance...</p>
              ) : attendanceError && !attendance.length ? (
                <div className="message error">{attendanceError}</div>
              ) : filteredAttendance.length === 0 ? (
                <p className="helper-text">No attendance records found.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Attendance ID</th>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((row) => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{row.name}</td>
                          <td>{row.roll_no}</td>
                          <td>{formatDate(row.date)}</td>
                          <td>
                            <span className={`status-badge ${String(row.status).toLowerCase()}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Input({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString()
}

export default App