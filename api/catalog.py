"""Read-only Square production catalog endpoint for the SHAKE storefront."""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

SQUARE_API = "https://connect.squareup.com"
SQUARE_VERSION = "2025-10-16"


def square_get(path, token):
    request = urllib.request.Request(
        SQUARE_API + path,
        headers={
            "Authorization": "Bearer " + token,
            "Square-Version": SQUARE_VERSION,
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.load(response)


class handler(BaseHTTPRequestHandler):
    def respond(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if urllib.parse.urlsplit(self.path).path != "/api/catalog":
            return self.respond(404, {"error": "Not found"})
        token = (os.environ.get("SQUARE_ACCESS_TOKEN") or os.environ.get("square_access_token_prod") or "").strip()
        if not token:
            return self.respond(503, {"error": "Square production access is not configured"})
        if os.environ.get("SQUARE_ENVIRONMENT", "production").lower() != "production":
            return self.respond(503, {"error": "Square production environment required"})
        try:
            items, images, item_options = [], {}, {}
            cursor = None
            for _ in range(100):
                params = {"types": "ITEM,IMAGE,ITEM_OPTION"}
                if cursor:
                    params["cursor"] = cursor
                page = square_get("/v2/catalog/list?" + urllib.parse.urlencode(params), token)
                for obj in page.get("objects", []):
                    kind = obj.get("type")
                    if kind == "ITEM":
                        items.append(obj)
                    elif kind == "IMAGE":
                        data = obj.get("image_data") or {}
                        if data.get("url"):
                            images[obj["id"]] = {"url": data["url"], "name": data.get("name", "")}
                    elif kind == "ITEM_OPTION":
                        item_options[obj["id"]] = obj.get("item_option_data", {})
                cursor = page.get("cursor")
                if not cursor:
                    break
            else:
                return self.respond(502, {"error": "Catalog pagination limit reached"})
            return self.respond(200, {
                "items": items, "images": images, "item_options": item_options
            })
        except urllib.error.HTTPError as exc:
            return self.respond(502, {"error": "Square catalog request failed", "square_status": exc.code})
        except (urllib.error.URLError, TimeoutError, ValueError, KeyError):
            return self.respond(502, {"error": "Unable to load Square catalog"})
