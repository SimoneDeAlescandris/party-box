#!/usr/bin/env python3
"""
converti_jeopardy.py - Converte una pagina HTML esportata da JeopardyLabs
in un file JSON compatibile con il formato dei quiz di PartyBox (jeopardy.html).

Requisiti: Python 3.8+ e BeautifulSoup  ->  pip install beautifulsoup4

Uso:
    python converti_jeopardy.py harambe-24.html
    python converti_jeopardy.py harambe-24.html -o quiz_personalizzato.json
    python converti_jeopardy.py harambe-24.html --stdout
    python converti_jeopardy.py harambe-24.html -t "Titolo personalizzato"

Output di default: file JSON con nome normalizzato basato sul titolo (es. jeopardy-harambe.json).

Argomento obbligatorio:
    input
        Percorso del file HTML salvato da JeopardyLabs (es. harambe-24.html).

Opzioni:
    -o FILE, --output FILE
        File JSON di destinazione in cui scrivere il risultato. Se non specificato,
        viene generato automaticamente in base al titolo estratto dal quiz.
    
    -t TITOLO, --titolo TITOLO
        Forza un titolo specifico per il quiz, sovrascrivendo quello rilevato automaticamente.
    
    --stdout
        Stampa il contenuto JSON direttamente a terminale invece di salvarlo su file.

Caratteristiche e dettagli di funzionamento:
    - Analizza la struttura di JeopardyLabs individuando la riga delle categorie (.grid-row-cats)[cite: 4]
      e le righe delle domande (.grid-row-questions)[cite: 4].
    - Estrae correttamente il testo visibile della domanda (.front.answer) e la soluzione (.back.question)[cite: 4].
    - Effettua controlli di integrità e tronca i testi che superano i limiti strutturali previsti
      da PartyBox (400 caratteri per le domande/risposte), segnalandolo nei messaggi di avviso[cite: 1, 4].
    - Fornisce informazioni dettagliate di debug tramite log prefissati con [DEBUG].
"""

import argparse
import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("Errore: Manca la libreria BeautifulSoup. Installala con: pip install beautifulsoup4")

# Limiti strutturali coerenti con quelli definiti in jeopardy.html[cite: 1, 4]
LIM_CAT = 8
LIM_RIGHE = 8
LIM_TITOLO = 100
LIM_NOME = 80
LIM_TESTO = 1000
LIM_PUNTI = 100000

avvisi = []


def avviso(msg):
    """Registra un avviso di attenzione durante la fase di conversione."""
    avvisi.append(msg)


def leggi_html(percorso):
    """Carica il file HTML di input e restituisce il testo grezzo."""
    if not percorso.is_file():
        sys.exit(f"Errore: file HTML non trovato: {percorso}")
    try:
        testo_html = percorso.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        sys.exit(f"Errore durante la lettura del file: {e}")
    print(f"[DEBUG] File HTML caricato con successo: {percorso}")
    return testo_html


def pulisci(nodo):
    """Estrae e pulisce il testo da un nodo HTML rimuovendo tag superflui e normalizzando gli spazi."""
    if nodo is None:
        return ""
    for br in nodo.find_all("br"):
        br.replace_with(" ")
    for blocco in nodo.find_all(["p", "div", "li"]):
        blocco.append(" ")
    for img in nodo.find_all("img"):
        avviso("Un'immagine nel testo è stata ignorata (JeopardyLabs: " + (img.get("src") or "senza src")[:60] + ")")
    testo = nodo.get_text()
    testo = unicodedata.normalize("NFC", testo.replace("\xa0", " ").replace("\u200b", ""))
    testo = re.sub(r"[\u0000-\u0008\u000B\u000C\u000E-\u001F]", "", testo)
    return re.sub(r"\s+", " ", testo).strip()


def taglia(testo, massimo, dove):
    """Tronca il testo se supera la lunghezza massima consentita, registrando un avviso."""
    if len(testo) > massimo:
        avviso(f"{dove}: testo di {len(testo)} caratteri accorciato al limite di {massimo}.")
        return testo[:massimo].rstrip()
    return testo


def estrai_titolo_pagina(soup):
    """Ricava il titolo del quiz dalla pagina HTML di JeopardyLabs."""
    for sel in ("#options h1", "h1"):
        h = soup.select_one(sel)
        if h and pulisci(h):
            return pulisci(h)
    t = soup.find("title")
    testo = pulisci(t) if t else ""
    testo = re.sub(r"\s*[-|]?\s*(Jeopardy\s+Template|JeopardyLabs).*$", "", testo, flags=re.I).strip()
    return testo or "Quiz importato"


def valore_punti(cella):
    """Estrae il valore numerico in punti da una casella del tabellone."""
    inner = cella.select_one(".cell-inner")
    if inner is None:
        return None
    m = re.search(r"-?\d[\d.,]*", pulisci(inner))
    if not m:
        return None
    try:
        return int(round(float(m.group(0).replace(".", "").replace(",", "."))))
    except ValueError:
        return None


def converti_html_in_quiz(html, titolo_forzato=None):
    """Analizza l'HTML di JeopardyLabs e restituisce il dizionario strutturato nel formato PartyBox[cite: 4]."""
    soup = BeautifulSoup(html, "html.parser")

    riga_cat = soup.select_one(".grid-row-cats")
    if riga_cat is None:
        raise ValueError("Impossibile trovare le categorie (.grid-row-cats): verifica che sia una pagina JeopardyLabs valida[cite: 4].")
    
    nomi_categorie = [pulisci(c) for c in riga_cat.select(".cat-cell")]
    righe_domande = soup.select(".grid-row-questions")
    
    if not nomi_categorie or not righe_domande:
        raise ValueError("Il tabellone appare vuoto: servono almeno una categoria e una riga di domande.")

    print(f"[DEBUG] Categorie individuate ({len(nomi_categorie)}): {nomi_categorie}")
    print(f"[DEBUG] Righe di domande individuate: {len(righe_domande)}")

    if len(nomi_categorie) > LIM_CAT:
        avviso(f"Numero di categorie ({len(nomi_categorie)}) superiore al limite ({LIM_CAT}): vengono prese le prime {LIM_CAT}.")
        nomi_categorie = nomi_categorie[:LIM_CAT]
    if len(righe_domande) > LIM_RIGHE:
        avviso(f"Numero di righe ({len(righe_domande)}) superiore al limite ({LIM_RIGHE}): vengono prese le prime {LIM_RIGHE}.")
        righe_domande = righe_domande[:LIM_RIGHE]

    valori = []
    celle_per_categoria = [[] for _ in nomi_categorie]

    for ri, riga in enumerate(righe_domande):
        per_col = {}
        for cg in riga.select(".grid-cell"):
            data_col_attr = cg.get("data-col")
            try:
                col = int(str(data_col_attr)) if data_col_attr is not None else len(per_col)
            except (TypeError, ValueError):
                col = len(per_col)
            per_col[col] = cg

        punti_riga = []
        for ci, nome_cat in enumerate(nomi_categorie):
            cg = per_col.get(ci)
            domanda = risposta = ""
            if cg is not None:
                v = valore_punti(cg)
                if v:
                    punti_riga.append(v)
                # In JeopardyLabs: .front.answer è il testo visibile, .back.question è la soluzione[cite: 4]
                domanda = pulisci(cg.select_one(".front.answer"))
                risposta = pulisci(cg.select_one(".back.question"))
            
            contesto = f"[{nome_cat or 'Categoria ' + str(ci + 1)} / riga {ri + 1}]"
            domanda = taglia(domanda, LIM_TESTO, contesto + " domanda")
            risposta = taglia(risposta, LIM_TESTO, contesto + " risposta")

            if bool(domanda) != bool(risposta):
                avviso(f"{contesto}: attenzione, è presente solo {'la risposta' if domanda else 'la domanda'}, la casella potrebbe non essere correttamente giocabile.")
            elif not domanda:
                avviso(f"{contesto}: casella vuota (nessun contenuto trovato).")
            
            celle_per_categoria[ci].append({"domanda": domanda, "risposta": risposta})

        if punti_riga:
            comune, quanti = Counter(punti_riga).most_common(1)[0]
            if quanti != len(punti_riga):
                avviso(f"Riga {ri + 1}: valori in punti disomogenei tra le colonne ({sorted(set(punti_riga))}), viene adottato il valore comune {comune}.")
        else:
            comune = (valori[-1] + 100) if valori else 100
            avviso(f"Riga {ri + 1}: valore in punti non rilevato automaticamente, viene impostato il valore di fallback {comune}.")
        valori.append(max(1, min(comune, LIM_PUNTI)))

    titolo_finale = titolo_forzato.strip() if titolo_forzato else estrai_titolo_pagina(soup)
    quiz = {
        "formato": "partybox-jeopardy",
        "versione": 1,
        "titolo": taglia(titolo_finale, LIM_TITOLO, "Titolo del quiz"),
        "valori": valori,
        "categorie": [
            {
                "nome": taglia(nome_cat, LIM_NOME, f"Nome categoria {i + 1}") or f"Categoria {i + 1}",
                "celle": celle_per_categoria[i]
            }
            for i, nome_cat in enumerate(nomi_categorie)
        ],
    }
    print(f"[DEBUG] Conversione completata con successo per il quiz: '{quiz['titolo']}'")
    return quiz


def genera_nome_file(titolo):
    """Genera un nome di file JSON pulito e normalizzato basato sul titolo del quiz."""
    s = unicodedata.normalize("NFD", titolo)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return f"jeopardy-{s or 'quiz'}.json"


def main():
    parser = argparse.ArgumentParser(
        description="Converte una pagina HTML esportata da JeopardyLabs in un file JSON per PartyBox."
    )
    parser.add_argument("input", help="Percorso del file HTML salvato da JeopardyLabs (es. harambe-24.html)")
    parser.add_argument(
        "-o", "--output",
        help="Percorso del file JSON di destinazione (default: calcolato automaticamente in base al titolo)"
    )
    parser.add_argument(
        "-t", "--titolo",
        help="Forza un titolo personalizzato per il quiz"
    )
    parser.add_argument(
        "--stdout", action="store_true",
        help="Stampa il JSON direttamente a terminale (stdout) invece di salvarlo su file"
    )
    
    args = parser.parse_args()
    print(f"[DEBUG] Argomenti ricevuti: input={args.input}, output={args.output}, titolo={args.titolo}, stdout={args.stdout}")

    percorso_input = Path(args.input)
    testo_html = leggi_html(percorso_input)

    try:
        quiz = converti_html_in_quiz(testo_html, args.titolo)
    except ValueError as e:
        sys.exit(f"Errore durante l'elaborazione del quiz: {e}")

    output_json_str = json.dumps(quiz, ensure_ascii=False, indent=2)
    
    # Calcolo statistiche di importazione
    totale_caselle = len(quiz["categorie"]) * len(quiz["valori"])
    caselle_pronte = sum(1 for cat in quiz["categorie"] for c in cat["celle"] if c["domanda"] and c["risposta"])

    if args.stdout:
        print(output_json_str)
    else:
        destinazione = Path(args.output) if args.output else percorso_input.with_name(genera_nome_file(quiz["titolo"]))
        destinazione.write_text(output_json_str + "\n", encoding="utf-8")
        print(f"[DEBUG] File salvato correttamente in: {destinazione}")

    # Riepilogo informativo su stderr
    stderr = sys.stderr
    print(f"\n[RIEPILOGO CONVERSIONE]", file=stderr)
    print(f"Titolo del quiz: {quiz['titolo']}", file=stderr)
    print(f"Struttura tabellone: {len(quiz['categorie'])} categorie x {len(quiz['valori'])} righe (Valori: {quiz['valori']})", file=stderr)
    print(f"Caselle valide/pronte: {caselle_pronte}/{totale_caselle}", file=stderr)
    
    if avvisi:
        print(f"\n[AVVISI ({len(set(avvisi))})]:", file=stderr)
        for msg in dict.fromkeys(avvisi):
            print(f" - {msg}", file=stderr)


if __name__ == "__main__":
    main()