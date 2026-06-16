import { Cliente, ItemPedido, Pedido, Prato } from '../models/index.js';
import { randomUUID } from 'node:crypto';

/**
 * Valida se o cliente informado existe antes de salvar o pedido.
 */
async function validarClienteDoPedido(idCliente) {
  if (!idCliente) {
    return null
  }

  const cliente = await Cliente.findByPk(idCliente)

  if (!cliente) {
    const erro = new Error('O cliente informado nao existe.');
    erro.statusCode = 404;
    throw erro;
  }

  return idCliente
}

/**
 * Valida se o prato informado existe.
 */
async function validarPrato(idPrato) {
  if (!idPrato) {
    return null
  }

  const prato = await Prato.findByPk(idPrato)

  if (!prato) {
    const erro = new Error('O prato informado nao existe.');
    erro.statusCode = 404;
    throw erro;
  }

  return idPrato
}

/**
 * Organiza e valida os dados completos do pedido.
 * Esse helper e usado no POST e no PUT.
 */
async function extrairDadosPedido(body) {
  const mesa = Number(body.mesa);
  const status = body.status?.trim() || 'aberto';
  const idCliente = body.idCliente?.trim() || null;
  const idPrato = body.idPrato?.trim() || null;

  if (!Number.isInteger(mesa) || mesa <= 0) {
    const erro = new Error('O campo mesa deve ser um numero inteiro maior que zero.');
    erro.statusCode = 400;
    throw erro;
  }

  await validarClienteDoPedido(idCliente);
  await validarPrato(idPrato);

  return { mesa, status, idCliente, idPrato };
}

/**
 * Organiza e valida os dados parciais do pedido.
 * Esse helper e usado no PATCH.
 */
async function extrairDadosPedidoParcial(body) {
  const dadosPedido = {};

  if (body.mesa !== undefined) {
    const mesa = Number(body.mesa);

    if (!Number.isInteger(mesa) || mesa <= 0) {
      const erro = new Error('O campo mesa deve ser um numero inteiro maior que zero.');
      erro.statusCode = 400;
      throw erro;
    }

    dadosPedido.mesa = mesa;
  }

  if (body.status !== undefined) {
    dadosPedido.status = body.status?.trim() || 'aberto';
  }

  if (body.idCliente !== undefined) {
    const idCliente = body.idCliente?.trim() || null;
    await validarClienteDoPedido(idCliente);
    dadosPedido.idCliente = idCliente;
  }

  if (Object.keys(dadosPedido).length === 0) {
    const erro = new Error('Envie pelo menos um campo para atualizar no PATCH.');
    erro.statusCode = 400;
    throw erro;
  }

  return dadosPedido;
}

/**
 * Metodo GET
 * Lista todos os pedidos com cliente e itens do pedido.
 */
export async function listarPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll()

    return res.json(pedidos)
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo GET
 * Busca um pedido especifico com seus relacionamentos.
 */
export async function buscarPedidoPorId(req, res) {
  try {
    const pedido = await Pedido.findByPk(req.params.id)

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    return res.json(pedido)
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo POST
 * Cria um novo pedido com mesa, status e cliente opcional.
 * Se idPrato for fornecido, cria automaticamente um item com quantidade 1.
 */
export async function criarPedido(req, res) {
  try {
    const dadosPedido = await extrairDadosPedido(req.body)
    const { idPrato, ...dadosPedidoSemPrato } = dadosPedido

    const pedido = await Pedido.create({
      id: randomUUID(),
      ...dadosPedidoSemPrato
    })

    if (idPrato) {
      await ItemPedido.create({
        id: randomUUID(),
        idPedido: pedido.id,
        idPrato: idPrato,
        quantidade: 1
      })
    }

    return res.status(201).json({
      message: 'Pedido criado com sucesso.',
      data: pedido
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo PUT
 * Atualiza todos os dados de um pedido existente.
 */
export async function atualizarPedido(req, res) {
  try {
    const pedido = await Pedido.findByPk(req.params.id)

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    const dadosPedido = await extrairDadosPedido(req.body)
    await pedido.update(dadosPedido)

    return res.json({
      message: 'Pedido atualizado com sucesso.',
      data: pedido
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo PATCH
 * Atualiza apenas parte dos dados de um pedido.
 */
export async function atualizarPedidoParcial(req, res) {
  try {
    const pedido = await Pedido.findByPk(req.params.id)

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    const dadosPedido = await extrairDadosPedidoParcial(req.body)
    await pedido.update(dadosPedido)

    return res.json({
      message: 'Pedido atualizado parcialmente com sucesso.',
      data: pedido
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo DELETE
 * Remove um pedido e tambem apaga seus itens para evitar vinculo orfao.
 */
export async function removerPedido(req, res) {
  try {
    const pedido = await Pedido.findByPk(req.params.id)

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    await ItemPedido.destroy({ where: { idPedido: req.params.id } })
    await pedido.destroy()

    return res.json({
      message: 'Pedido removido com sucesso.'
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}
