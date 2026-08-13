# Genera le frecce direzionali usate SOLO dalla mappa Stay22.
#
# Sulle nostre mappe Leaflet le frecce le disegniamo al volo ruotando un SVG
# inline. Nella mappa Stay22 non possiamo: la traccia la disegna Stay22 dentro
# il suo iframe e noi le passiamo solo l'URL del GPX. L'unico aggancio che offre
# e' il parametro `poi`, che accetta un'immagine per marcatore ma non una
# rotazione. Quindi la rotazione va cotta dentro il file: un SVG ogni 15 gradi.
#
# Stay22 ritaglia l'immagine a cerchio e la ingrandisce al 125%, percio' la
# freccia sta nella parte centrale del riquadro e non tocca mai i bordi.
#
# Uso: python scripts/gen_frecce.py
from pathlib import Path

PASSO = 15  # gradi fra un file e l'altro: errore massimo 7,5 gradi, invisibile
COLORE = '#16211a'  # il pallino di Stay22 e' bianco, serve un colore scuro
DEST = Path(__file__).resolve().parent.parent / 'assets' / 'frecce'

MODELLO = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'
    '<g transform="rotate({deg} 12 12)">'
    '<path d="M12 4.6 L17.8 17.4 L12 14.4 L6.2 17.4 Z" fill="{colore}"/>'
    '</g></svg>'
)

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    for deg in range(0, 360, PASSO):
        (DEST / f'f{deg:03d}.svg').write_text(
            MODELLO.format(deg=deg, colore=COLORE), encoding='utf-8')
    print(f'{360 // PASSO} frecce scritte in {DEST}')

if __name__ == '__main__':
    main()
