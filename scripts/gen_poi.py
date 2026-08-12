# -*- coding: utf-8 -*-
"""Genera i POI (acqua / mangiare / dormire) di uno o piu' percorsi da OpenStreetMap
e li scrive in poi.js, il file che la guida carica.

USO (dalla radice del repo):
    python scripts/gen_poi.py corto="C:/tracce/corto.gpx" lungo="C:/tracce/lungo.gpx"

Ogni argomento e' chiave=percorso_del_gpx. Le chiavi non passate restano
invariate in poi.js (il file viene aggiornato, non riscritto da zero).
Le liste leggibili in markdown finiscono in docs/liste-poi/.

Prima di usarlo leggere docs/generazione-poi.md: contiene le trappole gia'
pagate care e la checklist di verifica finale, che NON e' opzionale.
"""
import json, math, os, re, sys, time, urllib.parse, urllib.request, xml.etree.ElementTree as ET

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTDIR = REPO
MD_DIR = os.path.join(REPO, "docs", "liste-poi")
os.makedirs(MD_DIR, exist_ok=True)

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
NOMI = {k: k.capitalize() for k in GPX}

BUF_POI, BUF_WATER, BUF_PLACE, SOGLIA = 500, 300, 2500, 4
PASSO = 0.7          # km tra un punto e l'altro del corridoio: 700 m < 2x500 m di buffer
CHUNK = 22
ENDPOINTS = ["https://overpass-api.de/api/interpreter",
             "https://overpass.osm.ch/api/interpreter"]
RAGGIO = {"city": 4000, "town": 2500, "village": 1200, "hamlet": 700}
RANGO = {"city": 4, "town": 3, "village": 2, "hamlet": 1}
EAT = {"restaurant":"ristorante","cafe":"bar","bar":"bar","fast_food":"fast food",
       "pub":"pub","ice_cream":"gelateria","supermarket":"supermercato",
       "convenience":"alimentari","bakery":"panificio"}
SLEEP = {"hotel":"hotel","guest_house":"B&B","hostel":"ostello","motel":"motel",
         "alpine_hut":"rifugio","wilderness_hut":"bivacco","camp_site":"campeggio",
         "chalet":"chalet","apartment":"appartamenti"}

def parse_gpx(path):
    return [(float(p.get("lat")), float(p.get("lon")))
            for p in ET.parse(path).getroot().iter("{http://www.topografix.com/GPX/1/1}trkpt")]

def hav(a, b):
    R = 6371.0
    la1, la2 = math.radians(a[0]), math.radians(b[0])
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin(math.radians(b[1]-a[1])/2)**2
    return 2*R*math.asin(math.sqrt(h))

def cumulate(pts):
    c = [0.0]
    for i in range(1, len(pts)):
        c.append(c[-1] + hav(pts[i-1], pts[i]))
    return c

def campiona(pts, cum, passo):
    """Un punto ogni `passo` km di percorso reale: copertura senza buchi."""
    out, prossimo, j = [pts[0]], passo, 0
    for i, k in enumerate(cum):
        if k >= prossimo:
            out.append(pts[i])
            while prossimo <= k: prossimo += passo
    if out[-1] != pts[-1]: out.append(pts[-1])
    return out

def query(cs):
    q = f"""[out:json][timeout:120];
(
  nwr[amenity~"^(restaurant|cafe|bar|fast_food|pub|ice_cream)$"](around:{BUF_POI},{cs});
  nwr[shop~"^(supermarket|convenience|bakery)$"](around:{BUF_POI},{cs});
  nwr[tourism~"^(hotel|guest_house|hostel|motel|alpine_hut|wilderness_hut|camp_site|chalet|apartment)$"](around:{BUF_POI},{cs});
  node[amenity=drinking_water](around:{BUF_WATER},{cs});
  node[man_made=water_tap](around:{BUF_WATER},{cs});
  node[place~"^(city|town|village|hamlet)$"](around:{BUF_PLACE},{cs});
);
out center tags;"""
    last = None
    for t in range(12):
        ep = ENDPOINTS[t % len(ENDPOINTS)]
        try:
            req = urllib.request.Request(ep, data=("data=" + urllib.parse.quote(q)).encode(),
                                         headers={"User-Agent": "tg-guida-poi"})
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.load(r)
            # TRAPPOLA 4: Overpass puo' rispondere HTTP 200 con dati TRONCATI,
            # segnalandolo solo nel campo "remark" (query scaduta lato server).
            # Senza questo controllo il buco passa inosservato e lo script
            # "finisce bene" con interi paesi mancanti.
            remark = data.get("remark", "")
            if remark and ("timed out" in remark or "error" in remark.lower()):
                raise RuntimeError(f"risposta parziale ({remark[:70]})")
            if "elements" not in data:
                raise RuntimeError("risposta senza elements")
            return data["elements"]
        except Exception as e:
            last = e
            print(f"    retry {t+1} ({e})", flush=True)
            time.sleep(8 + t*2)
    raise last

def scarica(key, corr):
    cache = os.path.join(OUTDIR, f"_osm_{key}.json")
    if os.path.exists(cache):
        el = json.load(open(cache, encoding="utf-8"))
        print(f"  cache: {len(el)} elementi", flush=True); return el
    parz = cache + ".parziale"
    elements, seen, fatti = [], set(), 0
    if os.path.exists(parz):
        d = json.load(open(parz, encoding="utf-8"))
        elements, fatti = d["elements"], d["fatti"]
        seen = {(e["type"], e["id"]) for e in elements}
        print(f"  riprendo dal tratto {fatti+1}", flush=True)
    tratti = list(range(0, len(corr), CHUNK))
    for n, ci in enumerate(tratti):
        if n < fatti: continue
        cs = ",".join(f"{a:.4f},{b:.4f}" for a, b in corr[ci:ci+CHUNK+1])
        print(f"  tratto {n+1}/{len(tratti)}", flush=True)
        for e in query(cs):
            k = (e["type"], e["id"])
            if k not in seen: seen.add(k); elements.append(e)
        json.dump({"elements": elements, "fatti": n+1}, open(parz, "w", encoding="utf-8"))
        time.sleep(2)
    json.dump(elements, open(cache, "w", encoding="utf-8"))
    os.remove(parz)
    print(f"  scaricati {len(elements)} elementi", flush=True)
    return elements

def elabora(key, pts, cum, elements):
    def nearest(p):
        best, bd = 0, float("inf")
        cl = math.cos(math.radians(p[0]))
        for i, s in enumerate(pts):
            d = (s[0]-p[0])**2 + ((s[1]-p[1])*cl)**2
            if d < bd: bd, best = d, i
        return cum[best], hav(p, pts[best])*1000

    pois, places = [], []
    for el in elements:
        t = el.get("tags", {})
        p = (el["lat"], el["lon"]) if "lat" in el else \
            ((el["center"]["lat"], el["center"]["lon"]) if el.get("center") else None)
        if not p: continue
        if t.get("amenity") == "drinking_water" or t.get("man_made") == "water_tap":
            cat, sub = "a", "fontana"
        elif t.get("amenity") in EAT or t.get("shop") in EAT:
            cat, sub = "m", EAT.get(t.get("amenity")) or EAT.get(t.get("shop"))
        elif t.get("tourism") in SLEEP:
            cat, sub = "d", SLEEP[t["tourism"]]
        elif t.get("place") in RAGGIO:
            places.append({"nome": t.get("name","?"), "p": p, "tipo": t["place"]}); continue
        else: continue
        km, dist = nearest(p)
        if dist > (BUF_WATER if cat == "a" else BUF_POI): continue
        pois.append({"cat": cat, "sub": sub, "nome": t.get("name",""), "km": km, "p": p})

    fonts = sorted([x for x in pois if x["cat"]=="a"], key=lambda x: x["km"])
    keep = []
    for f in fonts:
        if all(hav(f["p"], g["p"])*1000 > 80 for g in keep): keep.append(f)
    pois = [x for x in pois if x["cat"]!="a"] + keep

    for poi in pois:
        best = None
        for pl in places:
            dd = hav(poi["p"], pl["p"])*1000
            if dd <= RAGGIO[pl["tipo"]]:
                cand = (RANGO[pl["tipo"]], -dd, pl["nome"])
                if best is None or cand > best[0]: best = (cand, pl)
        poi["luogo"] = best[1]["nome"] if best else None
        poi["luogo_p"] = best[1]["p"] if best else None

    from collections import defaultdict
    gruppi = defaultdict(lambda: {"m": [], "d": [], "a": [], "p": None})
    solitari = []
    for poi in pois:
        if poi["luogo"]:
            g = gruppi[poi["luogo"]]; g[poi["cat"]].append(poi); g["p"] = poi["luogo_p"]
        else: solitari.append(poi)

    entries = []
    for nome, g in gruppi.items():
        ne, ns, nf = len(g["m"]), len(g["d"]), len(g["a"])
        kms = sorted(x["km"] for x in g["m"]+g["d"]+g["a"])
        if ne >= SOGLIA or ns >= SOGLIA:
            e = {"t":"c","km":round(kms[len(kms)//2],1),"nome":nome,"ne":ne,"ns":ns,"nf":nf}
            if g["p"]: e["lat"],e["lng"] = round(g["p"][0],5), round(g["p"][1],5)
            entries.append(e)
        else:
            for x in g["m"]+g["d"]+g["a"]:
                x["centro_piccolo"] = nome; solitari.append(x)
    for x in solitari:
        e = {"t":x["cat"],"km":round(x["km"],1),"nome":x["nome"],"sub":x["sub"]}
        if x.get("centro_piccolo"): e["luogo"] = x["centro_piccolo"]
        if x["cat"]=="d": e["lat"],e["lng"] = round(x["p"][0],5), round(x["p"][1],5)
        entries.append(e)
    entries.sort(key=lambda e: e["km"])
    return entries

risultato = {}
for key, path in GPX.items():
    print(f"\n=== {key} ===", flush=True)
    pts = parse_gpx(path)
    cum = cumulate(pts)
    corr = campiona(pts, cum, PASSO)
    print(f"  {cum[-1]:.0f} km, corridoio {len(corr)} punti ogni {PASSO*1000:.0f} m, "
          f"{math.ceil(len(corr)/CHUNK)} tratti", flush=True)
    el = scarica(key, corr)
    risultato[key] = elabora(key, pts, cum, el)
    tot = {"a":0,"m":0,"d":0}
    for e in risultato[key]:
        if e["t"]=="c": tot["a"]+=e["nf"]; tot["m"]+=e["ne"]; tot["d"]+=e["ns"]
        else: tot[e["t"]] += 1
    print(f"  -> {len(risultato[key])} righe | acqua {tot['a']} · mangiare {tot['m']} · dormire {tot['d']}", flush=True)

# aggiorna poi.js senza toccare i percorsi non rigenerati
poi_path = os.path.join(OUTDIR, "poi.js")
esistente = {}
if os.path.exists(poi_path):
    m = re.match(r"window\.POI=(.*);\s*$", open(poi_path, encoding="utf-8").read(), re.S)
    if m: esistente = json.loads(m.group(1))
esistente.update(risultato)
open(poi_path, "w", encoding="utf-8", newline="\n").write(
    "window.POI=" + json.dumps(esistente, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(f"\npoi.js aggiornato ({os.path.getsize(poi_path)//1024} KB), percorsi presenti: {list(esistente)}")

for key, entries in risultato.items():
    md = [f"# Servizi lungo il Percorso {NOMI[key]} — da OpenStreetMap\n",
          "Centri con molti servizi raggruppati in una riga. Fuori dai centri, tutto puntuale.\n"]
    for e in entries:
        if e["t"] == "c":
            det = [f"{e['ne']} mangiare" if e['ne'] else "", f"{e['ns']} alloggi" if e['ns'] else "",
                   f"{e['nf']} fontane" if e['nf'] else ""]
            md.append(f"**km {e['km']:.0f} — {e['nome']}** · " + " · ".join(x for x in det if x))
        else:
            ico = {"a":"⛲","m":"🍝","d":"🛏️"}[e["t"]]
            n = e["nome"] or e["sub"]
            luogo = f" ({e['luogo']})" if e.get("luogo") else ""
            sub = f" · {e['sub']}" if e["nome"] and e["t"]!="a" else ""
            md.append(f"- {ico} km {e['km']:.0f} — {n}{sub}{luogo}")
    open(os.path.join(MD_DIR, f"POI-{key}-OSM.md"), "w", encoding="utf-8").write("\n".join(md))
print("liste markdown aggiornate")
