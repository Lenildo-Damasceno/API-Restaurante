import { Cliente, Pedido } from '../models/index.js';
import { randomUUID } from 'node:crypto';

/**
 * Organiza e valida os dados completos do cliente.
 * Esse helper e usado por PUT, porque no PUT normalmente enviamos o objeto inteiro.
 */
function extrairDadosCliente(body) {
  const nome = body.nome?.trim();
  const telefone = body.telefone?.trim() || null;

  if (!nome) {
    const erro = new Error('O campo nome e obrigatorio.');
    erro.statusCode = 400;
    throw erro;
  }

  return { nome, telefone };
}

/**
 * Organiza e valida apenas os campos enviados parcialmente.
 * Esse helper e usado por PATCH, porque no PATCH podemos alterar so um campo.
 */
function extrairDadosClienteParcial(body) {
  const dadosCliente = {};

  if (body.nome !== undefined) {
    const nome = body.nome?.trim();

    if (!nome) {
      const erro = new Error('O campo nome nao pode ficar vazio.');
      erro.statusCode = 400;
      throw erro;
    }

    dadosCliente.nome = nome;
  }

  if (body.telefone !== undefined) {
    dadosCliente.telefone = body.telefone?.trim() || null;
  }

  if (Object.keys(dadosCliente).length === 0) {
    const erro = new Error('E necessario enviar pelo menos um campo para atualizar.');
    erro.statusCode = 400;
    throw erro;
  }

  return dadosCliente;
}

/**
 * Metodo GET
 * Lista todos os clientes cadastrados no banco.
 */
export async function listarClientes(req, res) {
  try {
    const clientes = await Cliente.findAll()

    return res.json(clientes)
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo GET
 * Busca apenas um cliente pelo ID informado na URL.
 */
export async function buscarClientePorId(req, res) {
  try {
    const cliente = await Cliente.findByPk(req.params.id)

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    return res.json(cliente)
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo POST
 * Cria um novo cliente usando os dados enviados no corpo da requisicao.
 */
export async function criarCliente(req, res) {
  try {
    const dadosCliente = extrairDadosCliente(req.body)
    const cliente = await Cliente.create({
      id: randomUUID(),
      ...dadosCliente
    })

    return res.status(201).json({
      message: 'Cliente criado com sucesso.',
      data: cliente
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo PUT
 * Atualiza todos os dados de um cliente existente.
 * No PUT o ideal e mandar o objeto completo.
 */
export async function atualizarCliente(req, res) {
  try {
    const cliente = await Cliente.findByPk(req.params.id) // metodo get para buscar o cliente pelo ID

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const dadosCliente = extrairDadosCliente(req.body)
    await cliente.update(dadosCliente)

    return res.json({
      message: 'Cliente atualizado com sucesso.',
      data: cliente
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo PATCH
 * Atualiza apenas parte dos dados do cliente.
 * Exemplo: alterar so o telefone sem reenviar nome.
 */
export async function atualizarClienteParcial(req, res) {
  try {
    const cliente = await Cliente.findByPk(req.params.id)

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const dadosCliente = extrairDadosClienteParcial(req.body)
    await cliente.update(dadosCliente)

    return res.json({
      message: 'Cliente atualizado parcialmente com sucesso.',
      data: cliente
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}

/**
 * Metodo DELETE
 * Remove um cliente, mas antes verifica se ele ja possui pedidos vinculados.
 */
export async function removerCliente(req, res) {
  try {
    const cliente = await Cliente.findByPk(req.params.id)

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const quantidadePedidos = await Pedido.count({ where: { idCliente: req.params.id } })

    if (quantidadePedidos > 0) {
      return res.status(409).json({
        message: 'Este cliente possui pedidos vinculados e nao pode ser removido.' 
      });
    }

    await cliente.destroy()

    return res.json({
      message: 'Cliente removido com sucesso.'
    })
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Erro interno no servidor' });
  }
}
