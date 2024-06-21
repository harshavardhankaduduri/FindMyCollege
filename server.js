const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const usersPath = path.join(__dirname, 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ username, password });
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usersPath = path.join(__dirname, 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
});

app.get('/colleges', (req, res) => {
    const collegesPath = path.join(__dirname, 'data', 'colleges.json');
    let colleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'));
    
    const { page = 1, limit = 10, search = '', state = '' } = req.query;
    
    if (search) {
        colleges = colleges.filter(college =>
            college['College Name'].toLowerCase().includes(search.toLowerCase()) ||
            college['University Name'].toLowerCase().includes(search.toLowerCase()) ||
            college['College Type'].toLowerCase().includes(search.toLowerCase()) ||
            college['State Name'].toLowerCase().includes(search.toLowerCase()) ||
            college['District Name'].toLowerCase().includes(search.toLowerCase())
        );
    }

    if (state) {
        colleges = colleges.filter(college => college['State Name'] === state);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedColleges = colleges.slice(startIndex, endIndex);

    res.status(200).json({
        total: colleges.length,
        page: parseInt(page),
        limit: parseInt(limit),
        colleges: paginatedColleges
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
