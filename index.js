const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Chave aleatória para criptografia
const iv = crypto.randomBytes(16);  // Vetor de inicialização aleatório

// Rota para criptografar
app.post('/encrypt', (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensagem não fornecida' });

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    res.json({ encrypted, iv: iv.toString('hex') });
});

// Rota para descriptografar
app.post('/decrypt', (req, res) => {
    const { encrypted, iv } = req.body;
    if (!encrypted || !iv) return res.status(400).json({ error: 'Dados incompletos' });

    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    res.json({ decrypted });
});

// Verificar funcionamento
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));




