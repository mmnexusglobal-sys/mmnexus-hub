# 🧠 M&M Nexus Hub

**Ecosistema multi-agente de IA modular: Print-on-Demand físico y Negocios Digitales, unificados por un núcleo común de marca y automatización.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-red?logo=turborepo)](https://turbo.build/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**M&M Nexus Hub** es un monorepo que alberga el ecosistema completo de automatización de negocios online para el mercado de EE.UU.  
No es una sola aplicación, sino un **núcleo común** que da soporte a dos grandes módulos independientes:

- **Módulo POD**: automatización de tiendas Print-on-Demand (camisetas, tazas, etc.) con publicación en redes sociales.
- **Módulo Digital**: expansión a libros (KDP), afiliados (Hotmart) y contenido (blog + AdSense).

Ambos módulos comparten el mismo motor de agentes, el mismo perfil de marca y la misma interfaz de control, pero se desarrollan, prueban y escalan como unidades lógicas diferenciadas.

---

## 🧱 Estructura del Monorepo

```text
mmnexus-hub/
├── apps/
│   └── web/          # Dashboard y API unificada (Next.js)
├── packages/
│   ├── core/         # Núcleo común (agentes base, orquestación, marca, UI)
│   ├── pod/          # Módulo Print-on-Demand y redes sociales
│   └── digital/      # Módulo Negocios Digitales (KDP, Hotmart, blog)
├── docs/             # Documentación técnica
└── package.json      # Workspaces
```

Cada paquete (`core`, `pod`, `digital`) es una unidad independiente con sus propias reglas de negocio, pero hereda del núcleo común para evitar duplicar código y mantener la coherencia de marca.

> **Regla de oro**: nunca importes código de `pod` en `digital` ni viceversa. Toda comunicación entre módulos ocurre exclusivamente a través del `EventBus` de `@mmnexus/core`.

---

## 🔍 ¿Qué contiene cada módulo?

### 🧠 `@mmnexus/core` – El Núcleo

- **Clases base para agentes**: `BaseAgent`, `AgentOrchestrator`, `EventBus`.
- **Gestor de marca**: `BrandProfile` (colores, tipografías, frases predilectas).
- **Integraciones abstractas**: cliente genérico para APIs externas.
- **Componentes UI compartidos**: Dashboard, formularios, galería, panel de marca.
- **Utilidades**: logging, validadores, helpers de formato.

Todo agente, ya sea de POD o Digital, extiende de `BaseAgent` y se beneficia de la misma gestión de errores, reintentos y comunicación entre módulos.

---

### 🛒 `@mmnexus/pod` – Ecosistema Print-on-Demand

Agentes especializados en detectar tendencias, crear diseños, publicar en redes y gestionar Printify + Shopify.

- **Trend-Finders por plataforma**: `AmazonScout`, `EtsyEye`, `eBayPulse`, `ShopifyRadar`.
- **Creativos**: `CreativeDirector`, `DesignMaker` (imágenes + frases), `CustomizationEngine`.
- **BrandGuardian**: vela por la coherencia visual y de tono antes de cualquier publicación.
- **Social Media Agents por red**: `InstagramGuru`, `TikTokTactician`, `PinterestCurator`, `FacebookWingman`.
- **Publishers**: `PrintifyManager` (crea productos en Printify y conecta Shopify), `SocialPublisher` (Make.com).

**Flujo de trabajo del módulo POD:**

```text
Trend-Finder → CreativeDirector → DesignMaker + CustomizationEngine
    → BrandGuardian → Agentes de Red Social (formato + copy)
    → SocialPublisher → Analytics → AgentFinanciero (actualiza meta PC)
```

> El ciclo se cierra: cada publicación alimenta al `AgentFinanciero` con datos de engagement y ventas, que a su vez actualiza el progreso hacia la meta de infraestructura (PC Workstation).

---

### 📚 `@mmnexus/digital` – Ecosistema Digital *(en desarrollo)*

Hereda del núcleo y contendrá agentes para:

- **Amazon KDP**: creación y publicación de libros electrónicos e impresos.
- **Blog con AdSense**: generación de contenido optimizado para SEO y monetización (disponible en Uruguay sin restricciones).
- **Hotmart**: gestión de productos propios y campañas de afiliados.
- **Landing Pages y Embudos**: automatización de páginas de venta.

Actualmente este módulo es un cascarón preparado para crecer cuando el módulo POD esté maduro y generando ingresos. Los agentes del módulo POD pueden emitir eventos de tendencia al bus que el módulo Digital consumirá para generar contenido alineado.

---

## 🛒 Integraciones actuales y futuras

| Plataforma                   | Módulo  | Estado                                                        |
| ---------------------------- | ------- | ------------------------------------------------------------- |
| **Printify**                 | POD     | ✅ Funcional                                                  |
| **Make.com**                 | POD     | ✅ Publicación en redes vía webhooks                          |
| **Shopify**                  | POD     | 🔜 Conexión en progreso                                       |
| **Google Flow**              | POD     | 🔜 Generación de imágenes y video (Veo 3.1)                   |
| **Amazon Merch, Etsy, eBay** | POD     | 📅 Agentes de tendencia listos, integración de venta planeada |
| **Amazon KDP**               | Digital | 📅 Cascarón preparado                                         |
| **Hotmart**                  | Digital | 📅 Cascarón preparado                                         |
| **AdSense / Blog**           | Digital | 📅 Cascarón preparado                                         |

---

## 🚀 ¿Qué hace especial esta arquitectura?

- **Agentes por canal**: no hay un solo copy genérico. Cada red social tiene su propio agente experto en formato, copy y tono.
- **Marca consistente**: un `BrandGuardian` central revisa cada diseño y texto antes de publicar, usando un perfil de marca configurable.
- **Diseños con personalidad**: el módulo creativo genera imágenes y además añade frases, estilos y composiciones completas, no imágenes sueltas.
- **Feedback loop cerrado**: las ventas y el engagement alimentan al `AgentFinanciero`, que trackea el avance hacia los objetivos de infraestructura.
- **Preparado para escalar**: el módulo Digital puede activarse sin tocar el código de POD, compartiendo tendencias a través del `EventBus`.

---

## 🧰 Stack Tecnológico

| Capa               | Tecnología                                                                   |
| ------------------ | ---------------------------------------------------------------------------- |
| Monorepo           | Turborepo + npm Workspaces                                                   |
| App principal      | Next.js 15 (App Router) + TypeScript                                         |
| Estilos            | Tailwind CSS + componentes reutilizables                                     |
| IA Generativa      | Google Gemini (agentes) + Google Flow / Veo 3.1 (imágenes y video)           |
| Automatización     | Make.com (webhooks)                                                          |
| Integración POD    | Printify API + Shopify API                                                   |
| Base de datos      | Firebase — Firestore (colecciones: `core`, `pod`, `digital`) + Auth + Storage|

---

## 📦 Variables de entorno

Crea un archivo `apps/web/.env.local` basado en este template:

```bash
# ── Firebase ───────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
# Admin SDK (server-side / agentes)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# ── Google AI (Gemini + Flow) ──────────────────────
GOOGLE_AI_API_KEY=

# ── Printify (Módulo POD) ──────────────────────────
PRINTIFY_API_KEY=
PRINTIFY_SHOP_ID=

# ── Shopify (Módulo POD) ───────────────────────────
SHOPIFY_STORE_URL=
SHOPIFY_ADMIN_API_TOKEN=

# ── Make.com ───────────────────────────────────────
MAKE_WEBHOOK_URL=
MAKE_WEBHOOK_SECRET=

# ── Hotmart (Módulo Digital — futuro) ─────────────
HOTMART_CLIENT_ID=
HOTMART_CLIENT_SECRET=

# ── Amazon (KDP + Merch — futuro) ─────────────────
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_ASSOCIATE_TAG=
```

---

## 🖥️ Primeros pasos

### 1. Clona el monorepo

```bash
git clone https://github.com/mmnexusglobal-sys/mmnexus-hub.git
cd mmnexus-hub
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

```bash
cp apps/web/.env.example apps/web/.env.local
# Edita .env.local con tus claves
```

### 4. Ejecuta el servidor de desarrollo

```bash
npm run dev -w apps/web
```

Abre [http://localhost:3000](http://localhost:3000) y accede al dashboard.

---

## 📂 Comandos útiles

```bash
# Construir todos los paquetes
npm run build

# Ejecutar tests en todos los módulos
npm run test

# Ejecutar tests de un módulo específico
npm run test -w packages/pod

# Añadir una dependencia a un paquete específico
npm install <paquete> -w packages/pod

# Verificar TypeScript en todo el monorepo
npm run typecheck
```

---

## 🗺️ Hoja de ruta

### 🟢 Fase 1 – Módulo POD *(en marcha)*

- [x] Arquitectura multiagente base
- [x] Integración Printify y Make.com
- [ ] Agentes de red social por separado (Instagram, TikTok, Pinterest, Facebook)
- [ ] BrandGuardian funcional
- [ ] Conexión Printify ↔ Shopify
- [ ] Feedback loop Analytics → AgentFinanciero

### 🟡 Fase 2 – Módulo Digital *(cascarón)*

- [ ] Estructura de carpetas y clases base en `packages/digital`
- [ ] Placeholders de agentes KDP, Hotmart, blog
- [ ] Colecciones Firestore del módulo `digital`

### 🔵 Fase 3 – Expansión Digital real

- [ ] Integración con Amazon KDP
- [ ] Gestor de afiliados y embudos Hotmart
- [ ] Blog con SEO y AdSense
- [ ] LLC USA → desbloqueo de Etsy + YouTube YPP

---

## 🤝 Contribuir

Este proyecto sigue una estricta arquitectura modular. Antes de enviar un PR, asegurate de:

1. Entender cómo funcionan los agentes base en `packages/core/agents`.
2. Respetar la regla de aislamiento de módulos: **nunca importes de `pod` en `digital` ni viceversa**.
3. Toda comunicación cross-módulo va por el `EventBus`.
4. Mantener cobertura de tests al agregar nuevos agentes.

---

## 📄 Licencia

MIT © M&M Nexus Global
