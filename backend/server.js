// backend/server.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3001;

// Configuração do CORS para permitir acesso do frontend
app.use(cors());

// Configuração de upload com Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { buffer } = req.file;
    // Extração de texto com Tesseract
    const result = await Tesseract.recognize(buffer, 'eng');
    const extractedText = result.data.text;
    res.json({ text: extractedText });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a imagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
