// Middleware de log — registra informações sobre cada requisição
export default function logger(req, res, next) {
  const inicio = Date.now();               // marca o início da requisição
  const agora = new Date().toISOString();  // data e hora da requisição
  const metodo = req.method;               // método HTTP (GET, POST, PUT, DELETE...)
  const url = req.originalUrl;             // URL da requisição

  // Executa quando a resposta termina de ser enviada
  res.on('finish', () => {
    const duracao = Date.now() - inicio;   // tempo de resposta em ms
    const status = res.statusCode;         // código HTTP da resposta

    console.log(
      `[${agora}] ${metodo} ${url} ${status} - ${duracao} ms`
    );
  });

  next(); // continua para o próximo middleware ou rota
}