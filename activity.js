import 'dotenv/config'; 
import mysql from 'mysql2/promise';
import fs from 'fs';
import csv from 'csv-parser';
import moment from 'moment'; // <--- New Import

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

    // --- HELPER: Cleans messy dates ---
    const formatForMySQL = (dateStr) => {
        if (!dateStr) return null;

        // We tell moment to try ALL these patterns. 
        // It will use the first one that matches your data.
        const possibleFormats = [
            'DD-MM-YYYY HH:mm',      // Your top rows (e.g. 10-07-2025 00:22)
            'MM/DD/YYYY hh:mm A',    // Your middle rows (e.g. 12/28/2025 10:29 PM)
            'YYYY-MM-DD HH:mm:ss',   // Standard SQL (just in case)
            'MM/DD/YYYY HH:mm'       // Fallback
        ];

        const m = moment(dateStr, possibleFormats);

        if (m.isValid()) {
            return m.format('YYYY-MM-DD HH:mm:ss'); // Convert to MySQL standard
        } else {
            console.log(`⚠️ Warning: Could not parse date "${dateStr}"`);
            return null; // Return null so DB doesn't crash
        }
    };
    // ----------------------------------

    fs.createReadStream(CSV_FILENAME)
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '') 
        }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`3. Found ${results.length} rows. Starting upload...`);
            
            let successCount = 0;
            let errorCount = 0;

            for (const row of results) {
                try {
                    // Use our new helper function to clean the dates
                    const startTime = formatForMySQL(row['From']);
                    const endTime = formatForMySQL(row['To']);
                    
                    // Clean duration (handle empty strings)
                    const duration = row['Duration'] === '' ? null : row['Duration'];

                    const sql = `
                        INSERT INTO activities (id, activity_tag, start_time, end_time, duration, loops)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;

                    const values = [
                        row['ID'],          
                        row['Tag'],         
                        startTime,  // Cleaned Date
                        endTime,    // Cleaned Date
                        duration,
                        row['Loops']        
                    ];

                    await db.execute(sql, values);
                    process.stdout.write("."); 
                    successCount++;

                } catch (err) {
                    console.log(`\n❌ Error on Row ID ${row['ID']}: ${err.message}`);
                    errorCount++;
                }
            }

            console.log("\n------------------------------------------------");
            console.log(`✅ Upload Complete!`);
            console.log(`Successful: ${successCount}`);
            console.log(`Failed: ${errorCount}`);
            console.log("------------------------------------------------");

            await db.execute('COMMIT');
            await db.end();
        });
}

uploadCsv();