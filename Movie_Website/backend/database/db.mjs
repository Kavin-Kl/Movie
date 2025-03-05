import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

console.log("Connected to database")

const db = await open({
    filename: './database/movies.db',
    driver: sqlite3.Database
});

export default db;
