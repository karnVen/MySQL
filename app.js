import 'dotenv/config'; 
import mysql from 'mysql2/promise';

export async function main() {
    try {
        // 2. The Connection
        const db = await mysql.createConnection({
            // We use  to remove any accidental spaces from the .env file
            host: process.env.DATABASE_HOST, 
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        });

    
    
    // 2. FORCE SAVE (Add this line!)
    await db.execute('COMMIT'); 

    const [rows]= await db.execute(`select * from users`);

    const usernames = rows.map(user => user.username);
    // console.log(usernames);
    

    // 3. Close
    await db.end();
    return usernames;

    } catch (err) {
        console.log("❌ ERROR:");
        console.log(err.message);
        return [];
    }
}

main();

