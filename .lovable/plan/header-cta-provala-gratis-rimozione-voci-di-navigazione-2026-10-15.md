# Header CTA "Provala gratis!" + rimozione voci di navigazione

Aggiungere un CTA sempre visibile nell'header che apre lo stesso popup di iscrizione già presente, e rimuovere dal header le voci "Find a WayMaker" e "Become a WayMaker" (desktop nav e menu mobile).

## Modifiche — `src/components/SiteHeader.tsx`

1. **Rimozione navigazione**
   - Eliminare l'array `NAV` e il `<nav>` desktop con i link Home / Find a WayMaker / Become a WayMaker.
   - Eliminare l'intero `Sheet` del menu mobile (burger + pannello): resterebbe vuoto, il toggle lingua è già fuori dal menu. Scomparirà l'icona hamburger su mobile.

2. **Nuovo CTA nell'header (desktop e mobile)**
   - Renderizzare `JoinEarlyAccess` (stesso componente del popup esistente) come wrapper del pulsante, così il popup è **identico** a quello dell'hero: stesse carte ruolo, email, consenso, validazioni, Privacy Policy Iubenda.
   - Copia del pulsante: "Provala gratis!" (IT) / "Try it free!" (EN), stile `rounded-full`, dimensione compatta (`h-9`/`h-10`) per stare nell'header.
   - Tracciamento coerente con l'hero: evento `cta_click` con `button_location: "header"` (nessuna modifica a GTM/GA4/Iubenda).
   - Layout: logo a sinistra; a destra toggle lingua (IT/EN) + CTA. La lingua seguita è quella già passata dalle pagine tramite `locale`, quindi il CTA si traduce con il toggle.

3. **Cleanup**
   - Rimuovere gli import non più usati (`Link`, `Menu`, `Sheet*`, `activeProps`), mantenendo `Logo`, `Button`, `LanguageSwitch`.

## Pagine interessate

- Il header è condiviso: home, `/find-a-waymaker`, `/become-a-waymaker`. Il CTA e il popup funzionano su tutte e tre senza modifiche alle pagine (ogni pagina monta già `SiteHeader` con `locale`/`onLocaleChange`).
- Nessuna modifica a: hero, footer, sezioni della landing, tracking/consenso, altre pagine.

## Verifica

- Build OK e nessun errore console.
- Desktop (1280px) e mobile (390px): header mostra logo + lingua + "Provala gratis!", senza voci di nav né hamburger; clic sul CTA apre il popup identico a quello dell'hero; invio con email valida funziona; chiusura ripristina lo stato.
- Su `/find-a-waymaker` e `/become-a-waymaker` il CTA dell'header apre lo stesso popup.
