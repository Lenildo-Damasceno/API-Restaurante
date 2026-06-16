import { ItemPedido, Pedido, Prato } from '../models/index.js';
import { randomUUID } from 'node:crypto';


async function validarPedido(idPedido) {
  const pedido = await Pedido.findByPk(idPedido)

  if (!pedido) {
    const erro = new Error('O pedido informado nao existe.');
    erro.statusCode = 404;
    throw erro;
  }
}



async function validarPrato(idPrato) {
  const prato = await Prato.findByPk(idPrato)

  if (!prato) {
    const erro = new Error('O prato informado nao existe.');
    erro.statusCode = 404;
    throw erro;
  }
}




async function extrairDadosItemPedido(body) {
  const quantidade = Number(body.quantidade);
  const idPedido = body.idPedido?.trim();
  const idPrato = body.idPrato?.trim();

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    const erro = new Error('O campo quantidade deve ser um numero inteiro maior que zero.');
    erro.statusCode = 400;
    throw erro;
  }

  if (!idPedido) {
    const erro = new Error('O campo idPedido e obrigatorio.');
    erro.statusCode = 400;
    throw erro;
  }

  if (!idPrato) {
    const erro = new Error('O campo idPrato e obrigatorio.');
    erro.statusCode = 400;
    throw erro;
  }

  await validarPedido(idPedido);
  await validarPrato(idPrato);

  return { quantidade, idPedido, idPrato };
}



async function extrairDadosItemPedidoParcial(body) {
  const dadosItemPedido = {};

  if (body.quantidade !== undefined) {
    const quantidade = Number(body.quantidade);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      const erro = new Error('O campo quantidade deve ser um numero inteiro maior que zero.');
      erro.statusCode = 400;
      throw erro;
    }

    dadosItemPedido.quantidade = quantidade;
  }

  if (body.idPedido !== undefined) {
    const idPedido = body.idPedido?.trim();

    if (!idPedido) {
      const erro = new Error('O campo idPedido nao pode ficar vazio.');
      erro.statusCode = 400;
      throw erro;
    }

    await validarPedido(idPedido);
    dadosItemPedido.idPedido = idPedido;
  }

  if (body.idPrato !== undefined) {
    const idPrato = body.idPrato?.trim();

    if (!idPrato) {
      const erro = new Error('O campo idPrato nao pode ficar vazio.');
      erro.statusCode = 400;
      throw erro;
    }

    await validarPrato(idPrato);
    dadosItemPedido.idPrato = idPrato;
  }

  if (Object.keys(dadosItemPedido).length === 0) {
    const erro = new Error('Envie pelo menos um campo para atualizar no PATCH.');
    erro.statusCode = 400;
    throw erro;
  }

  return dadosItemPedido;
}





export async function listarItensPedido(req, res) {
  try {
    const itensPedido = await ItemPedido.findAll()

    return res.json(itensPedido)
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}



export async function buscarItemPedidoPorId(req, res) {
  try {
    const itemPedido = await ItemPedido.findByPk(req.params.id)

    if (!itemPedido) {
      return res.status(404).json({ message: 'Item do pedido não encontrado.' });
    }

    return res.json(itemPedido)
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}



export async function criarItemPedido(req, res) {
  try {
    const dadosItemPedido = await extrairDadosItemPedido(req.body)
    const itemPedido = await ItemPedido.create({
      id: randomUUID(),
      ...dadosItemPedido
    })

    return res.status(201).json({
      message: 'Item do pedido criado com sucesso.',
      data: itemPedido
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}




export async function atualizarItemPedido(req, res) {
  try {
    const itemPedido = await ItemPedido.findByPk(req.params.id)

    if (!itemPedido) {
      return res.status(404).json({ message: 'Item do pedido não encontrado.' });
    }

    const dadosItemPedido = await extrairDadosItemPedido(req.body)
    await itemPedido.update(dadosItemPedido)

    return res.json({
      message: 'Item do pedido atualizado com sucesso.',
      data: itemPedido
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}



export async function atualizarItemPedidoParcial(req, res) {
  try {
    const itemPedido = await ItemPedido.findByPk(req.params.id)

    if (!itemPedido) {
      return res.status(404).json({ message: 'Item do pedido não encontrado.' });
    }

    const dadosItemPedido = await extrairDadosItemPedidoParcial(req.body)
    await itemPedido.update(dadosItemPedido)

    return res.json({
      message: 'Item do pedido atualizado parcialmente com sucesso.',
      data: itemPedido
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}



export async function removerItemPedido(req, res) {
  try {
    const itemPedido = await ItemPedido.findByPk(req.params.id)

    if (!itemPedido) {
      return res.status(404).json({ message: 'Item do pedido não encontrado.' });
    }

    await itemPedido.destroy()

    return res.json({
      message: 'Item do pedido removido com sucesso.'
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}
