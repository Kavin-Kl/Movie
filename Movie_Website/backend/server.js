import express from 'express';
import cors from 'cors';
import db from './database/db.mjs';

console.log("Server is starting...");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows frontend to call backend
app.use(express.json()); // Parses JSON data from frontend

// Test Route - Check if server is working
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Route: Get all reviews
app.get('/reviews', (req, res) => {
    db.all('SELECT * FROM reviews', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route: Add a new review
app.post('/reviews', (req, res) => {
    const { movie_title, user, rating, review } = req.body;
    if (!movie_title || !user || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        `INSERT INTO reviews (movie_title, user, rating, review) VALUES (?, ?, ?, ?)`,
        [movie_title, user, rating, review],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
