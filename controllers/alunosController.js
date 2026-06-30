import prisma from '../prisma/client.js';

// select que omite senhaHash — reutilizado em todas as queries de alunos
const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
  // senhaHash NÃO está aqui — nunca retornado pela API
};

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({
    select: selectSemSenha,
  });

  res.json(alunos);
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res) {
  const { id } = req.params;

  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) },
    select: selectSemSenha,
  });

  if (!aluno) {
    return res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }

  res.json(aluno);
}

// POST /alunos — cria um novo aluno
export async function criarAluno(req, res) {
  const {
    nome,
    email,
    senhaHash,
    cidade,
    frase,
    planosFuturos,
  } = req.body;

  const alunoCriado = await prisma.aluno.create({
    data: {
      nome,
      email,
      senhaHash,
      cidade,
      frase,
      planosFuturos,
    },
    select: selectSemSenha,
  });

  res.status(201).json(alunoCriado);
}

// PUT /alunos/:id — atualiza um aluno existente
export async function atualizarAluno(req, res) {
  const { id } = req.params;

  const {
    nome,
    email,
    senhaHash,
    cidade,
    frase,
    planosFuturos,
  } = req.body;

  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: {
        id: Number(id),
      },
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
      },
      select: selectSemSenha,
    });

    res.json(alunoAtualizado);
  } catch (error) {
    res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}

// DELETE /alunos/:id — deleta um aluno
export async function deletarAluno(req, res) {
  const { id } = req.params;

  try {
    await prisma.aluno.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(204).end();
  } catch (error) {
    res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}