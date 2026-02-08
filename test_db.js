import mysql from 'mysql2/promise';

console.log("---------------------------------------------------");
console.log("1. Attempting connection to 127.0.0.1...");

try {
    // HARDCODED CREDENTIALS (eliminates .env issues)
    const connection = await mysql.createConnection({
        host: '127.0.0.1',      // Force IPv4
        user: 'root',           // Standard user
        password: '1039',       // Your password
        database: 'webconnect', // Your DB
        port: 3306              // Default port
    });

    console.log("2. SUCCESS! Connected to database.");
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log("3. Database responded. Test math solution: ", rows[0].solution);

    await connection.end();
    console.log("---------------------------------------------------");

} catch (err) {
    console.log("---------------------------------------------------");
    console.log("❌ CONNECTION FAILED");
    console.log("Error Code:", err.code);
    console.log("Error Message:", err.message);
    console.log("---------------------------------------------------");
    
    if (err.code === 'ECONNREFUSED') {
        console.log("💡 TIP: Your database is not listening on Port 3306.");
        console.log("   Try changing port: 3306 to port: 3307 in the code.");
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log("💡 TIP: The user 'root' or password '1039' is wrong.");
    }
    if (err.code === 'ER_BAD_DB_ERROR') {
        console.log("💡 TIP: The database 'webconnect' does not exist.");
    }
    if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
         console.log("💡 TIP: This is a tricky handshake error. Restart MySQL.");
    }
}