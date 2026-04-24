# 🧠 M&M Nexus Hub

**Ecosistema multi-agente de IA para creación de contenido con identidad de marca, automatización de tiendas POD (Printify + Shopify) y publicación en redes sociales, orientado al mercado de Estados Unidos.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**M&M Nexus Hub** ya no es solo un pipeline. Es un **ejército de agentes de IA ultra especializados** que trabajan en paralelo para dominar cada plataforma de venta y cada red social con un estilo de marca único y reconocible.

Cada red social tiene su propio agente creativo, su propio copywriter y su propio publicador. Cada ecommerce tiene su propio detective de tendencias. Y todos están supervisados por un **Brand Guardian** que garantiza coherencia visual y de tono en cada publicación.

---

## 🚀 La diferencia: agentes individuales, marca consistente

- **Agentes por red social**: No es un copy genérico para todos. Instagram, TikTok, Pinterest y Facebook reciben formatos, copys y _hashtags_ diseñados por un especialista nativo de cada plataforma.
- **Diseños con personalidad**: El módulo de diseño no solo genera imágenes; añade **frases, texturas, estilos personalizables** y compone postales completas que transmiten el ADN de la marca.
- **Detectives de nicho por plataforma**: Un agente experto en Etsy no busca tendencias en Amazon, y viceversa. Cada uno conoce las reglas del juego de su marketplace.
- **Guardian de Marca**: Un agente central que revisa cada _post_ y cada diseño para que todos mantengan el mismo universo visual y verbal.

---

## 🏗️ Arquitectura del ecosistema de agentes

El sistema se organiza en **cuatro grandes familias de agentes**:

### 🔍 1. Agentes de Inteligencia de Mercado (Trend-Finders por ecommerce)
Cada uno monitorea tendencias en su propia plataforma y entrega un informe estructurado con nichos de alto potencial, productos virales y palabras clave.

| Agente | Plataforma | Especialidad |
|--------|------------|--------------|
| **Amazon Scout** | Amazon Merch / KDP | Detecta libros, camisetas y productos más vendidos, analiza reseñas. |
| **Etsy Eye** | Etsy | Busca tags en tendencia, estilos artesanales y personalización. |
| **eBay Pulse** | eBay | Encuentra subastas calientes y productos con alta rotación. |
| **Shopify Radar** | Tiendas Shopify webs | Rastrea tiendas de éxito y tendencias en dropshipping. |

### 🎨 2. Agentes Creativos (Diseño + Toque Diferencial)
Estos agentes **no generan imágenes aisladas**. Construyen piezas completas con frases, identidad visual y la capacidad de ser personalizadas manualmente.

*   **Creative Director (orquestador)**: Recibe la tendencia, decide el concepto, la frase y los parámetros visuales.
*   **Design Maker**: Genera la imagen base con IA, pero además superpone tipografías, aplica filtros de marca y exporta en los formatos requeridos por cada red social.
*   **Customization Engine**: Permite al usuario guardar estilos, frases recurrentes y paletas de colores para mantener la coherencia a lo largo del tiempo.
*   **Brand Guardian**: Antes de publicar, este agente evalúa que el diseño y el copy respeten el manual de marca: paleta de colores, tono de voz, tipografía, espacio para logotipos, etc.

### ✍️ 3. Agentes de Formato y Copy por Red Social
Una vez aprobado el diseño, **cada red social recibe su propio tratamiento**:

| Agente | Red Social | Tareas específicas |
|--------|------------|-------------------|
| **Instagram Guru** | Instagram | Crea carruseles, reels y stories. Copy con hashtags, formato cuadrado/vertical. |
| **TikTok Tactician** | TikTok | Adapta el diseño a formato 9:16, propone textos de gancho, efectos y sonidos de tendencia. |
| **Pinterest Curator** | Pinterest | Genera pines alargados, descripciones con palabras clave long-tail y llamadas a la acción para clics. |
| **Facebook Wingman** | Facebook | Redacta posts más conversacionales, aptos para grupos y anuncios. |
| **Technical Formatter** | General | Prepara los tamaños de archivo, resolución y metadatos exactos para cada plataforma. |

### 🚀 4. Agentes de Publicación e Integración
Una vez que el contenido está validado y formateado, los **Publisher Agents** lo suben automáticamente o lo dejan programado.

*   **Social Publisher**: Publica en cada red a través de Make.com con la programación óptima.
*   **Printify Manager**: Sube el diseño a Printify, crea el producto y lo vincula a la tienda Shopify correspondiente (futuro: Amazon Merch, Etsy, eBay).
*   **Daily Reporter**: Genera un resumen por correo/slack con todo lo publicado y los resultados preliminares.

### Flujo de trabajo simplificado
[Agentes de Inteligencia por ecommerce]
↓
[Creative Director + Design Maker + Customization Engine]
↓
[Brand Guardian – Aprobación]
↓
[Agentes de Copy y Formato por red social]
↓
[Publicadores automáticos]

---

## 🛒 Integraciones actuales y planificadas

| Plataforma | Tipo | Estado |
|------------|------|--------|
| **Printify** | POD | ✅ Funcional (creación de productos) |
| **Shopify** | Tienda | 🔜 Conexión Printify-Shopify en progreso |
| **Make.com** | Automatización | ✅ Publicación de redes vía webhook |
| **Amazon Merch** | POD | 📅 Agente Amazon Scout y publicador futuro |
| **Amazon KDP** | Libros | 📅 Planificado en fase de contenidos |
| **Etsy** | Handmade/POD | 📅 Agente Etsy Eye + integración API |
| **eBay** | Subastas | 📅 Agente eBay Pulse + API |
| **Hotmart** | Afiliados | 📅 Módulo de embudos y landing pages |

---

## 🧰 Stack Tecnológico

- **Frontend & Backend**: Next.js 15 (App Router) + TypeScript
- **Estilos**: Tailwind CSS, componentes personalizados con diseño oscuro
- **IA Generativa**: Google AI (Gemini) y Pollinations (fallback) para imágenes, más un motor de composición con Canvas/Sharp para añadir frases y branding
- **Automatización**: Make.com para publicación en redes
- **Integración POD**: Printify API
- **Base de Datos**: PostgreSQL (Prisma) para guardar estilos, historial de publicaciones y preferencias de marca

---

## 📦 Variables de entorno

```bash
# Printify
PRINTIFY_API_KEY=
PRINTIFY_SHOP_ID=

# Google AI
GOOGLE_AI_API_KEY=

# Make.com
MAKE_WEBHOOK_URL=

# Redes sociales (futuro: publicación directa)
INSTAGRAM_API_KEY=
TIKTOK_API_KEY=
PINTEREST_API_KEY=
FACEBOOK_API_KEY=
```

## 🖥️ Primeros pasos

Clona el repositorio
```bash
git clone https://github.com/mmnexusglobal-sys/mmnexus-hub.git
cd mmnexus-hub
```

Instala dependencias
```bash
npm install
```

Configura variables de entorno en `.env.local`

Ejecuta el servidor de desarrollo
```bash
npm run dev
```

Abre http://localhost:3000

## 📂 Estructura de carpetas (reflejo de la arquitectura de agentes)

```text
app/
 ├── api/
 │    ├── agents/
 │    │    ├── trend-finders/   # amazon-scout, etsy-eye, ebay-pulse, shopify-radar
 │    │    ├── creative/        # creative-director, design-maker, customization-engine
 │    │    ├── brand-guardian/  # brand-guardian
 │    │    ├── social/          # instagram-guru, tiktok-tactician, pinterest-curator, facebook-wingman
 │    │    └── publishers/      # social-publisher, printify-manager
 │    └── ...
components/
 ├── agents/                   # Interfaz de cada agente en el dashboard
 ├── brand/                    # Selector de paletas, tipografías, frases
 └── dashboard/                # Panel de control general
lib/
 ├── agents/                   # Lógica de negocio y comunicación entre agentes
 ├── integrations/             # Printify, Make, futuras APIs
 └── brand/                    # Definiciones de marca, estilos guardados
```

## 🗺️ Hoja de ruta actualizada

**Fase 1 – MVP Multi-Agente**
- Agentes de tendencias genérico (migrar a especializados)
- Integración Printify y Make.com
- Generación de imágenes básica
- Migración a arquitectura de agentes por red social (estructura de carpetas)
- Creative Director con frases y estilos personalizables

**Fase 2 – Brand Guardian y Multi-Plataforma**
- Brand Guardian activo en cada publicación
- Agentes de tendencias Amazon/Etsy/eBay funcionales
- Conexión Shopifiy completa

**Fase 3 – Publicación Directa**
- Publicadores nativos para Instagram, TikTok, Pinterest, Facebook
- Customization Engine (guardar estilos del usuario)

**Fase 4 – Contenidos y Afiliados**
- Amazon KDP, Google Books
- Web de afiliados, embudos Hotmart

## 🤝 Contribuir
Para entender la filosofía y la comunicación entre agentes, comienza leyendo `docs/AGENTS.md`.
Aceptamos PRs que añadan nuevos agentes, mejoren el guardián de marca o implementen conectores de publicación directa.

## 📄 Licencia
MIT © M&M Nexus Global
