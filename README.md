# XXI Congreso Nacional de Salud 2026 — Explorador interactivo

Síntesis interactiva de un artículo de LinkedIn de autoría propia sobre el XXI Congreso Nacional de Salud (Bogotá, 10–11 de septiembre de 2026), organizado por Consultorsalud bajo el liderazgo de su CEO, Carlos Felipe Muñoz.

**Vista en vivo:** se publica con GitHub Pages desde la rama `main` (carpeta raíz). Actívalo en *Settings → Pages* si aún no está activo.

## Contenido de la app

La app está organizada como un documento de síntesis (resumen → introducción → materiales y métodos → resultados → discusión y recomendaciones → conclusión), no como la agenda del congreso — pensada para que quien no asistió tenga una lectura ordenada, y quien sí asistió encuentre valor adicional (diagnóstico causal, tablero de recomendaciones, nota técnica con herramientas descargables).

1. **Resumen** — el congreso en un párrafo.
2. **Introducción** — por qué este congreso, cómo se organiza este documento, y su relación con la revisión de gobernanza previa del autor.
3. **Materiales y métodos** — metodología y fuentes de esta síntesis, más la **agenda completa**: tabla filtrable de las 22 sesiones (ponente y cargo en una sola columna, y una columna con la conclusión más relevante de cada una).
4. **Resultados** — diagnóstico causal (diagrama de bucles R1/B1, Homer & Hirsch 2006), ejes temáticos (cada hallazgo cita, entre comillas, la sesión que lo respalda) y cifras clave.
5. **Discusión y recomendaciones** — tablero de acción con las recomendaciones del autor, lagunas de evidencia (con enlaces a la revisión de gobernanza previa del autor cuando aplica), y una nota técnica (contexto → marco normativo → brecha → opciones → próximos pasos) sobre la brecha entre intervención e implementación en IPS, fundamentada en la metodología oficial de MinSalud para este mismo instrumento (Decreto 780 de 2016, desarrollado en 2022), con una herramienta práctica anidada con el taller de notas técnicas del congreso (sesión 22): mapa mental interactivo + plantilla descargable en Excel.
6. **Conclusión** — mi lectura: síntesis y opinión personal del autor.

## Nota sobre el alcance de esta app

Esta aplicación es una síntesis editorial de un evento de industria, basada en la agenda oficial del congreso, anotaciones propias del autor durante las sesiones y la cobertura publicada por Consultorsalud (consultorsalud.com). La clasificación por ejes temáticos, el diagnóstico causal, las recomendaciones, las lagunas de evidencia y la sección "Mi lectura" son una elaboración propia del autor, no una posición oficial del congreso, de Consultorsalud ni de los ponentes citados.

## Fotos de ponentes

Solo se muestran retratos oficiales tomados del sitio institucional propio de cada funcionario público (INS, INVIMA, IETS, ADRES, Cámara de Representantes — fuente citada al pasar el cursor sobre cada foto). Los ponentes del sector privado, y los funcionarios públicos sin retrato oficial disponible en su propio sitio, se muestran con iniciales — nunca con fotos de redes sociales o prensa de terceros.

## Navegación, búsqueda y accesibilidad

- **Índice lateral pegajoso** con subsecciones (ejes, grupos de cifras, herramienta de nota técnica), que resalta la sección activa al hacer scroll (scrollspy) y se refleja en el breadcrumb superior. En móvil se convierte en un panel deslizante.
- **Buscador en vivo** (`/` para abrir) que filtra por ponente, cargo, tema, cifra, sesión y eje, con navegación por teclado (`↑`/`↓`/`Enter`) y resultado con salto directo a la sección.
- **Atajos de teclado** documentados en un panel de ayuda (`?`): `/` buscar, `Esc` cerrar, `↑`/`↓` navegar resultados, `Enter` ir al resultado.
- **Modo de lectura enfocada** (oculta índice, breadcrumb y chrome secundario) y **botón "volver arriba"**.
- **Accesibilidad WCAG AA**: foco visible en todo elemento interactivo, `role="region"`/`aria-labelledby` en cada sección del acordeón, tablas con `<caption>` accesible, nodos de los diagramas SVG operables por teclado (Tab + Enter/Espacio), y una vista alterna "Ver como lista" para cada diagrama (el diagnóstico causal y el mapa mental de notas técnicas) como equivalente textual completo.
- **Trazabilidad de datos**: cada cifra clave y cada nodo del diagrama causal lleva una etiqueta de confiabilidad (*Declarado en escenario* / *Nota del autor*), y un **Panel de fuentes** agrega todas las URLs públicas citadas.
- **Exportación a PDF**: un único control al final del contenido (no uno por sección) exporta a PDF, vía el diálogo de impresión del navegador, únicamente las secciones que tengas expandidas en ese momento — las colapsadas se excluyen automáticamente. Sin Markdown ni librerías externas.

## Stack técnico

HTML/CSS/JS sin build step ni frameworks (fácil de servir con GitHub Pages), siguiendo el mismo sistema de diseño que [gobernanza-salud-publica-colombia](https://github.com/fadavilar/gobernanza-salud-publica-colombia) (tema claro/oscuro persistente, acordeones, tablas filtrables con exportación a CSV).

- `index.html` — estructura, shell de dos columnas (índice + contenido), buscador, paneles de ayuda/fuentes y el control único de exportación.
- `css/style.css` — sistema de diseño (tokens de color claro/oscuro, acordeones, sidebar, buscador, responsive, impresión).
- `js/data.js` — todo el contenido editorial (diagnóstico causal, ejes temáticos, cifras clave, agenda, recomendaciones, lagunas, nota técnica, lectura, metodología, fotos de ponentes, etiquetas de confiabilidad).
- `js/app.js` — renderizado, tema claro/oscuro persistente, acordeones, diagramas SVG interactivos y accesibles, índice/scrollspy, buscador, atajos de teclado, exportación a PDF.
- `img/speakers/` — retratos oficiales de funcionarios públicos (ver "Fotos de ponentes" abajo).
- `downloads/nota-tecnica-ips-eps-plantilla.xlsx` — plantilla descargable en Excel: hoja "Guía" (referencia normativa y de sesión del congreso de cada elemento), "Ingreso de valores" (los 8 elementos con un ejemplo prediligenciado, listo para reemplazar) y "Resumen" (costo total, costo medio por afiliado, margen y punto de equilibrio calculados por fórmula a partir de lo diligenciado). Las tres hojas están enlazadas por botones de navegación y protegidas (solo las celdas de ejemplo son editables); los campos con riesgo de mala interpretación llevan una nota emergente con la fuente, y los campos de opción fija usan listas desplegables.

Para editar contenido, generalmente basta con modificar `js/data.js`; el resto se renderiza automáticamente.

### Alcance de esta ronda (Fase 1 de la mejora en 5 frentes)

Esta actualización cubre las funcionalidades de **alta prioridad** pedidas por el autor: navegación, buscador, accesibilidad, trazabilidad de fuentes y exportación. Quedan pendientes para una siguiente ronda (ya diseñadas, no implementadas): reorganización del contenido por conceptos con matriz de relaciones, comparadores adicionales, más plantillas descargables y un buscador de cifras por rango (prioridad media); y un mapa tipo grafo/constelación, modo resumen de una página y autodiagnóstico para IPS/aseguradores (prioridad baja). No se construyeron comparadores ni calculadoras que habrían requerido inventar datos o metodologías que el congreso no proporcionó — incluida la calculadora de brecha SOAT/CUPS de la primera ronda de esta fase, retirada después por no aportar valor más allá de una multiplicación porcentual (ver Metodología y fuentes en la app).

## Autor

Fabian Dávila Ramírez, MD, MBA, PhD — Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano (Doctorado en Gestión y Modelado de Políticas Públicas)
