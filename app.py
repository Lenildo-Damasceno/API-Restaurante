import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse


class InventoryStore:
    def __init__(self):
        self._items = {}
        self._next_id = 1

    def list_items(self):
        return list(self._items.values())

    def get_item(self, item_id):
        return self._items.get(item_id)

    def create_item(self, payload):
        item = {
            "id": self._next_id,
            "nome": payload["nome"],
            "quantidade": payload["quantidade"],
        }
        self._items[self._next_id] = item
        self._next_id += 1
        return item

    def update_item(self, item_id, payload):
        item = self._items.get(item_id)
        if item is None:
            return None
        item.update(payload)
        return item

    def delete_item(self, item_id):
        return self._items.pop(item_id, None)


class InventoryRequestHandler(BaseHTTPRequestHandler):
    store = InventoryStore()

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(length) if length else b"{}"
        try:
            return json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            return None

    def _parse_item_path(self):
        path_parts = [part for part in urlparse(self.path).path.split("/") if part]
        if not path_parts or path_parts[0] != "itens":
            return None
        if len(path_parts) == 1:
            return {"collection": True, "item_id": None}
        if len(path_parts) == 2 and path_parts[1].isdigit():
            return {"collection": False, "item_id": int(path_parts[1])}
        return None

    def _validate_payload(self, payload, partial=False):
        if not isinstance(payload, dict):
            return False
        required = {"nome", "quantidade"}
        allowed = {"nome", "quantidade"}
        if partial:
            if not payload or not set(payload).issubset(allowed):
                return False
        else:
            if set(payload) != required:
                return False
        if "nome" in payload and not isinstance(payload["nome"], str):
            return False
        if "quantidade" in payload and not isinstance(payload["quantidade"], int):
            return False
        return True

    def do_GET(self):
        parsed = self._parse_item_path()
        if parsed is None:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Rota não encontrada"})
            return

        if parsed["collection"]:
            self._send_json(HTTPStatus.OK, self.store.list_items())
            return

        item = self.store.get_item(parsed["item_id"])
        if item is None:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Item não encontrado"})
            return
        self._send_json(HTTPStatus.OK, item)

    def do_POST(self):
        parsed = self._parse_item_path()
        if parsed is None or not parsed["collection"]:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Rota não encontrada"})
            return

        payload = self._read_json()
        if not self._validate_payload(payload):
            self._send_json(HTTPStatus.BAD_REQUEST, {"erro": "Payload inválido"})
            return

        item = self.store.create_item(payload)
        self._send_json(HTTPStatus.CREATED, item)

    def do_PUT(self):
        parsed = self._parse_item_path()
        if parsed is None or parsed["collection"]:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Rota não encontrada"})
            return

        payload = self._read_json()
        if not self._validate_payload(payload, partial=True):
            self._send_json(HTTPStatus.BAD_REQUEST, {"erro": "Payload inválido"})
            return

        item = self.store.update_item(parsed["item_id"], payload)
        if item is None:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Item não encontrado"})
            return
        self._send_json(HTTPStatus.OK, item)

    def do_DELETE(self):
        parsed = self._parse_item_path()
        if parsed is None or parsed["collection"]:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Rota não encontrada"})
            return

        deleted = self.store.delete_item(parsed["item_id"])
        if deleted is None:
            self._send_json(HTTPStatus.NOT_FOUND, {"erro": "Item não encontrado"})
            return
        self._send_json(HTTPStatus.OK, {"mensagem": "Item deletado"})

    def log_message(self, format, *args):
        return


def run_server(port=8000):
    server = ThreadingHTTPServer(("0.0.0.0", port), InventoryRequestHandler)
    print(f"Servidor de estoque em execução na porta {port}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
