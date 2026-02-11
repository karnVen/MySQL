// other_file.js
import { main } from './app.js';
// Since 'main' is async (talks to DB), we must use a function or Top-Level Await
async function start() {
    
   
    const users = await main(); 

    return users;
}


const users= await start();

