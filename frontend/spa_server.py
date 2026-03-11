import http.server
import socketserver
import os

PORT = 5173

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Always serve index.html for extension-less paths (routes)
        path = self.translate_path(self.path)
        if not os.path.isfile(path) and not path.endswith('/'):
            self.path = '/index.html'
        return super().do_GET()

socketserver.TCPServer.allow_reuse_address = True
# Change directory to dist and serve from there
os.chdir(os.path.join(os.path.dirname(__file__), 'dist'))

with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
    print(f"Serving SPA on port {PORT}")
    httpd.serve_forever()
