import { Cliente, ItemPedido, Pedido, Prato } from '../models/index.js';
import { randomUUID } from 'node:crypto';


function montarNavegacao() {
  return [
    { label: 'Dashboard', href: '/painel' },
    { label: 'Clientes', href: '/painel/clientes' },
    { label: 'Pratos', href: '/painel/pratos' },
    { label: 'Pedidos', href: '/painel/pedidos' },
    { label: 'Itens do Pedido', href: '/painel/itens-pedido' }
  ];
}


function lerFeedback(req) {
  if (req.query.success) {
    return { tipo: 'success', mensagem: req.query.success };
  }

  if (req.query.error) {
    return { tipo: 'error', mensagem: req.query.error };
  }

  return null;
}


function montarViewBase(req, pageTitle, currentPath) {
  return {
    pageTitle,
    currentPath,
    navegacao: montarNavegacao(),
    statusBanco: req.app.locals.statusBanco,
    feedback: lerFeedback(req),
    usuario: req.user // Passa os dados do usuário vindo do JWT para o EJS
  };
}


function redirecionarComSucesso(res, caminho, mensagem) {
  return res.redirect(`${caminho}?success=${encodeURIComponent(mensagem)}`);
}


function redirecionarComErro(res, caminho, mensagem) {
  return res.redirect(`${caminho}?error=${encodeURIComponent(mensagem)}`);
}


function extrairDadosCliente(body) {
  const nome = body.nome?.trim();
  const telefone = body.telefone?.trim() || null;

  if (!nome) {
    const erro = new Error('Informe o nome do cliente.');
    erro.statusCode = 400;
    throw erro;
  }

  return { nome, telefone };
}


function extrairDadosPrato(body) {
  const nome = body.nome?.trim();
  const categoria = body.categoria?.trim() || null;
  const preco = Number(body.preco);

  if (!nome) {
    const erro = new Error('Informe o nome do prato.');
    erro.statusCode = 400;
    throw erro;
  }

  if (Number.isNaN(preco) || preco < 0) {
    const erro = new Error('Informe um preco valido para o prato.');
    erro.statusCode = 400;
    throw erro;
  }

  return { nome, categoria, preco };
}


async function validarClienteDoPedido(idCliente) {
  if (!idCliente) {
    return null
  }

  const cliente = await Cliente.findByPk(idCliente)

  if (!cliente) {
    const erro = new Error('O cliente selecionado nao existe.');
    erro.statusCode = 400;
    throw erro;
  }

  return idCliente
}


async function validarPrato(idPrato) {
  if (!idPrato) {
    return null
  }

  const prato = await Prato.findByPk(idPrato)

  if (!prato) {
    const erro = new Error('O prato selecionado nao existe.');
    erro.statusCode = 400;
    throw erro;
  }

  return idPrato
}


async function extrairDadosPedido(body) {
  const mesa = Number(body.mesa);
  const status = body.status?.trim() || 'aberto';
  const idCliente = body.idCliente?.trim() || null;
  const idPrato = body.idPrato?.trim() || null;

  if (!Number.isInteger(mesa) || mesa <= 0) {
    const erro = new Error('Informe um numero de mesa valido.');
    erro.statusCode = 400;
    throw erro;
  }

  await validarClienteDoPedido(idCliente);
  await validarPrato(idPrato);

  return { mesa, status, idCliente, idPrato };
}


async function extrairDadosItemPedido(body) {
  const quantidade = Number(body.quantidade);
  const idPedido = body.idPedido?.trim();
  const idPrato = body.idPrato?.trim();

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    const erro = new Error('Informe uma quantidade valida para o item.');
    erro.statusCode = 400;
    throw erro;
  }

  if (!idPedido) {
    const erro = new Error('Selecione um pedido.');
    erro.statusCode = 400;
    throw erro;
  }

  if (!idPrato) {
    const erro = new Error('Selecione um prato.');
    erro.statusCode = 400;
    throw erro;
  }

  const [pedido, prato] = await Promise.all([
    Pedido.findByPk(idPedido),
    Prato.findByPk(idPrato)
  ])

  if (!pedido) {
    const erro = new Error('O pedido selecionado nao existe.');
    erro.statusCode = 400;
    throw erro;
  }

  if (!prato) {
    const erro = new Error('O prato selecionado nao existe.');
    erro.statusCode = 400;
    throw erro;
  }

  return { quantidade, idPedido, idPrato };
}

/**
 * Renderiza o dashboard principal com um resumo das entidades.
 */
export async function mostrarDashboard(req, res, next) {
  try {
    const [clientes, pratos, pedidos, itensPedido] = await Promise.all([
      Cliente.findAll(),
      Prato.findAll(),
      Pedido.findAll({
        include: [
          { model: Cliente, as: 'cliente' },
          {
            model: ItemPedido,
            as: 'itens',
            include: [{ model: Prato, as: 'prato' }]
          }
        ]
      }),
      ItemPedido.findAll()
    ])

    return res.render('dashboard', {
      ...montarViewBase(req, 'Dashboard do Restaurante', req.originalUrl),
      resumo: {
        clientes: clientes.length,
        pratos: pratos.length,
        pedidos: pedidos.length,
        itensPedido: itensPedido.length
      },
      usuario: req.user,
      pedidosRecentes: pedidos.slice(0, 5),
      pratosDestaque: pratos.slice(0, 5)
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Renderiza a pagina EJS com a lista de clientes.
 */
export async function mostrarPaginaClientes(req, res, next) {
  try {
    const clientes = await Cliente.findAll()

    return res.render('clientes', {
      ...montarViewBase(req, 'Clientes', req.originalUrl),
      clientes
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Renderiza a pagina EJS com a lista de pratos.
 */
export async function mostrarPaginaPratos(req, res, next) {
  try {
    const pratos = await Prato.findAll()

    return res.render('pratos', {
      ...montarViewBase(req, 'Pratos', req.originalUrl),
      pratos
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Renderiza a pagina EJS com a lista de pedidos.
 */
export async function mostrarPaginaPedidos(req, res, next) {
  try {
    const [pedidos, clientes, pratos] = await Promise.all([
      Pedido.findAll({
        include: [
          { model: Cliente, as: 'cliente' },
          {
            model: ItemPedido,
            as: 'itens',
            include: [{ model: Prato, as: 'prato' }]
          }
        ]
      }),
      Cliente.findAll(),
      Prato.findAll()
    ])

    return res.render('pedidos', {
      ...montarViewBase(req, 'Pedidos', req.originalUrl),
      pedidos,
      clientes,
      pratos
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Renderiza a pagina EJS com a lista de itens do pedido.
 */
export async function mostrarPaginaItensPedido(req, res, next) {
  try {
    const [itensPedido, pedidos, pratos] = await Promise.all([
      ItemPedido.findAll({
        include: [
          { model: Prato, as: 'prato' },
          { model: Pedido, as: 'pedido' }
        ]
      }),
      Pedido.findAll(),
      Prato.findAll()
    ])

    return res.render('itens-pedido', {
      ...montarViewBase(req, 'Itens do Pedido', req.originalUrl),
      itensPedido,
      pedidos,
      pratos
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Processa o cadastro de cliente enviado pela tela EJS.
 */
export async function cadastrarClientePelaPagina(req, res) {
  try {
    const dadosCliente = extrairDadosCliente(req.body)

    await Cliente.create({
      id: randomUUID(),
      ...dadosCliente
    })

    return redirecionarComSucesso(res, '/painel/clientes', 'Cliente cadastrado com sucesso.');
  } catch (error) {
    return redirecionarComErro(res, '/painel/clientes', error.message);
  }
}

/**
 * Processa o cadastro de prato enviado pela tela EJS.
 */
export async function cadastrarPratoPelaPagina(req, res) {
  try {
    const dadosPrato = extrairDadosPrato(req.body)

    await Prato.create({
      id: randomUUID(),
      ...dadosPrato
    })

    return redirecionarComSucesso(res, '/painel/pratos', 'Prato cadastrado com sucesso.');
  } catch (error) {
    return redirecionarComErro(res, '/painel/pratos', error.message);
  }
}

/**
 * Processa o cadastro de pedido enviado pela tela EJS.
 * Se idPrato for fornecido, cria automaticamente um item do pedido.
 */
export async function cadastrarPedidoPelaPagina(req, res) {
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

    return redirecionarComSucesso(res, '/painel/pedidos', 'Pedido cadastrado com sucesso.');
  } catch (error) {
    return redirecionarComErro(res, '/painel/pedidos', error.message);
  }
}

/**
 * Processa o cadastro de item do pedido enviado pela tela EJS.
 */
export async function cadastrarItemPedidoPelaPagina(req, res) {
  try {
    const dadosItemPedido = await extrairDadosItemPedido(req.body)

    await ItemPedido.create({
      id: randomUUID(),
      ...dadosItemPedido
    })

    return redirecionarComSucesso(
      res,
      '/painel/itens-pedido',
      'Item do pedido cadastrado com sucesso.'
    );
  } catch (error) {
    return redirecionarComErro(res, '/painel/itens-pedido', error.message);
  }
}
