# XXI Congreso Nacional de Salud 2026 — Explorador interactivo

Síntesis interactiva de un artículo de LinkedIn de autoría propia sobre el XXI Congreso Nacional de Salud (Bogotá, 10–11 de septiembre de 2026), organizado por Consultorsalud bajo el liderazgo de su CEO, Carlos Felipe Muñoz.

**Vista en vivo:** se publica con GitHub Pages desde la rama `main` (carpeta raíz). Actívalo en *Settings → Pages* si aún no está activo.

## Contenido de la app

1. **Resumen ejecutivo** — el congreso en 60 segundos (1.200+ líderes, 22 conferencias, 2 días), con enlace a la revisión de gobernanza previa del autor.
2. **Diagnóstico causal** — diagrama interactivo de bucles causales (Homer & Hirsch, 2006): R1 (el círculo de la crisis de caja) y B1 (trazabilidad y auditoría preventiva), que retoma y profundiza el modelo R1/B1 de esa revisión previa.
3. **Ejes temáticos del congreso** — financiamiento y sostenibilidad, tarifas y precios regulados, regulación e institucionalidad, epidemiología, y prestadores/infraestructura/IA — cada hallazgo cita, entre comillas, la sesión de la agenda que lo respalda.
4. **Cifras clave** — los números más citados en el escenario (déficit fiscal, cartera de Nueva EPS, brecha tarifaria SOAT/CUPS, alertas epidemiológicas), cada una con su fuente.
5. **Agenda completa** — tabla filtrable de las 22 sesiones (dos jornadas), con horario, foto o iniciales del ponente, y cargo.
6. **Recomendaciones** — síntesis propia del autor, ancladas en los puntos de apalancamiento del diagnóstico causal.
7. **Lagunas de evidencia** — qué no se presentó o quedó sin resolver en el congreso.
8. **Nota técnica** — nota de política pública (contexto → brecha → opciones → próximos pasos) sobre la brecha entre intervención y implementación a nivel de IPS, más una herramienta práctica anidada con el taller de notas técnicas del congreso (sesión 22): un mapa mental interactivo de los elementos de una nota técnica de proveedor a EPS y una plantilla descargable en Word.
9. **Mi lectura** — síntesis y opinión personal del autor.
10. **Metodología y fuentes** — cómo se elaboró esta síntesis y sus límites declarados.

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
- **Trazabilidad de datos**: cada cifra clave y cada nodo del diagrama causal lleva una etiqueta de confiabilidad (*Declarado en escenario* / *Nota del autor*), un **Panel de fuentes** agrega todas las URLs públicas citadas, y un **historial de cambios** (changelog) con fecha real de cada publicación.
- **Exportación por sección**: cada una de las 10 secciones puede exportarse a **Markdown** (descarga `.md`) o **imprimirse a PDF** (usa el diálogo de impresión del navegador con una hoja de estilos dedicada — sin dependencias ni librerías).
- **Calculadora de brecha SOAT/CUPS** en Cifras clave, basada en el ratio agregado declarado en el congreso (no en una consulta código por código, que el congreso no publicó).

## Stack técnico

HTML/CSS/JS sin build step ni frameworks (fácil de servir con GitHub Pages), siguiendo el mismo sistema de diseño que [gobernanza-salud-publica-colombia](https://github.com/fadavilar/gobernanza-salud-publica-colombia) (tema claro/oscuro persistente, acordeones, tablas filtrables con exportación a CSV/Markdown).

- `index.html` — estructura, shell de dos columnas (índice + contenido), buscador y paneles de ayuda/fuentes.
- `css/style.css` — sistema de diseño (tokens de color claro/oscuro, acordeones, sidebar, buscador, responsive, impresión).
- `js/data.js` — todo el contenido editorial (diagnóstico causal, ejes temáticos, cifras clave, agenda, recomendaciones, lagunas, nota técnica, lectura, metodología, fotos de ponentes, changelog, etiquetas de confiabilidad).
- `js/app.js` — renderizado, tema claro/oscuro persistente, acordeones, diagramas SVG interactivos y accesibles, índice/scrollspy, buscador, atajos de teclado, exportación a Markdown/PDF, calculadora.
- `img/speakers/` — retratos oficiales de funcionarios públicos (ver "Fotos de ponentes" abajo).
- `downloads/nota-tecnica-ips-eps-plantilla.docx` — plantilla descargable de nota técnica de proveedor a EPS (sección "Nota técnica").

Para editar contenido, generalmente basta con modificar `js/data.js`; el resto se renderiza automáticamente.

### Alcance de esta ronda (Fase 1 de la mejora en 5 frentes)

Esta actualización cubre las funcionalidades de **alta prioridad** pedidas por el autor: navegación, buscador, accesibilidad, trazabilidad de fuentes y exportación. Quedan pendientes para una siguiente ronda (ya diseñadas, no implementadas): reorganización del contenido por conceptos con matriz de relaciones, comparadores adicionales, más plantillas descargables y un buscador de cifras por rango (prioridad media); y un mapa tipo grafo/constelación, modo resumen de una página y autodiagnóstico para IPS/aseguradores (prioridad baja). No se construyeron comparadores ni calculadoras que habrían requerido inventar datos o metodologías que el congreso no proporcionó (ver Metodología y fuentes en la app).

## Autor

Fabian Dávila Ramírez, MD, MBA, PhD — Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano (Doctorado en Gestión y Modelado de Políticas Públicas)
