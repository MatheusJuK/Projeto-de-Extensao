// backend/server.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const db = require('./database'); // Importe o banco de dados

const app = express();
const port = 3001;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { buffer } = req.file;
    const result = await Tesseract.recognize(buffer, 'eng');
    const extractedText = result.data.text;

    // Inserir o texto extraído no banco de dados
    db.run(`INSERT INTO extractions (extractedText) VALUES (?)`, [extractedText], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
      }
      res.json({ id: this.lastID, text: extractedText });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a imagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get('/extractions', (req, res) => {
  db.all(`SELECT * FROM extractions ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar no banco de dados' });
    } else {
      res.json(rows);
    }
  });
});