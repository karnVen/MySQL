import 'dotenv/config'; 
import mysql from 'mysql2/promise';
import fs from 'fs';
import csv from 'csv-parser';

// 1. Configuration
const CSV_FILENAME = 'pomodoro.csv';

async function uploadCsv() {
    console.log("------------------------------------------------");
    console.log("1. Connecting to Database...");

    const db = await mysql.createConnection({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '1039',
        database: 'karnven'
    });

    console.log("2. Reading CSV file...");
    const results = [];

    fs.createReadStream(CSV_FILENAME)
        .pipe(csv({
            // FIX: This function removes invisible BOM characters from headers
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '')
        }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`3. Found ${results.length} rows. Starting upload...`);
            
            let successCount = 0;
            let errorCount = 0;

            for (const row of results) {
                try {
                    // 1. Clean up Empty Dates (Excel often leaves them as empty strings)
                    // If "To" is empty, we set it to NULL instead of ""
                    const endTime = row['To'] === '' ? null : row['To'];
                    const duration = row['Duration'] === '' ? null : row['Duration'];

                    const sql = `
                        INSERT INTO activities (id, activity_tag, start_time, end_time, duration, loops)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;

                    const values = [
                        row['ID'],          
                        row['Tag'],         
                        row['From'],        
                        endTime,   // Use the cleaned variable
                        duration,  // Use the cleaned variable
                        row['Loops']        
                    ];

                    await db.execute(sql, values);
                    process.stdout.write("."); 
                    successCount++;

                } catch (err) {
                    // Detailed error logging to help you debug
                    console.log(`\n❌ Error on Row ID ${row['ID'] || 'Unknown'}:`);
                    console.log(`   Message: ${err.message}`);
                    console.log(`   Data: ${JSON.stringify(row)}`); // Shows exactly what Excel sent
                    errorCount++;
                }
            }

            console.log("\n------------------------------------------------");
            console.log(`✅ Upload Complete!`);
            console.log(`Successful: ${successCount}`);
            console.log(`Failed: ${errorCount}`);
            console.log("------------------------------------------------");

            // Add the COMMIT just to be safe (some setups require it)
            await db.execute('COMMIT');
            await db.end();
        });
}

uploadCsv();