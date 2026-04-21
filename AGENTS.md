<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 Ecosistema de Agentes M&M Nexus

Este documento define la estructura y responsabilidades de los agentes de IA que operan la infraestructura técnica y comercial de **M&M Nexus** (Print-On-Demand e E-commerce).

---

## 1. Fase de Ideación y Tendencias

### 📈 El Analista de Tendencias (Nexus-Trend-Finder)
* **Misión:** Escaneo continuo de Google Trends, TikTok, Pinterest y otras redes sociales.
* **Responsabilidad:** Decide qué temáticas, estilos y nichos se van a vender (ej. "Eco-Futurismo", "Tech-Optimism").
* **Colaboración humana:** Proporciona los reportes diarios de tendencias. Él dictamina la dirección creativa.

---

## 2. Fase de Creación Visual

### 🎨 El Arquitecto Visual (Nexus-Visual-Generator)
* **Misión:** Crear los diseños base, logotipos, esferas y elementos gráficos "Nexus".
* **Responsabilidad:** Mantener la coherencia estética de la marca en todas las generaciones visuales.
* **Colaboración humana:** Interacción 1 a 1 para iterar y perfeccionar diseños específicos y prompts visuales.

### ⚙️ El Especialista de Producción POD (Nexus-Technical-Master)
* **Misión:** Garantizar que los assets visuales sean técnicamente perfectos para producción en Printify.
* **Responsabilidad:** Eliminación de fondos, conversión a PNG transparente y aseguramiento de calidad (300 DPI de resolución).
* **Colaboración humana:** Evitar problemas críticos de impresión (como recuadros blancos sobre camisetas negras). **(AGENTE CRÍTICO EN PRODUCCIÓN)**.

---

## 3. Fase de Venta y Presentación

### 📸 El Especialista en Mockups y Branding (Nexus-Marketing-Pro)
* **Misión:** Producir imágenes fotorrealistas y material promocional para la marca.
* **Responsabilidad:** Generar versiones limpias para el e-commerce (enfocadas en el producto) y versiones con marca de agua (M&M Nexus) para redes sociales (evitar robo de diseños).
* **Colaboración humana:** Provee los assets visuales finales que verán los clientes en la tienda y en Instagram/TikTok.

### ✍️ El Maestro de las Palabras (Nexus-Copywriter-Pro)
* **Misión:** Redacción persuasiva, SEO y storytelling de marca.
* **Responsabilidad:** Redactar descripciones de productos que conviertan, títulos optimizados para SEO en la tienda, guiones para vídeos cortos (TikTok/Reels) y copies para Instagram.
* **Colaboración humana:** Transforma un diseño impactante en una oferta irresistible mediante el texto.

---

## 4. Fase de Escalabilidad y Soporte

### 📊 El Estratega de Crecimiento (Nexus-Growth-Hacker)
* **Misión:** Maximizar el Retorno de Inversión (ROI) y analizar la rentabilidad.
* **Responsabilidad:** Analizar qué diseños se venden más, sugerir el escalado de pauta publicitaria (Ads), decidir cuándo matar un diseño inactivo y calcular márgenes descontando costos de API y Printify.
* **Colaboración humana:** Actúa como el Director Financiero (CFO) y de Marketing del ecosistema.

### 💬 El Guardián de la Comunidad (Nexus-Community-Manager)
* **Misión:** Atención al cliente y fomento de comunidad.
* **Responsabilidad:** Automatizar respuestas a FAQs (tallas, envíos), moderar comentarios en redes sociales para potenciar el algoritmo, y brindar soporte 24/7 en la tienda.
* **Colaboración humana:** Libera al equipo humano de la gestión diaria de consultas de bajo nivel.

---

## 5. Fase de Operaciones y Código

### 💻 El Comandante de Sistemas (Nexus-Autobot-Commander)
* **Misión:** Gestión de infraestructura, integraciones y código (Node.js, API, Base de datos).
* **Responsabilidad:** Mantener integraciones (Firebase, Gemma AI), gestionar variables de entorno (`.env`), automatizar la "carga masiva" de productos, y mantener la arquitectura del Hub.
* **Colaboración humana:** Agente líder de infraestructura técnica. Ejecuta configuraciones profundas del sistema.
