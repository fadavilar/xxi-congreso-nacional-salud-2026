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
8. **Mi lectura** — síntesis y opinión personal del autor.
9. **Metodología y fuentes** — cómo se elaboró esta síntesis y sus límites declarados.

## Nota sobre el alcance de esta app

Esta aplicación es una síntesis editorial de un evento de industria, basada en la agenda oficial del congreso, anotaciones propias del autor durante las sesiones y la cobertura publicada por Consultorsalud (consultorsalud.com). La clasificación por ejes temáticos, el diagnóstico causal, las recomendaciones, las lagunas de evidencia y la sección "Mi lectura" son una elaboración propia del autor, no una posición oficial del congreso, de Consultorsalud ni de los ponentes citados.

## Fotos de ponentes

Solo se muestran retratos oficiales tomados del sitio institucional propio de cada funcionario público (INS, INVIMA, IETS, ADRES, Cámara de Representantes — fuente citada al pasar el cursor sobre cada foto). Los ponentes del sector privado, y los funcionarios públicos sin retrato oficial disponible en su propio sitio, se muestran con iniciales — nunca con fotos de redes sociales o prensa de terceros.

## Stack técnico

HTML/CSS/JS sin build step (fácil de servir con GitHub Pages), siguiendo el mismo sistema de diseño que [gobernanza-salud-publica-colombia](https://github.com/fadavilar/gobernanza-salud-publica-colombia) (tema claro/oscuro persistente, acordeones, tablas filtrables con exportación a CSV).

- `index.html` — estructura y metadatos.
- `css/style.css` — sistema de diseño (tokens de color claro/oscuro, acordeones, responsive).
- `js/data.js` — todo el contenido editorial (diagnóstico causal, ejes temáticos, cifras clave, agenda, recomendaciones, lagunas, lectura, metodología, fotos de ponentes).
- `js/app.js` — renderizado, tema claro/oscuro persistente, acordeones (expandir/colapsar todo), diagrama causal SVG interactivo, tablas filtrables y avatares de ponentes.
- `img/speakers/` — retratos oficiales de funcionarios públicos (ver "Fotos de ponentes" abajo).

Para editar contenido, generalmente basta con modificar `js/data.js`; el resto se renderiza automáticamente.

## Autor

Fabian Dávila Ramírez, MD, MBA, PhD — Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano (Doctorado en Gestión y Modelado de Políticas Públicas)
