require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8081;

// Configurações gerais
app.use(bodyParser.json());

// Algoritmo e chave de criptografia
const algorithm = 'aes-256-cbc';
const apiKey = process.env.API_KEY;

// Função para criptografar a mensagem
function encryptMessage(message, key) {
  const iv = crypto.randomBytes(16); // Vetor de inicialização
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
}

// Função para descriptografar a mensagem
function decryptMessage(encryptedData, iv, key) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Middleware para validar a API key
function validateApiKey(req, res, next) {
  const userApiKey = req.headers['x-api-key'];
  if (userApiKey !== apiKey) {
    return res.status(403).json({ error: 'Chave de API inválida!' });
  }
  next();
}

// Rota para criptografar mensagens
app.post('/encrypt', validateApiKey, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mensagem não fornecida!' });
  }

  const key = crypto.randomBytes(32).toString('hex'); // Gerar chave aleatória
  const encrypted = encryptMessage(message, key);

  res.json({ encryptedData: encrypted.encryptedData, iv: encrypted.iv, key });
});

// Rota para descriptografar mensagens
app.post('/decrypt', validateApiKey, (req, res) => {
  const { encryptedData, iv, key } = req.body;
  if (!encryptedData || !iv || !key) {
    return res.status(400).json({ error: 'Dados de descriptografia incompletos!' });
  }

  try {
    const decryptedMessage = decryptMessage(encryptedData, iv, key);
    res.json({ message: decryptedMessage });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao descriptografar a mensagem!' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
