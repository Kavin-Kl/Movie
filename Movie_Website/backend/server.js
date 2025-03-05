import express from 'express'; 
import cors from 'cors';
import sqlite3 from 'sqlite3';
import 'dotenv/config';
import { fetchMovies } from './tmdb.mjs';

const app = express();
const PORT = 5000;

// Connect to SQLite database
const db = new sqlite3.Database('./database/movies.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
        return;
    }
    console.log("✅ Connected to database");
});

// Middleware
app.use(cors()); // Allows frontend to call backend
app.use(express.json()); // Parses JSON data from frontend
// Middleware: Log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Test Route - Check if server is working
app.get('/', (req, res) => {
    res.send('✅ Backend is running!');
});

app.get('/reviews', (req, res) => {
    console.log("Fetching all reviews...");
    db.all('SELECT * FROM reviews', [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: "No reviews found" });
        }
        console.log("Reviews fetched:", rows);
        res.json(rows);
    });
});

app.post('/reviews', (req, res) => {
    const { movie_title, user, rating, review } = req.body;

    // Validation: Check required fields
    if (!movie_title || !user || rating === undefined) {
        return res.status(400).json({ error: "movie_title, user, and rating are required" });
    }

    // Validation: Check rating is between 1 and 5
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    // Insert into database
    db.run(
        `INSERT INTO reviews (movie_title, user, rating, review) VALUES (?, ?, ?, ?)`,
        [movie_title, user, rating, review || ""],
        function (err) {
            if (err) {
                console.error("Database Insert Error:", err.message);
                return res.status(500).json({ error: "Failed to insert review" });
            }
            res.status(201).json({ id: this.lastID, message: "Review added successfully" });
        }
    );
});

// Route: Update a review by ID
app.put('/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { movie_title, user, rating, review } = req.body;
    
    if (!movie_title || !user || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Updating review with ID: ${id}`);

    db.run(
        `UPDATE reviews SET movie_title = ?, user = ?, rating = ?, review = ? WHERE id = ?`,
        [movie_title, user, rating, review, id],
        function (err) {
            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.json({ message: 'Review updated successfully' });
        }
    );
});

// Route: Delete a review by ID
app.delete('/reviews/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Deleting review with ID: ${id}`);

    db.run('DELETE FROM reviews WHERE id = ?', [id], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    });
});

// Route: Search movies using TMDB API
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const movies = await fetchMovies(query);
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});

process.on('SIGINT', () => {
    console.log("Closing database connection...");
    db.close((err) => {
        if (err) {
            console.error("Error closing database:", err.message);
        }
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
