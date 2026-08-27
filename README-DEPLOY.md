# Deploy en Vercel — Estudio González Calafell

Sitio estático + una función serverless. No hay build: Vercel sirve los archivos tal cual.

```
index.html            landing (autocontenida: CSS, JS y logo embebidos)
privacidad.html       /privacidad
terminos.html         /terminos
api/lead.js           función serverless que recibe el lead del calificador
vercel.json           rutas limpias + headers de seguridad y caché
robots.txt
sitemap.xml
og.png                imagen de previsualización (1200×630) para WhatsApp e Instagram
favicon.png · apple-touch-icon.png · icon-512.png · logo.png
```

---

## 1. Poner la URL definitiva

Si no hay dominio propio, Vercel asigna uno fijo del tipo `https://nombre-del-proyecto.vercel.app`.
Ese sirve perfecto: no caduca y cambia solo si se renombra el proyecto.

El orden es: **deployar primero, copiar la URL, y recién ahí correr el script**.

```bash
./set-domain.sh https://nombre-del-proyecto.vercel.app
vercel --prod     # o push al repo
```

Reemplaza `DOMINIO.COM` en `index.html`, `privacidad.html`, `terminos.html`, `robots.txt` y `sitemap.xml`.

Por qué no se puede automatizar: `og:image` tiene que ser una URL absoluta, y los scrapers de WhatsApp e Instagram no ejecutan JavaScript, así que no hay forma de completarla en el navegador. Hasta que se corra el script, el link pegado en un chat sale sin imagen de preview — el sitio funciona igual.

Si más adelante compran un dominio, se vuelve a correr el mismo script con la URL nueva.

## 2. Píxel de Meta *(opcional)*

Es el píxel de **Meta (Facebook/Instagram)**: un identificador numérico de ~15 dígitos que conecta este sitio con la cuenta publicitaria, para que Meta sepa qué visitas y qué consultas vinieron de cada anuncio.

**Sirve solo si se hace publicidad paga en Instagram o Facebook hacia esta landing.** Si el tráfico viene únicamente del link en bio y de contenido orgánico, se puede borrar el bloque `<!-- Meta Pixel -->` de `index.html` y listo.

Dónde se saca: Meta Business Suite → Administrador de eventos (*Events Manager*) → Orígenes de datos. Si la cuenta publicitaria del estudio ya corre anuncios, el píxel probablemente ya existe; si no, se crea ahí mismo en dos clics.

Después se pega el número en `index.html`, en la línea `window.GC_PIXEL_ID='PIXEL_ID'`.
Mientras diga `PIXEL_ID` el script no se carga: el sitio anda igual y no se envía nada a Meta.

Eventos que dispara solo:

| Evento | Cuándo |
|---|---|
| `PageView` | al cargar |
| `Contact` | click en cualquier botón que abre WhatsApp |
| `Lead` | al completar los 3 pasos del calificador, con el rango de deuda en `content_category` |

Ese `content_category` es lo que después permite optimizar campañas por valor de lead, no solo por volumen.

## 3. Datos del responsable en los legales ✅

Ya cargados en `privacidad.html`, punto 1: Estudio González Calafell, titular persona física, CUIT 20-07611661-0, domicilio en Villa Crespo, CABA.

Queda opcional, si quieren dejarlo a prueba de reclamos: agregar el nombre y apellido del titular y la calle y número. Con lo que hay ya se identifica al responsable; el domicilio exacto es lo que suele pedirse si alguien inicia un reclamo ante la Agencia de Acceso a la Información Pública.

## 4. Subir

**Opción A — desde la web (más rápido)**

1. Subir esta carpeta a un repo de GitHub.
2. vercel.com → Add New → Project → importar el repo.
3. Framework Preset: **Other**. Build Command: vacío. Output Directory: vacío (raíz).
4. Deploy.

**Opción B — desde la terminal**

```bash
npm i -g vercel
cd esta-carpeta
vercel          # preview
vercel --prod   # producción
```

## 5. Dominio propio *(cuando lo tengan)*

Vercel → Project → Settings → Domains → agregar el dominio.
En el panel del registrador (NIC.ar, GoDaddy, etc.):

- `A` en `@` → `76.76.21.21`
- `CNAME` en `www` → `cname.vercel-dns.com`

El certificado HTTPS lo emite Vercel solo. Elegir una versión canónica (con o sin `www`) y redirigir la otra desde Settings → Domains.

## 6. Guardar los leads (recomendado, no obligatorio)

El formulario abre WhatsApp con el mensaje ya escrito **y además** postea el lead a `/api/lead`.
En los comentarios del Instagram hay gente diciendo que sus mensajes de WhatsApp no llegan: sin este respaldo, esa consulta se pierde.

Vercel → Settings → Environment Variables:

```
LEAD_WEBHOOK_URL = https://hooks.zapier.com/...   (o Make, Google Apps Script, el CRM)
```

Sin la variable la función responde OK y solo loguea: nada se rompe.
El webhook recibe un JSON con `nombre`, `telefono`, `monto`, `situacion`, `mensaje`, `url`, `ref`, `ts` e `ip`.

Lo más barato para arrancar: un Google Apps Script publicado como Web App que escriba una fila por lead en una hoja de cálculo.

## 7. Chequeo post-deploy

- [ ] Los 5 botones de WhatsApp abren el chat con el número correcto
- [ ] El calificador avanza los 3 pasos y arma el mensaje con las respuestas
- [ ] `/privacidad` y `/terminos` cargan (sin `.html` en la URL)
- [ ] Correr `./set-domain.sh` con la URL final y redeployar
- [ ] Pegar el link en un chat de WhatsApp: tiene que salir la imagen con el titular
- [ ] Meta Events Manager marca `PageView`, `Contact` y `Lead`
- [ ] PageSpeed Insights en mobile
- [ ] Poner el link en la bio de Instagram con UTM: `?utm_source=instagram&utm_medium=bio`
      (y otro distinto para stories y anuncios, así se sabe qué trae consultas)
