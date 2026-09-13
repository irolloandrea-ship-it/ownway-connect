# Nuova hero lifestyle per OwnWay

Goal: sostituire l'hero attuale della landing page con una fotografia lifestyle realistica e premium, pensata per guidare lo sguardo verso headline e CTA.

## Output atteso
- Nuova immagine hero salvata come asset del progetto.
- Riferimento in `src/routes/index.tsx` aggiornato per usare la nuova immagine.
- Vecchio asset `hero-florence.jpg.asset.json` rimosso o sostituito.

## Specifiche creative (fornite)
- Una sola persona locale, uomo o donna 30-45 anni, in contesto urbano italiano autentico e luminoso (es. Firenze).
- Soggetto prevalentemente sulla destra, spazio libero sulla sinistra.
- Volto e sguardo orientati verso sinistra e leggermente verso l'alto, come se guardasse fuori dall'immagine.
- Nessun dito puntato, nessuna posa pubblicitaria; momento spontaneo, consiglio di viaggio.
- Espressione naturale, curiosa, disponibile, intelligente; nessun sorriso commerciale.
- Mezzo busto / tre quarti, inquadratura ampia per crop flessibili.
- Responsive: soggetto ben visibile in crop verticale mobile, elementi importanti lontano dai bordi, spazio intorno al volto.
- Nessun testo, logo, telefono o UI nell'immagine.
- Stile editoriale travel/lifestyle europeo, luce morbida, colori caldi e realistici, no stock photo, no look artificiale da AI.
- Aspect ratio ampio per uso desktop e ritaglio verticale mobile.

## Passaggi
1. Generare l'immagine con prompt fotografico dettagliato, in formato JPG.
2. Salvare il nuovo asset in `src/assets/hero-lifestyle.jpg` (o equivalente `.asset.json` gestito da Lovable).
3. Aggiornare `src/routes/index.tsx` affinché l'hero carichi il nuovo asset.
4. Rimuovere il vecchio `src/assets/hero-florence.jpg.asset.json` se non più referenziato.
5. Verificare build e preview: l'immagine si carica correttamente, il crop desktop/mobile mantiene il soggetto visibile.

## Note tecniche
- Mantenere invariati GTM, GA4, Meta Pixel, Iubenda, eventi dataLayer, design system e testi della pagina.
- L'immagine sarà ottimizzata per il web (JPG, dimensioni ragionevoli).
