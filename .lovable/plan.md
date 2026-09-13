# Rimuovere la configurazione manuale di Google Consent Mode

## Obiettivo
Rimuovere da `src/routes/__root.tsx` solo il blocco script che inizializza manualmente Google Consent Mode (`window.dataLayer`, `gtag()`, `gtag('consent','default',…)`, `gtag('js', new Date())`), perché il consenso è ora gestito dal template ufficiale Iubenda tramite GTM.

## Cosa rimuovere
In `src/routes/__root.tsx`, rimuovere il primo oggetto dell'array `scripts` nelle opzioni `head` (righe 93-99), cioè:

```js
{
  // Google Consent Mode v2 defaults — deny everything until the visitor
  // opts in via the cookie banner. This runs before any gtag.js can load.
  children:
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('js',new Date());",
},
```

## Cosa resta invariato
- Lo script Google Tag Manager `GTM-K6GT864B` nel `<head>` (righe 132-137 e 143-145).
- Il `<noscript>` GTM subito dopo l'apertura di `<body>` (righe 149-158).
- `src/components/GtmEvents.tsx` e tutti i `dataLayer.push()` eventi custom.
- Lo script JSON-LD (riga 100-121) resta al suo posto.
- Meta Pixel, GA4, Clarity e l'integrazione Iubenda via GTM non vengono toccati.
- Nessuna nuova logica di consenso viene aggiunta.

## Verifica
1. Controllare che in `src/routes/__root.tsx` non ci sia più nessuna chiamata `gtag('consent', ...)`.
2. Controllare che `GTM-K6GT864B` compaia una sola volta nello script head e una sola volta nel noscript.
3. Avviare una build/preview e verificare che `gtm.start` sia ancora presente su `window.dataLayer` e che non compaiano errori di consenso manuali.
