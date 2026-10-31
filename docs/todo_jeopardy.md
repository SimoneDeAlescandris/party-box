Riprendiamo a lavorare sul file `jeopardy/jeopardy.html` del nostro progetto PartyBox. 

La base attuale della schermata di setup, dell'editor JSON e della stanza PeerJS funziona perfettamente. Ora vogliamo procedere con i prossimi passi evolutivi:

1. **Riconnessione Automatica (PeerJS):**
   - Implementa la logica di riconnessione automatica per la stanza PeerJS (ricalcando lo stesso meccanismo robusto che già utilizziamo con successo in *Indovina Chi?*), in modo che in caso di caduta temporanea della connessione i giocatori possano recuperare lo stato senza dover necessariamente ricreare o reinserire il codice da capo.

2. **Effetti Sonori via JavaScript (Web Audio API):**
   - Aggiungi un sistema di effetti sonori leggeri e gradevoli generati interamente via codice tramite la **Web Audio API** di JavaScript (es. suoni per apertura casella, rivelazione risposta, attribuzione/sottrazione punti, timer o pulsante di riconnessione).
   - **Regola tassativa:** Non creare cartelle audio e non utilizzare file esterni di alcun tipo (niente MP3, WAV, OGG, ecc.). Tutto deve essere sintetizzato a codice.

3. **Integrazione Scorciatoie da Tastiera:**
   - Aggiungi la seguente sezione dedicata alle scorciatoie da tastiera all'interno del blocco FAQ / info, adattandola stilisticamente alla grafica di PartyBox:
     ```html
     <details>
         <summary>Quali sono le scorciatoie da tastiera?</summary>
         <ul>
           <li>Usa <kbd>←</kbd> <kbd>↑</kbd> <kbd>→</kbd> <kbd>↓</kbd> per muoverti sul tabellone da gioco.</li>
           <li>Usa <kbd>ENTER</kbd> o <kbd>SPACE</kbd> per aprire la domanda selezionata.</li>
           <li>Usa <kbd>SPACE</kbd> per rivelare la risposta.</li>
           <li>Usa <kbd>ESC</kbd> per chiudere la domanda.</li>
           <li>Digitare i numeri (<kbd>1</kbd> to <kbd>9</kbd>) per selezionare una squadra (1 è la prima squadra, 2 la seconda, e così via). Usa <kbd>↑</kbd> <kbd>↓</kbd> per aumentare o diminuire i punti. Premi <kbd>ESC</kbd> per deselezionare la squadra.</li>
         </ul>
     </details>
     ```

4. **Aggiornamento del Footer:**
   - Sostituisci il blocco `<footer>` attuale all'interno di `jeopardy.html` con il seguente testo legale e di disclaimer aggiornato:
     ```html
     <footer>
       <p>Progetto amatoriale no-profit, creato per passatempo e didattica. Non è affiliato in alcun modo con <a href="[https://www.jeopardy.com/](https://www.jeopardy.com/)" target="_blank" rel="noopener">Jeopardy!<sup>&reg;</sup></a>, Sony Pictures Digital Inc. o <a href="[https://jeopardylabs.com/](https://jeopardylabs.com/)" target="_blank" rel="noopener">JeopardyLabs</a>. I marchi citati appartengono ai rispettivi proprietari.</p>
     </footer>
     ```

5. **Tabellone Giocabile e Gestione Turni/Punteggi (Gameplay Logic):**
   - Attiva il pulsante **"Avvia partita"** e implementa l'interfaccia di gioco dinamica:
     - **Griglia interattiva:** Genera il tabellone con le categorie in alto e le tessere dei punti. Le caselle già selezionate/svolte devono apparire visivamente disattivate o oscurate.
     - **Modale Domanda / Risposta:** Cliccando (o usando la tastiera) su una casella, si apre a schermo intero il modale della domanda. Un secondo passaggio (tasto o tastiera) mostra la risposta corretta.
     - **Gestione Dinamica Utenti e Punteggi:** Nella schermata di gioco deve esserci la possibilità di gestire e aggiornare dinamicamente il punteggio per ogni utente che entra nella stanza.
     - **Indicatore Visivo del Turno (Differente da Indovina Chi):** A differenza di *Indovina Chi?*, all'interno della schermata di gioco ogni utente/giocatore entrato nella stanza avrà il proprio box dei punti dedicato. **Il box del punteggio cambierà visivamente colore (o evidenziazione)** per indicare in modo chiaro e immediato quale utente sta svolgendo il proprio turno in quel momento.
     - **Sincronizzazione P2P:** Lo stato del tabellone (caselle aperte, punteggi, turno attivo) deve essere sincronizzato in tempo reale fra tutti i partecipanti connessi via PeerJS.

**Regola di output:** Quando modifichi o crei il file, fornisci sempre il **codice completo e aggiornato** di `jeopardy/jeopardy.html`, senza omissioni o troncamenti.

---
---
---

convertitore da Jeopardy Labs alla mia versione

---

vedere i file vecchi