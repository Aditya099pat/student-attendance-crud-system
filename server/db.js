import mysql from "mysql2"

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "cms_user",
  password: "YourNewPassword123!",
  database: "my_college",
})

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err)
  } else {
    console.log("Connected to database")
  }
})

export default db