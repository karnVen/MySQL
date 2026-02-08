import 'dotenv/config'; 
import mysql from 'mysql2/promise';

async function main() {
    try {
        // 2. The Connection
        const db = await mysql.createConnection({
            // We use .trim() to remove any accidental spaces from the .env file
            host: process.env.DATABASE_HOST.trim(), 
            user: process.env.DATABASE_USER.trim(),
            password: process.env.DATABASE_PASSWORD.trim(),
            database: process.env.DATABASE_NAME.trim()
        });

    
    
    // 2. FORCE SAVE (Add this line!)
    await db.execute('COMMIT'); 

    const [rows]= await db.execute(`select * from users`);

    
    console.log(rows);

    // 3. Close
    await db.end();

    } catch (err) {
        console.log("❌ ERROR:");
        console.log(err.message);
    }
}

main();