const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Your Password',
  database: 'notes_app'
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
  initializeDatabase();
});

async function initializeDatabase() {
  connection.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'notes_app' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME = 'role'
  `, (err, results) => {
    if (err) {
      console.log('Error checking role column:', err.message);
      return;
    }
    
    if (results.length === 0) {
      connection.query(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'
      `, (err) => {
        if (err) {
          console.log('Error adding role column:', err.message);
        } else {
          console.log('Role column added to users table');
        }
        createAdminUser();
      });
    } else {
      console.log('Role column already exists');
      createAdminUser();
    }
  });
}

async function createAdminUser() {
  const adminUsername = 'admin';
  const adminPassword = 'admin1234'; 
  
  connection.query('SELECT * FROM users WHERE username = ?', [adminUsername], async (err, results) => {
    if (err) {
      console.log('Error checking admin user:', err.message);
      return;
    }
    
    if (results.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      connection.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [adminUsername, hashedPassword, 'admin'],
        (err) => {
          if (err) {
            console.log('Error creating admin user:', err.message);
          } else {
            console.log('Admin user created successfully');
            console.log('Admin credentials: username=admin, password=admin1234');
          }
        }
      );
    } else {
      console.log('Admin user already exists');
    }
  });
}

module.exports = connection;
