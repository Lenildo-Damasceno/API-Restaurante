# API-Restaurante

API-Restaurante usando Node.js, Express, Sequelize e arquitetura MVC.

## Estrutura

```text
src/
|- config/
|- controllers/
|- database/
|- models/
|- routes/
|- views/
`- app.js
```

## Entidades

- `clientes`
- `pratos`
- `pedidos`
- `itensPedido`

## Scripts

- `npm run dev`
- `npm start`

## Rotas principais

- `GET /status`
- `GET /clientes`
- `GET /pratos`
- `GET /pedidos`
- `GET /itens-pedido`

## Banco de dados

O arquivo SQLite padrao fica em `src/database/restaurante.sqlite`.

## Observacao

O projeto usa Sequelize para sincronizar as tabelas a partir dos models.
