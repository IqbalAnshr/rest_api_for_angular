const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2') 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dynamic_landingpage'
})

app.use(express.json());


function query(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

app.get('/', async (req, res) => {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    });



    try {
        const [
            booksForHero,
            bestSellerBooks,
            featuredBooks,
            latestBooks,
            bestReviews,
            onsaleBooks
        ] = await Promise.all([
            query('SELECT * FROM books LIMIT 3'),
            query('SELECT * FROM books ORDER BY sold DESC LIMIT 6'),
            query('SELECT * FROM books LIMIT 3'),
            query('SELECT * FROM books ORDER BY created_at DESC LIMIT 3'),
            query('SELECT * FROM books ORDER BY price DESC LIMIT 3'),
            query('SELECT * FROM books ORDER BY sold LIMIT 3')
        ]);

        res.json({
            booksForHero,
            bestSellerBooks,
            featuredBooks,
            latestBooks,
            bestReviews,
            onsaleBooks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})

app.get('/booksForHero', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books LIMIT 3');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})   

app.get('/bestSellerBooks', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books ORDER BY sold DESC LIMIT 6');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})

app.get('/featuredBooks', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books LIMIT 3');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})

app.get('/latestBooks', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books ORDER BY created_at DESC LIMIT 3');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})

app.get('/bestReviews', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books ORDER BY price DESC LIMIT 3');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})

app.get('/onsaleBooks', async (req, res) => {
    try {
        const result = await query('SELECT * FROM books ORDER BY sold LIMIT 3');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
