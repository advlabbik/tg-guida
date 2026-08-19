# -*- coding: utf-8 -*-
"""Aggiunge a poi.js i punti di tipo 'b' — negozi di bici, meccanici e colonnine
di riparazione self service — presi da OpenStreetMap.

USO (dalla radice del repo):
    python scripts/gen_meccanici.py corto="C:/tracce/corto.gpx" medio="..." lungo="..."

Differenza rispetto a gen_poi.py: qui NON serve il corridoio campionato punto per
punto. I negozi di bici sono pochi (qualche centinaio in tutto il Trentino), quindi
si scarica una volta sola il riquadro che contiene i percorsi con UNA query, e la
distanza dalla traccia si calcola in locale sul GPX a piena risoluzione. Una query
invece di centinaia: Overpass regge senza fatica anche nelle sue giornate storte.

Regole dei dati:
- buffer 1.000 m invece dei 500 m degli altri POI — con la catena rotta un
  chilometro di deviazione lo fai, e chi e' oltre i 500 m porta il campo `dist`
  cosi' l'app scrive "N m fuori percorso";
- due punti dello stesso sottotipo a meno di 150 m sono lo stesso posto mappato
  due volte (succede spesso con le colonnine), ne resta uno;
- se OSM non ha il nome il campo `nome` non viene scritto: l'app mostra il
  sottotipo tradotto ("riparazione self service"), che e' piu' utile di un
  segnaposto tipo "Negozio di bici";
- il telefono, quando c'e', finisce in `tel` e diventa un link da toccare.
"""
import io, json, math, os, re, sys, time, urllib.parse, urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(REPO, "_osm_bici.json")
ENDPOINTS = ["https://overpass-api.de/api/interpreter",
             "https://overpass.kumi.systems/api/interpreter"]
BUFFER, VICINI = 1000, 150

GPX = {}
for arg in sys.argv[1:]:
    if "=" not in arg:
        sys.exit(f"argomento non valido: {arg} (atteso chiave=file.gpx)")
    k, v = arg.split("=", 1)
    if not os.path.exists(v):
        sys.exit(f"file non trovato: {v}")
    GPX[k] = v
if not GPX:
    sys.exit(__doc__)

rx = re.compile(r'<trkpt lat="([-\d.]+)" lon="([-\d.]+)">')


def traccia(f):
    pts = [(float(a), float(b)) for a, b in rx.findall(io.open(f, encoding="utf-8").read())]
    cum = [0.0]
    for i in range(1, len(pts)):
        la1, lo1 = pts[i - 1]; la2, lo2 = pts[i]
        dy = (la2 - la1) * 111320.0
        dx = (lo2 - lo1) * 111320.0 * math.cos(math.radians((la1 + la2) / 2))
        cum.append(cum[-1] + math.hypot(dx, dy))
    return pts, cum


TRACCE = {k: traccia(v) for k, v in GPX.items()}
tutti = [p for pts, _ in TRACCE.values() for p in pts]
la = [p[0] for p in tutti]; lo = [p[1] for p in tutti]
BBOX = f"{min(la)-0.05:.3f},{min(lo)-0.05:.3f},{max(la)+0.05:.3f},{max(lo)+0.05:.3f}"

QUERY = f"""[out:json][timeout:120];
(
  node[shop=bicycle]({BBOX});
  way[shop=bicycle]({BBOX});
  node[amenity=bicycle_repair_station]({BBOX});
  node["service:bicycle:repair"="yes"]({BBOX});
  way["service:bicycle:repair"="yes"]({BBOX});
);
out center tags;"""


def scarica():
    if os.path.exists(CACHE):
        print("cache", os.path.basename(CACHE), "trovata: non riscarico (cancellala per rifare)")
        return json.load(io.open(CACHE, encoding="utf-8"))
    ultimo = None
    for t in range(8):
        url = ENDPOINTS[t % len(ENDPOINTS)]
        try:
            req = urllib.request.Request(url, data=urllib.parse.urlencode({"data": QUERY}).encode(),
                                         headers={"User-Agent": "tg-guida-poi/1.0"})
            d = json.load(urllib.request.urlopen(req, timeout=180))
            if d.get("elements"):
                json.dump(d, io.open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
                print("scaricati", len(d["elements"]), "elementi da", url)
                return d
            ultimo = "zero elementi"
        except Exception as e:
            ultimo = e
        print("tentativo", t + 1, "fallito:", ultimo)
        time.sleep(6 + t * 4)
    sys.exit("Overpass non risponde: " + str(ultimo))


def candidati(d):
    fuori = []
    for e in d["elements"]:
        t = e.get("tags", {})
        y = e.get("lat") or (e.get("center") or {}).get("lat")
        x = e.get("lon") or (e.get("center") or {}).get("lon")
        if y is None or x is None:
            continue
        if t.get("amenity") == "bicycle_repair_station":
            sub = "riparazione self service"
        elif t.get("shop") == "bicycle":
            sub = "negozio di bici"
        else:
            sub = "riparazioni"
        fuori.append({"nome": t.get("name"), "sub": sub, "lat": round(y, 5), "lng": round(x, 5),
                      "tel": t.get("phone") or t.get("contact:phone")})
    return fuori


def aggancia(pts, cum, y, x):
    cl = math.cos(math.radians(y))
    best, bi = 1e18, 0
    for i, (py, px) in enumerate(pts):
        dy = (py - y) * 111320.0
        dx = (px - x) * 111320.0 * cl
        d = dx * dx + dy * dy
        if d < best:
            best, bi = d, i
    return math.sqrt(best), cum[bi] / 1000.0


def dedup(lista):
    fuori = []
    for e in lista:
        doppio = False
        for f in fuori:
            if f["sub"] != e["sub"]:
                continue
            dy = (f["lat"] - e["lat"]) * 111320.0
            dx = (f["lng"] - e["lng"]) * 111320.0 * math.cos(math.radians(e["lat"]))
            if math.hypot(dx, dy) < VICINI:
                if not f.get("nome") and e.get("nome"):
                    fuori[fuori.index(f)] = e
                doppio = True
                break
        if not doppio:
            fuori.append(e)
    return fuori


elenco = candidati(scarica())
print("candidati nel riquadro:", len(elenco))

p = os.path.join(REPO, "poi.js")
s = io.open(p, encoding="utf-8").read()
testa = s[:s.index("{")]
poi = json.loads(s[s.index("{"):].rstrip().rstrip(";"))

for chiave, (pts, cum) in TRACCE.items():
    trovati = []
    for e in elenco:
        dist, km = aggancia(pts, cum, e["lat"], e["lng"])
        if dist > BUFFER:
            continue
        v = {"t": "b", "km": round(km, 1), "sub": e["sub"], "lat": e["lat"], "lng": e["lng"]}
        if e.get("nome"):
            v["nome"] = e["nome"]
        if dist > 500:
            v["dist"] = int(round(dist / 50.0) * 50)
        if e.get("tel"):
            v["tel"] = e["tel"]
        trovati.append(v)
    puliti = dedup(trovati)
    poi.setdefault(chiave, [])
    poi[chiave] = [x for x in poi[chiave] if x.get("t") != "b"]
    poi[chiave] = sorted(poi[chiave] + puliti, key=lambda x: (x.get("km", 0), x.get("t", "")))
    print(f"{chiave}: {len(puliti)} punti (doppioni scartati: {len(trovati)-len(puliti)})")

io.open(p, "w", encoding="utf-8", newline="\n").write(testa + json.dumps(poi, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("poi.js aggiornato")
