Implementa un sistema di effetti stagionali per il progetto PartyBox, strutturato unicamente con due file nella cartella `stagioni/`:
- `stagioni/stagioni.css`
- `stagioni/stagioni.js`

### REGOLE E ARCHITETTURA:
1. **Zero risorse esterne:** Nessun file audio (MP3, WAV, ecc.), nessuna immagine o libreria esterna. Tutto deve essere autoprodotto (CSS + JS).
2. **Isolamento totale:** Non toccare la logica o il codice esistente dei minigiochi o dell'hub. Il sistema deve essere un livello decorativo indipendente integrabile con:
   ```html
   <link rel="stylesheet" href=".../stagioni/stagioni.css">
   <script src=".../stagioni/stagioni.js" defer></script>
   <body data-seasonal-page="home"> <!-- o indovina-chi, jeopardy, ecc. -->
   ```

3. **Riconoscimento automatico:** Rilevamento basato sulla data locale del dispositivo (es. Halloween 25-31 ott, Natale 1-31 dic, San Valentino 14 feb), facilmente estendibile in futuro.
4. **Varianti grafiche e persistenza:** 2-3 varianti per festività selezionate casualmente a inizio sessione e salvate in `sessionStorage` (per evitare cambi repentini navigando tra le pagine) e `localStorage` (per variare tra sessioni diverse).
5. **Personalizzazione per pagina:** Capacità di modulare gli effetti visivi a seconda del minigioco attivo tramite l'attributo sul body.
6. **Audio via Web Audio API:**
* Effetti sonori sintetizzati brevi (es. vento, campanellini) associati alla variante attiva.
* Riprodotti una sola volta per sessione, in automatico alla prima interazione dell'utente (per aggirare i blocchi dei browser).
* Niente pulsanti di volume, niente risate umane realistiche (limitarsi a sintesi a oscillatori fattibili).


7. **Performance:** Uso di CSS leggero (`transform`, `opacity`), `pointer-events: none` obbligatorio sugli elementi decorativi e supporto a `prefers-reduced-motion`.
8. **Modalità anteprima:** Includi un metodo rapido per forzare/simulare una festività e testare le varianti in qualsiasi giorno dell'anno.

Fornisci il codice completo dei due file e indica chiaramente come estendere il sistema per aggiungere future festività.

---
---
---

eliminare i file todo una volta completati: sono temporanei.

---
---
---

aggiornare readme.md

---
---
---

nuova icona per chrome di partybox e magari anche icona personalizzata per indovina-chi e jeopardy. Non logo nel sito perché non mi interessa se non all'interno delle copertine/box dei giochi.

---

party-box.it
è disponibile questo dominio... magari potrebbe valer la pena acquistarlo per pubblicarci il sito qualora annualmente non mi costi più di 10€.
Nel caso lo pubblicassi prima però valutare se legalmente posso farlo o rischio qualcosa. 
Poi sarebbe da capire come gestire i banner pubblicitari.
E come permettere agli utenti di impostare le loro categorie/quiz.
E renderlo sicuro secondo chrome.
E proteggermi da eventuali copie dello stesso magari scrivendoci qualcosa sul sito...

---

Scrivere nel footer in basso a destra magari la versione del sito o del gioco in modo che ad ogni modifica vada a cambiarlo. 
Studiarmi la logica dietro perché penso di partire da 1.0 per tutto e poi magari passo a 1.0.1, 1.0.124, e così via...