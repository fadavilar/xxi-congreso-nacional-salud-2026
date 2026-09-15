# XXI Congreso Nacional de Salud 2026 — Explorador interactivo

Síntesis interactiva de un artículo de LinkedIn de autoría propia sobre el XXI Congreso Nacional de Salud (Bogotá, 10–11 de septiembre de 2026), organizado por Consultorsalud bajo el liderazgo de su CEO, Carlos Felipe Muñoz.

**Vista en vivo:** se publica con GitHub Pages desde la rama `main` (carpeta raíz). Actívalo en *Settings → Pages* si aún no está activo.

## Contenido de la app

1. **Resumen ejecutivo** — el congreso en 60 segundos (1.200+ líderes, 22 conferencias, 2 días).
2. **Ejes temáticos del congreso** — financiamiento y sostenibilidad, tarifas y precios regulados, regulación e institucionalidad, epidemiología, y prestadores/infraestructura/IA — cada hallazgo enlazado a la sesión de la agenda que lo respalda.
3. **Cifras clave** — los números más citados en el escenario (déficit fiscal, cartera de Nueva EPS, brecha tarifaria SOAT/CUPS, alertas epidemiológicas), cada una con su fuente.
4. **Agenda completa** — tabla filtrable de las 22 sesiones (dos jornadas), con horario, ponente y cargo.
5. **Mi lectura** — síntesis y opinión personal del autor.
6. **Metodología y fuentes** — cómo se elaboró esta síntesis y sus límites declarados.

## Nota sobre el alcance de esta app

Esta aplicación es una síntesis editorial de un evento de industria, basada en la agenda oficial del congreso, transcripciones propias de las sesiones grabadas y la cobertura publicada por Consultorsalud (consultorsalud.com). La clasificación por ejes temáticos y la sección "Mi lectura" son una elaboración propia del autor, no una posición oficial del congreso, de Consultorsalud ni de los ponentes citados.

## Stack técnico

HTML/CSS/JS sin build step (fácil de servir con GitHub Pages), siguiendo el mismo sistema de diseño que [gobernanza-salud-publica-colombia](https://github.com/fadavilar/gobernanza-salud-publica-colombia) (tema claro/oscuro persistente, acordeones, tablas filtrables con exportación a CSV).

- `index.html` — estructura y metadatos.
- `css/style.css` — sistema de diseño (tokens de color claro/oscuro, acordeones, responsive).
- `js/data.js` — todo el contenido editorial (ejes temáticos, cifras clave, agenda, lectura, metodología).
- `js/app.js` — renderizado, tema claro/oscuro persistente, acordeones (expandir/colapsar todo) y tablas filtrables.

Para editar contenido, generalmente basta con modificar `js/data.js`; el resto se renderiza automáticamente.

## Autor

Fabian Dávila Ramírez, MD, MBA, PhD — Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano (Doctorado en Gestión y Modelado de Políticas Públicas)
