const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); // Import mysql2 package
const path = require('path'); // Import path module

const app = express();
const port = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Majicmen64',
    database: 'stocks_recommendation'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Route to get recommended stocks based on user input
app.post('/recommended-stocks', (req, res) => {
    const { userStocks } = req.body;

    // Query all stocks from database
    connection.query('SELECT stock_symbol FROM stocks', (error, results) => {
        if (error) {
            console.error('Error retrieving stocks:', error);
            res.status(500).json({ error: 'Failed to retrieve stocks' });
        } else {
            const allStocks = results.map(row => row.stock_symbol);

            // Filter out user stocks and return 3 random stocks
            const recommendedStocks = getRandomStocks(allStocks, userStocks);

            res.json({ recommendedStocks });
        }
    });
});

// Helper function to get 3 random stocks
function getRandomStocks(allStocks, userStocks) {
    const availableStocks = allStocks.filter(stock => !userStocks.includes(stock));
    const randomStocks = [];
    while (randomStocks.length < 3 && availableStocks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableStocks.length);
        randomStocks.push(availableStocks.splice(randomIndex, 1)[0]);
    }
    return randomStocks;
}

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
