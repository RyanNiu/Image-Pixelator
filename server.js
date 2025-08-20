import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static('.'));

// 路由规则 - 模拟 vercel.json 的配置
app.get('/ru', (req, res) => {
  res.sendFile(path.join(__dirname, 'ru', 'index.html'));
});

app.get('/ru/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ru', 'index.html'));
});

app.get('/fr', (req, res) => {
  res.sendFile(path.join(__dirname, 'fr', 'index.html'));
});

app.get('/fr/', (req, res) => {
  res.sendFile(path.join(__dirname, 'fr', 'index.html'));
});

app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

app.get('/en/', (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

app.get('/zh', (req, res) => {
  res.sendFile(path.join(__dirname, 'zh', 'index.html'));
});

app.get('/zh/', (req, res) => {
  res.sendFile(path.join(__dirname, 'zh', 'index.html'));
});

app.get('/es', (req, res) => {
  res.sendFile(path.join(__dirname, 'es', 'index.html'));
});

app.get('/es/', (req, res) => {
  res.sendFile(path.join(__dirname, 'es', 'index.html'));
});

// 默认路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Test URLs:');
  console.log('- http://localhost:3000/ru/ (should show Russian version with test text)');
  console.log('- http://localhost:3000/fr/ (should show French version)');
});