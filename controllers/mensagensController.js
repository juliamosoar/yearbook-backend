import prisma from '../prisma/client.js';

// GET /mensagens — lista todas as mensagens (mais recentes primeiro)
export async function listarMensagens(req, res) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        autor: {
          select: {
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });

    res.json(mensagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao listar mensagens.',
    });
  }
}

// POST /mensagens — cria uma nova mensagem
export async function criarMensagem(req, res) {
  try {
    const { texto, imagemUrl, autorId } = req.body;

    // validação
    if (!texto) {
      return res.status(400).json({
        erro: 'O campo texto é obrigatório.',
      });
    }

    const mensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: Number(autorId),
      },
    });

    res.status(201).json(mensagem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao criar mensagem.',
    });
  }
}

// DELETE /mensagens/:id — deleta uma mensagem
export async function deletarMensagem(req, res) {
  try {
    const id = Number(req.params.id);

    // valida se o ID é válido
    if (isNaN(id)) {
      return res.status(400).json({
        erro: 'ID inválido.',
      });
    }

    // verifica se existe
    const mensagem = await prisma.mensagem.findUnique({
      where: { id },
    });

    if (!mensagem) {
      return res.status(404).json({
        erro: 'Mensagem não encontrada.',
      });
    }

    // deleta
    await prisma.mensagem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao deletar mensagem.',
    });
  }
}