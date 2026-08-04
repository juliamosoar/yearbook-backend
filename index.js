import 'dotenv/config';
import express from 'express';
import logger from './middlewares/logger.js';
import tratarErro from './middlewares/erro.js';
import alunosRouter from './routes/alunos.js';
import mensagensRouter from './routes/mensagens.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ mensagem: 'Yearbook API está no ar! 🎓' });
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/alunos', alunosRouter);
app.use('/mensagens', mensagensRouter);

// Middleware de erro — SEMPRE por último, depois das rotas
app.use(tratarErro);

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

export default app;