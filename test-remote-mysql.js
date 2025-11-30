const mysql = require('mysql2/promise');

const config = {
  host: '208.76.86.152',
  port: 3306,
  user: 'owurkamu_webuser',
  password: 'webuser',
  database: 'owurkamu_simpleImages',
};

console.log('Testing MySQL connection...');
console.log('Host:', config.host);
console.log('User:', config.user);
console.log('Database:', config.database);
console.log('');

async function testConnection() {
  let connection;
  try {
    console.log('Attempting to connect...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');
    
    const [rows] = await connection.execute('SELECT VERSION() as version, DATABASE() as db');
    console.log('MySQL Version:', rows[0].version);
    console.log('Current Database:', rows[0].db);
    
    const [workRows] = await connection.execute('SELECT COUNT(*) as count FROM work');
    console.log('Work table count:', workRows[0].count);
    
    console.log('');
    console.log('✅ All tests passed! Credentials are correct.');
    console.log('');
    console.log('If this works locally but fails on Vercel, the issue is likely:');
    console.log('1. Remote MySQL access not enabled in your hosting control panel');
    console.log('2. User needs permission to connect from remote IPs');
    console.log('3. Firewall blocking Vercel\'s IP addresses');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('Common fixes:');
    console.error('1. Verify username and password are correct');
    console.error('2. Check if MySQL user has remote access permissions');
    console.error('3. Ensure port 3306 is open');
    console.error('4. Check hosting control panel for "Remote MySQL" settings');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();

