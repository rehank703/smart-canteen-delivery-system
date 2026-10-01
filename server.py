"""Run:  python server.py   (in the same folder as index.html, style.css, script.js and qrcode.js)
Serves the canteen app on your computer and on your phone (same Wi-Fi). No payment checking."""
import os, socket, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))   # always serve the folder this file lives in
STATIC = {"index.html", "style.css", "script.js", "qrcode.js"}   # the only files handed out

def lan_ips():
    found = []
    def add(ip):
        if ip and not ip.startswith(("127.", "169.254.", "0.")) and ip not in found:
            found.append(ip)
    for target in ("10.255.255.255", "192.168.255.255", "8.8.8.8"):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect((target, 1)); add(s.getsockname()[0])
        except OSError:
            pass
        finally:
            s.close()
    try:
        for ip in socket.gethostbyname_ex(socket.gethostname())[2]:
            add(ip)
    except OSError:
        pass
    return found or ["127.0.0.1"]

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def _name(self):
        name = urlparse(self.path).path.lstrip("/") or "index.html"
        return name if name in STATIC else None
    def do_GET(self):
        name = self._name()
        if not name: return self.send_error(404)
        self.path = "/" + name; super().do_GET()
    def do_HEAD(self):
        name = self._name()
        if not name: return self.send_error(404)
        self.path = "/" + name; super().do_HEAD()

class Server(ThreadingHTTPServer):
    # On Windows, address reuse lets a second server share a port that is already taken,
    # so an old server in another folder keeps answering. Refuse that instead.
    allow_reuse_address = os.name != "nt"

def main():
    missing = [f for f in sorted(STATIC) if not os.path.isfile(os.path.join(ROOT, f))]
    if missing:
        sys.exit(f"Missing from {ROOT}: {', '.join(missing)}\nPut all the app files and server.py in the same folder.")
    try:
        httpd = Server(("0.0.0.0", PORT), H)
    except OSError as e:
        sys.exit(f"Port {PORT} is already in use ({e}).\nAn old server is probably still running (maybe from another folder).\nClose its terminal, or run: python server.py {PORT + 1}")
    ips = lan_ips()
    print(f"Smart Canteen running.\n  Serving files from: {ROOT}\n  On this computer: http://localhost:{PORT}/index.html\n  On your phone (same Wi-Fi): http://{ips[0]}:{PORT}/index.html")
    if len(ips) > 1:
        print("  If that address doesn't open on your phone, try one of these instead:")
        for ip in ips[1:]:
            print(f"    http://{ip}:{PORT}/index.html")
    print("  Phone can't connect? Allow Python through the firewall (Private networks), keep both devices on the same Wi-Fi,\n  and turn off any VPN.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
