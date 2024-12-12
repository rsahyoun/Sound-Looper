const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Route to render index page
app.get('/', (req, res) => {
    res.render('index');
});

// API endpoint to save audio
app.post('/api/save-audio', async (req, res) => {
    try {
        // Handle audio data saving
        audioStorage.push(req.body);
        res.json({ success: true, message: 'Audio saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});