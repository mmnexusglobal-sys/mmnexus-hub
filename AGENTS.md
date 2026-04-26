<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 Ecosistema de Agentes M&M Nexus (v2.0 Pipeline)

Este documento define la estructura y responsabilidades de los agentes de IA que operan la infraestructura técnica y comercial de **M&M Nexus** (Print-On-Demand e E-commerce), actualizados a la arquitectura v2.0.

---

## 🔗 El Pipeline Automatizado v2.0

El flujo de trabajo automatizado y conectado consta de los siguientes pasos críticos, donde cada agente consume el output del anterior:

**01. Trend-Finder** (JSON Score) ➔ **02. Visual-Generator** (Variantes A/B) ➔ **03. Technical-Master** (Validación) ➔ **04. Marketing-Pro** (Mockups+Copy) ➔ **06. QA-Guardian** (Control Calidad) ➔ **05. Autobot-Commander** (Upload & Reporte)

---

## 1. Fase de Ideación y Tendencias

### 📈 01. El Analista de Tendencias (Nexus-Trend-Finder)
* **Misión:** Escaneo continuo de Google Trends, TikTok y marketplaces.
* **Estado v2.0:** Genera outputs estructurados en JSON con score de oportunidad (búsqueda vs. competencia).
* **Responsabilidad:** Entregar los conceptos que "venden" cada día listos para ser consumidos automáticamente por la API de diseño.

---

## 2. Fase de Creación Visual y Técnica

### 🎨 02. El Arquitecto Visual (Nexus-Visual-Generator)
* **Misión:** Creación de activos visuales de alta gama.
* **Estado v2.0:** Consume directamente el JSON del Trend-Finder. Genera 2-3 variantes por concepto automáticamente con convenciones de nombres estrictas.
* **Responsabilidad:** Mantener la estética futurista y limpia de la marca (Bio-Digital, Blueprint, etc).

### ⚙️ 03. El Especialista de Producción POD (Nexus-Technical-Master)
* **Misión:** Optimización de archivos para Printify.
* **Estado v2.0:** Validación post-proceso. Bloquea el pipeline si un archivo falla y genera un log de errores.
* **Responsabilidad:** Asegurar 300 DPI, remoción de fondos, CMYK, garantizando que no sea una simple "pegatina" sobre la tela.

---

## 3. Fase de Presentación y Copywriting

### 📸 04. El Especialista en Branding & Copy (Nexus-Marketing-Pro & Copywriter-Pro)
* **Misión:** Generación de Mockups y redacción persuasiva.
* **Estado v2.0:** Genera formatos por canal (1:1 feed, 9:16 stories). Crea captions automáticos y hashtags basados en la tendencia inyectada por el Agente 01.
* **Responsabilidad:** Crear material visual para Instagram y el catálogo de la tienda, optimizado para SEO.

---

## 4. Fase de Control de Calidad (NUEVO)

### 🛡️ 06. El Guardián de Calidad (Nexus-QA-Guardian) [NUEVO]
* **Misión:** Control de calidad automatizado antes de producción.
* **Estado v2.0:** Actúa como barrera final antes de Printify.
* **Responsabilidad:** Verificación técnica (DPI, dimensiones, transparencia) y revisión de marca. Aprueba o rechaza diseños mandándolos de vuelta al agente correspondiente. Mantiene un log de auditoría.

---

## 5. Fase de Operaciones y Orquestación

### 💻 05. El Integrador de Sistemas (Nexus-Autobot-Commander)
* **Misión:** Gestión de Node.js, Next.js y API de Printify.
* **Estado v2.0:** Orquestador central. Implementa lógica de reintentos (retry logic) ante fallos de API.
* **Responsabilidad:** Automatizar la carga masiva. Generar el **reporte diario consolidado** (productos subidos, errores, SKUs creados) para notificación humana.

---

## 6. Fase de Escalabilidad y Soporte (Background)

### 📊 El Estratega de Crecimiento (Nexus-Growth-Hacker)
* **Misión:** Maximizar ROI y analizar la rentabilidad de las campañas. Analiza los outputs del Autobot-Commander.

### 💬 El Guardián de la Comunidad (Nexus-Community-Manager)
* **Misión:** Atención al cliente 24/7 y fomento de comunidad en redes, retroalimentando al Trend-Finder sobre pedidos comunes.
