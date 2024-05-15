import express from 'express';
import router from './routes/router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('assets'));
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

app.get(`*`, (req, res) => {
    res.send(`<center><h1>🌵PÁGINA NO ENCONTRADA O NO EXISTE🦖</h1></center>`);
});
