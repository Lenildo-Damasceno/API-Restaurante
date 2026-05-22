# API-Controle-de-Estoque

CRUD REST simples para controle de estoque.

## Métodos REST

| Método | Função     |
|--------|------------|
| GET    | buscar     |
| POST   | cadastrar  |
| PUT    | atualizar  |
| DELETE | deletar    |

## Endpoints

- `GET /itens` lista todos os itens
- `GET /itens/{id}` busca um item por id
- `POST /itens` cadastra um item
- `PUT /itens/{id}` atualiza um item
- `DELETE /itens/{id}` remove um item

## Executar

```bash
python app.py
```