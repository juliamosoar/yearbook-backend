import prisma from '../prisma/client.js';

// select que omite senhaHash — nunca retorna senha na API
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
};

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res) {
  try {
    const alunos = await prisma.aluno.findMany({
      select: selectSemSenha,
    });

    res.json(alunos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar alunos' });
  }
}

// GET /alunos/:id — busca aluno por ID
export async function buscarAluno(req, res) {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar aluno' });
  }
}

// POST /alunos — cria novo aluno
export async function criarAluno(req, res) {
  try {
    const {
      nome,
      email,
      senhaHash,
      cidade,
      frase,
      planosFuturos,
      fotoUrl,
      role,
    } = req.body;

    // validação mínima obrigatória
    if (!nome || !email || !senhaHash) {
      return res.status(400).json({
        erro: 'nome, email e senhaHash são obrigatórios',
      });
    }

    const alunoCriado = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
        fotoUrl,
        role,
      },
      select: selectSemSenha,
    });

    res.status(201).json(alunoCriado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao criar aluno',
    });
  }
}

// PUT /alunos/:id — atualiza aluno
export async function atualizarAluno(req, res) {
  try {
    const { id } = req.params;

    const {
      nome,
      email,
      senhaHash,
      cidade,
      frase,
      planosFuturos,
      fotoUrl,
      role,
    } = req.body;

    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
        fotoUrl,
        role,
      },
      select: selectSemSenha,
    });

    res.json(alunoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}

// DELETE /alunos/:id — remove aluno
export async function deletarAluno(req, res) {
  try {
    const { id } = req.params;

    const aluno = await prisma.aluno.findUnique({
      where: { id: Number(id) },
    });

    if (!aluno) {
      return res.status(404).json({
        erro: 'Aluno não encontrado',
      });
    }

    await prisma.aluno.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao deletar aluno',
    });
  }
}