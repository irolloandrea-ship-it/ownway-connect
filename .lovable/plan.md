# Audit hero responsive: risultato e soluzione consigliata

## Stato attuale verificato

- L’immagine hero è gestita direttamente in `src/routes/index.tsx` nella pagina principale.
- Oggi viene importato un solo asset, `hero-lifestyle.jpg`, e renderizzato con un elemento `<img>`.
- Lo stesso file viene adattato alle viewport tramite `object-fit: cover` e due ritagli: `65% 35%` su mobile e `62% center` da 1024 px.
- Gli script di GTM e Iubenda sono installati separatamente nel contenitore generale del sito (`src/routes/__root.tsx`). Gli eventi GTM sono gestiti da un componente separato (`GtmEvents`).

## Fattibilità

Sì, possiamo usare due immagini differenti:

- una per desktop e tablet;
- una dedicata esclusivamente agli smartphone.

La soluzione consigliata è l’elemento semantico `<picture>` con un `<source media="(max-width: 767px)">` per l’immagine mobile e l’attuale `<img>` come fallback desktop/tablet.

```text
<picture>
  <source media="(max-width: 767px)" srcSet="immagine-mobile" />
  <img src="immagine-desktop-tablet" ... />
</picture>
```

Il browser valuta la condizione prima di scaricare l’immagine e richiede soltanto la sorgente appropriata. È quindi preferibile a due elementi `<img>` nascosti con CSS, che possono causare il download di entrambi gli asset. Anche immagini CSS distinte sarebbero possibili, ma `<picture>` mantiene alt text, dimensioni e priorità di caricamento più chiari e accessibili.

## Breakpoint consigliato

- **Mobile:** fino a `767px`, asset verticale dedicato.
- **Tablet e desktop:** da `768px`, asset attuale o sua variante orizzontale.
- Gli adattamenti di dimensione e ritaglio già presenti possono continuare a usare `md` a 768 px e `lg` a 1024 px.

Questa separazione a 768 px è coerente con i breakpoint già usati nell’hero e permette a tablet di mantenere il visual più ampio, mentre gli smartphone ricevono il file verticale ottimizzato.

## Caricamento e prestazioni

- Conservare larghezza e altezza esplicite per evitare spostamenti del layout.
- Fornire asset già dimensionati e compressi per il rispettivo formato.
- Mantenere `sizes` sull’immagine desktop/tablet e aggiungerne uno appropriato alla sorgente mobile, se necessario.
- Non usare due `<img>` con classi `hidden`/`block`.

## Impatto su tracciamento e consenso

Nessun impatto previsto. La futura modifica sarebbe limitata al markup e agli asset dell’immagine nella hero di `src/routes/index.tsx`. Non richiede modifiche a GTM, GA4, Meta Pixel, Iubenda, Consent Mode, `dataLayer`, eventi CTA o altri script.

## Ambito di un’eventuale implementazione futura

1. Aggiungere un solo asset mobile ottimizzato.
2. Sostituire il solo `<img>` della hero con `<picture>` mantenendo testo, CTA, layout e alt text.
3. Verificare che a 390 px venga richiesta soltanto l’immagine mobile e a 768/1024/desktop soltanto quella desktop.
4. Controllare visivamente volto, crop e posizione dello sguardo nelle viewport principali.

Nessuna modifica al sito è stata effettuata durante questo audit.
