# PartyBox

**PartyBox** è un portale di minigiochi multiplayer per browser, interamente basato su un'architettura client-side, progettato per sfidare gli amici online tramite connessione peer-to-peer (P2P) senza alcuna necessità di registrazione o backend proprietario.

Il progetto è in costante evoluzione e attualmente ospita una raccolta di giochi di gruppo curati nei minimi dettagli.

---

## Giochi Disponibili

### 1. Indovina Chi?
Una versione multiplayer per browser ispirata al classico gioco da tavolo.
- **Multiplayer P2P:** Connessione diretta tra giocatori tramite PeerJS e WebRTC.
- **Stanze private:** Creazione di una stanza con codice a 5 caratteri da condividere.
- **Categorie e Personaggi:** Selezione tra YouTuber, videogiochi, Pokémon (con filtri per generazione) e modalità Mix.
- **Regole configurabili:** Gestione delle penalità per tentativi errati, jolly, numero di giocatori attivi (2 o 3) e slot spettatori con visuale regia dedicata.
- **Interfaccia responsive:** Ottimizzata per desktop, tablet e smartphone.

### 2. JeopardyLabs Italia
Un adattamento interattivo del celebre format di quiz a squadre, personalizzabile e scalabile.
- **Editor Locale con JSON:** Crea il tuo tabellone di quiz direttamente tramite l'interfaccia web, esportalo in formato JSON o caricalo trascinandolo nel browser. Nessun database o account richiesto.
- **Sincronizzazione P2P in tempo reale:** L'host gestisce il tabellone e lo stato della partita viene sincronizzato con tutti i partecipanti.
- **Gestione Dinamica di Turni e Punteggi:** Indicatori visivi chiari del turno attivo e modifiche dei punteggi in tempo reale per ogni utente connesso.
- **Effetti Sonori Sintetizzati:** Feedback audio leggeri generati dinamicamente tramite la Web Audio API di JavaScript, senza ricorrere a file audio esterni.
- **Scorciatoie da tastiera:** Comandi rapidi per conduttori e giocatori per muoversi sul tabellone, aprire domande, rivelare risposte e assegnare punti.

### 3. Erm, Actually! (*In arrivo*)
La futura variante di quiz ispirata al format dello YouTuber *La Sedia a Due Gambe*, pensata per smascherare affermazioni errate sui propri fandom preferiti.

---

## Tecnologie Utilizzate

- **HTML5 & CSS3:** Struttura moderna, layout responsive e animazioni fluide con supporto a varianti grafiche dinamiche.
- **JavaScript ES6+ (Vanilla):** Logica di gioco, gestione degli eventi e sincronizzazione dello stato locale/di rete.
- **[PeerJS](https://peerjs.com/) & [WebRTC](https://webrtc.org/):** Gestione delle connessioni P2P in tempo reale.
- **Web Audio API:** Sintesi nativa degli effetti sonori a codice.
- **Google Fonts:** Tipografia pulita e moderna (font Fredoka).
- **Canvas Confetti:** Effetti grafici celebrativi di fine partita.

Il progetto non richiede un server backend dedicato. La creazione delle stanze e lo scambio dati avvengono in modalità P2P sfruttando la rete e i servizi di supporto PeerJS.

---

## Esecuzione Locale

Per testare o sviluppare il progetto in locale sulla tua macchina:

1. Clona il repository:
   ```bash
   git clone [https://github.com/tuo-username/party-box.git](https://github.com/tuo-username/party-box.git)
   cd party-box
   ```

2. Avvia un server HTTP locale nella cartella del progetto:
   ```bash
   python -m http.server 8000
   ```

3. Apri il browser all'indirizzo `http://localhost:8000`.

---

## Pubblicazione

Il portale è strutturato per essere facilmente pubblicato e ospitato sul web tramite servizi di hosting statico come [GitHub Pages](https://pages.github.com/).

---

## Licenza

Questo progetto è distribuito sotto licenza **MIT**. Consulta il file [`LICENSE`](https://www.google.com/search?q=LICENSE) per il testo completo.

*Nota:* La licenza del codice sorgente non si estende automaticamente agli asset grafici, ai loghi o ai marchi di terze parti eventualmente richiamati a scopo dimostrativo.

---

## Disclaimer

**PartyBox** è un progetto amatoriale e indipendente, sviluppato esclusivamente a fini ricreativi, didattici e dimostrativi.

Non è un prodotto ufficiale, né è affiliato, approvato o sponsorizzato da Hasbro, Inc., Sony Pictures Digital Inc., Jeopardy!® o JeopardyLabs. I nomi, i marchi registrati e i contenuti di terze parti appartengono ai rispettivi proprietari.