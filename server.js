const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-form', (req, res) => {
    const { fname, lname, phone, email } = req.body;
    console.log('Received data:', { fname, lname, phone, email });

    fs.readFile('submissions.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return res.status(500).send(err.toString());
        }

        let submissions = data ? JSON.parse(data) : [];
        if (submissions.some(submission => submission.email === email)) {
            return res.status(400).json({ message: 'Email already used!' });
        }

        submissions.push({ fname, lname, phone, email });

        fs.writeFile('submissions.json', JSON.stringify(submissions, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send(err.toString());
            }

            console.log('Data saved to file');
            res.json({ message: 'Form submitted successfully!' });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


