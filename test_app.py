import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from app import InventoryRequestHandler, InventoryStore


class InventoryApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        InventoryRequestHandler.store = InventoryStore()
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), InventoryRequestHandler)
        cls.port = cls.server.server_address[1]
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def setUp(self):
        InventoryRequestHandler.store = InventoryStore()

    def request(self, method, path, payload=None):
        data = None
        headers = {}
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = Request(
            f"http://127.0.0.1:{self.port}{path}",
            data=data,
            headers=headers,
            method=method,
        )
        try:
            with urlopen(req) as response:
                return response.status, json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            return error.code, json.loads(error.read().decode("utf-8"))

    def test_crud_completo(self):
        status, created = self.request("POST", "/itens", {"nome": "Mouse", "quantidade": 10})
        self.assertEqual(status, 201)
        self.assertEqual(created["id"], 1)

        status, fetched = self.request("GET", "/itens/1")
        self.assertEqual(status, 200)
        self.assertEqual(fetched["nome"], "Mouse")

        status, updated = self.request("PUT", "/itens/1", {"quantidade": 7})
        self.assertEqual(status, 200)
        self.assertEqual(updated["quantidade"], 7)

        status, all_items = self.request("GET", "/itens")
        self.assertEqual(status, 200)
        self.assertEqual(len(all_items), 1)

        status, deleted = self.request("DELETE", "/itens/1")
        self.assertEqual(status, 200)
        self.assertEqual(deleted["mensagem"], "Item deletado")

        status, not_found = self.request("GET", "/itens/1")
        self.assertEqual(status, 404)
        self.assertEqual(not_found["erro"], "Item não encontrado")

    def test_post_invalido(self):
        status, response = self.request("POST", "/itens", {"nome": "Teclado"})
        self.assertEqual(status, 400)
        self.assertEqual(response["erro"], "Payload inválido")


if __name__ == "__main__":
    unittest.main()
