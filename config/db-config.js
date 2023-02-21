import dotenv from 'dotenv';
dotenv.config()
import mysql from 'mysql';

// For the database i used a XAMPP web server to create a tables 
//database config
const dbConfig = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE

});

//database connection
dbConfig.connect((error) => {

    if(error) throw error
    console.log("db connection running...'🌝");

});

export default dbConfig;
