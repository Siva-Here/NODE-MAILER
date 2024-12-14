const express = require('express');
const cors = require('cors');
const sendMailController = require('../controller/sendMailController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("I am a server");
});

app.post('/send-email', sendMailController);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
