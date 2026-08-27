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

## 1. URL ✅

Cargada en todos los archivos:

```
https://estudio-g-calafell.vercel.app
```

El día que compren un dominio propio, correr `./set-domain.sh https://el-dominio-nuevo.com.ar` y volver a publicar.

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

**Opción A — Vercel Drop (sin terminal, sin GitHub)**

1. Crear una cuenta gratis en [vercel.com](https://vercel.com).
2. Ir a **[vercel.com/drop](https://vercel.com/drop)**.
3. Arrastrar el `.zip` (o la carpeta descomprimida) a la página.
4. Elegir el equipo y escribir el nombre de proyecto: **`estudio-g-calafell`**.
5. **Deploy**.

**Para volver a publicar sobre el mismo proyecto:** Drop no actualiza un proyecto existente, siempre crea uno nuevo. Para conservar la URL `estudio-g-calafell.vercel.app` hay que borrar el proyecto anterior en el dashboard (Settings → abajo de todo → Delete Project) y volver a arrastrar con el mismo nombre.

Si van a tocar la landing más de una o dos veces, conviene pasar a la opción B: se conserva la URL y no hay que borrar nada.

**Opción B — GitHub (si van a hacer cambios seguido)**

1. Crear un repo en github.com y subir estos archivos (se pueden arrastrar desde la web de GitHub).
2. vercel.com → Add New → Project → importar el repo.
3. Framework Preset: **Other**. Build Command y Output Directory: vacíos.
4. Deploy. Desde ahí, cada cambio que se pushee se publica solo.

**Opción C — terminal**

Terminal en Mac o PowerShell en Windows, parado dentro de esta carpeta, con Node instalado:

```bash
npm i -g vercel
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
- [ ] El proyecto quedó con el nombre `estudio-g-calafell`
- [ ] Pegar el link en un chat de WhatsApp: tiene que salir la imagen con el titular
- [ ] Meta Events Manager marca `PageView`, `Contact` y `Lead`
- [ ] PageSpeed Insights en mobile
- [ ] Poner el link en la bio de Instagram con UTM: `?utm_source=instagram&utm_medium=bio`
      (y otro distinto para stories y anuncios, así se sabe qué trae consultas)
