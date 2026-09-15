/* ============================================================
   Datos de la aplicación — XXI Congreso Nacional de Salud 2026
   Contenido derivado de un artículo de LinkedIn de autoría propia,
   basado en la agenda oficial del congreso, anotaciones propias del
   autor durante las sesiones (10–11 sept. 2026) y la cobertura
   publicada por Consultorsalud. Ninguna cifra aquí fue inventada:
   todas provienen de lo declarado por los ponentes en el escenario
   o de las fuentes públicas citadas explícitamente.
   ============================================================ */

const DATA = {

  meta: {
    title: "XXI Congreso Nacional de Salud 2026",
    subtitle: "Explorador interactivo de los ejes temáticos, las cifras clave y la agenda completa del Congreso Nacional de Salud, organizado por Consultorsalud",
    author: "Fabian Dávila Ramírez",
    credentials: "MD, MBA, PhD",
    affiliation: "Universidad de Navarra · Universidad de Bogotá Jorge Tadeo Lozano (Doctorado en Gestión y Modelado de Políticas Públicas)",
    period: "10–11 de septiembre de 2026 · Grand Hyatt, Bogotá",
    framework: "Síntesis de congreso · agenda oficial + anotaciones propias del autor durante las sesiones",
    disclaimer: "Esta aplicación sintetiza un artículo de LinkedIn de autoría propia sobre el XXI Congreso Nacional de Salud (Bogotá, 10–11 de septiembre de 2026), organizado por Consultorsalud. Las cifras y citas provienen de la agenda oficial del congreso, de anotaciones propias del autor durante las sesiones y de la cobertura publicada por Consultorsalud (consultorsalud.com); la selección de ejes temáticos, la lectura final y las opiniones son responsabilidad del autor, no de los ponentes citados ni del organizador del evento.",
    license: {
      name: "Creative Commons Atribución 4.0 Internacional (CC BY 4.0)",
      url: "https://creativecommons.org/licenses/by/4.0/deed.es",
      text: "Este contenido puede compartirse y adaptarse libremente, incluso con fines comerciales, siempre citando al autor."
    },
    relatedWork: {
      title: "Gobernanza y Rectoría en Salud Pública en Colombia",
      text: "Revisión de alcance del mismo autor sobre gobernanza y rectoría en el sector salud colombiano (2021–2026), con un modelo causal de dinámica de sistemas (bucles R1/B1). El diagnóstico causal de este congreso retoma y profundiza ese modelo.",
      url: "https://fadavilar.github.io/gobernanza-salud-publica-colombia/"
    }
  },

  stats: [
    { value: "1.200+", label: "Líderes asistentes", detail: "Aseguradores, prestadores, entes de control, academia e industria" },
    { value: "22", label: "Conferencias", detail: "Agenda académica repartida en dos jornadas" },
    { value: "2 días", label: "10–11 de septiembre de 2026", detail: "Grand Hyatt, Bogotá" },
    { value: "XXI", label: "Edición del congreso", detail: "Organizado por Consultorsalud, bajo el liderazgo de su CEO Carlos Felipe Muñoz" },
  ],

  intro: "El 10 y 11 de septiembre de 2026, el Grand Hyatt de Bogotá reunió a más de 1.200 líderes del sector —aseguradores, prestadores, entes de control, academia e industria— en la vigésimo primera edición del Congreso Nacional de Salud, organizado por Consultorsalud bajo el liderazgo de su CEO, Carlos Felipe Muñoz. Dos días, veintidós conferencias y un mismo hilo conductor: el sistema colombiano llega a 2026–2030 con coberturas altas en el papel, pero con una brecha financiera y territorial que ya no admite parches.",

  selectiveCategory: {
    title: "Un mismo punto de llegada: costos reales y evidencia, no inercias históricas",
    text: "Casi todas las conversaciones del congreso —tarifas, UPC, compra de medicamentos, evaluación de tecnologías, inteligencia artificial— terminaron en el mismo punto: la necesidad de decisiones basadas en costos reales y evidencia, no en inercias históricas. Si 2026–2027 es el momento en que se redefinen esas reglas, quienes trabajan en la intersección entre industria, evidencia y sistema de salud tienen mucho que aportar a esa conversación."
  },

  // ------------------------------------------------------------------
  // Diagnóstico causal — modelo de dinámica de sistemas (Homer & Hirsch,
  // 2006), construido a partir de lo declarado en el congreso. Retoma y
  // profundiza el modelo R1/B1 de la revisión de gobernanza del autor
  // (ver meta.relatedWork): la crisis de caja documentada aquí es una
  // manifestación reciente del mismo patrón de fragmentación
  // institucional y financiera identificado en esa revisión.
  // ------------------------------------------------------------------
  causalLoop: {
    citation: "Diagramación siguiendo a Homer, J. B., & Hirsch, G. B. (2006). System dynamics modeling for public health. American Journal of Public Health, 96(3), 452–458. Construido a partir de las cifras y afirmaciones declaradas en el congreso (ver sesiones citadas en cada nodo), no de un modelo estadístico ajustado.",
    nodes: [
      { id: 1, label: "Déficit fiscal y estructural del sistema", actors: "Fedesarrollo · MinHacienda", sessions: [1, 15], confidence: "escenario" },
      { id: 2, label: "Flujo oportuno de recursos hacia prestadores", actors: "ADRES", sessions: [8, 21], confidence: "escenario" },
      { id: 3, label: "Cartera y mora con prestadores", actors: "IPS · Nueva EPS", sessions: [8, 13], confidence: "escenario" },
      { id: 4, label: "Riesgo de cierre de servicios", actors: "Prestadores / IPS", sessions: [13, 17], confidence: "escenario" },
      { id: 5, label: "Intervención y vigilancia especial de EPS", actors: "Supersalud · Procuraduría", sessions: [13, 16], confidence: "escenario" },
      { id: 6, label: "Confianza de prestadores e inversionistas", actors: "Mercado del sector salud", sessions: [], confidence: "nota-autor" },
    ],
    // polarity: "-" = las variables cambian en sentido opuesto; "+" = cambian en el mismo sentido
    edges: [
      { from: 1, to: 2, polarity: "-" },
      { from: 2, to: 3, polarity: "-" },
      { from: 3, to: 4, polarity: "+" },
      { from: 4, to: 5, polarity: "+" },
      { from: 5, to: 6, polarity: "-" },
      { from: 6, to: 1, polarity: "-" },
    ],
    loops: [
      {
        id: "R1",
        type: "reforzamiento",
        title: "R1 — El círculo de la crisis de caja (bucle de refuerzo)",
        text: "Un mayor déficit fiscal y estructural reduce el flujo oportuno de recursos que ADRES gira a los prestadores, lo que aumenta la cartera y la mora con IPS y hospitales. Esto eleva el riesgo de cierre de servicios, lo que motiva más intervenciones y vigilancia especial sobre las EPS (Nueva EPS, Procuraduría) — y esas intervenciones, aunque necesarias, erosionan la confianza de prestadores e inversionistas en el sistema, lo que a su vez reduce la eficiencia de recaudo y ejecución y profundiza el déficit fiscal, cerrando el ciclo. Con cuatro relaciones de polaridad negativa (número par), el bucle es de refuerzo: cada vuelta agrava la crisis de caja en vez de resolverla.",
      },
      {
        id: "B1",
        type: "balance",
        title: "B1 — Trazabilidad total y auditoría preventiva (bucle de balance, con demora)",
        text: "La hoja de ruta 2026–2030 de ADRES (\"cada peso con huella digital\", detección de riesgo antes del pago) y la auditoría forense de la UPC presentada por Simón Guzmán buscan intervenir directamente sobre el flujo de recursos, antes de que la fuga se convierta en cartera. Son anuncios recientes: ningún ponente presentó todavía una evaluación de impacto de estas iniciativas — la misma laguna que el bucle B1 (iniciativas de fortalecimiento) de la revisión de gobernanza del autor encontró para la centralización analítica de ADRES (FEV-RIPS, 2024–2025). La fuerza relativa de B1 frente a R1 permanece como pregunta abierta.",
        relatedInitiatives: ["Hoja de ruta ADRES 2026-2030 (trazabilidad total)", "Auditoría forense de la UPC", "Circular 022 de 2026 (precios regulados)"]
      }
    ]
  },

  // ------------------------------------------------------------------
  // Ejes temáticos del congreso, con las sesiones (agenda) que los respaldan
  // ------------------------------------------------------------------
  categories: [
    {
      id: "A",
      title: "Financiamiento y sostenibilidad, el nudo central",
      color: "cat-a",
      codes: [
        { text: "La ministra de Salud, Ana María Vesga, abrió el congreso con tres verbos para 2026–2027: recuperar, estabilizar y transformar.", studies: [1] },
        { text: "El CEO de Consultorsalud, Carlos Felipe Muñoz, presentó las variables críticas de vigilancia 2026–2027 para prestadores, aseguradores e industria que enmarcaron el resto del congreso.", studies: [2] },
        { text: "Fasecolda (Fernando Dueñas Castro) analizó el comportamiento del mercado de seguros voluntarios y del gasto de bolsillo frente a la crisis del sistema público.", studies: [3] },
        { text: "Fedesarrollo (Marcela Meléndez, primera mujer en dirigir la institución en 55 años) presentó el diagnóstico macro: Colombia crece en promedio 1,1% anual desde 2015, dos de cada cinco colombianos viven en pobreza, y el sistema de salud arrastra un déficit estructural estimado en 19,7 billones de pesos al año, con deudas cruzadas entre 25 y 33 billones pendientes por conciliar.", studies: [15] },
        { text: "Jesús Albrey González Páez mapeó el flujo de recursos —cartera, reclamaciones y embargos— que asfixia la operación de muchas IPS.", studies: [8] },
        { text: "Simón Guzmán presentó la auditoría forense de la UPC como mecanismo de detección de riesgos y recuperación de recursos.", studies: [11] },
        { text: "El agente interventor de Nueva EPS, Roberto Solano, reportó que de más de 3.800 prestadores, cerca de 600 operan sin contrato formal; el lineamiento de pago se fijó en máximo 80% para lo público y 70% para lo privado, con excepciones por riesgo de cierre de servicios.", studies: [13] },
        { text: "La procuradora delegada para Asuntos de la Salud, Mónica Andrea Ulloa, reportó cerca de 23 billones de pesos en radicaciones y facturas sin resolver bajo vigilancia especial.", studies: [16] },
        { text: "ADRES (Iván Sánchez Arango) planteó la hoja de ruta 2026–2030 hacia un flujo con trazabilidad total —\"cada peso con huella digital\"— y mecanismos de detección de riesgo antes del pago, no después.", studies: [21] },
      ]
    },
    {
      id: "B",
      title: "Tarifas: el vacío que nadie quiere seguir ignorando",
      color: "cat-b",
      codes: [
        { text: "Julio César Benedetti: Colombia no tiene un manual tarifario único, obligatorio y actualizado. El tarifario SOAT vigente cubre 3.281 códigos frente a los 10.024 procedimientos de la Clasificación Única de Procedimientos en Salud (Resolución 2706 de 2025); el ISS 2001, la otra referencia histórica, no se actualiza desde su creación.", studies: [14] },
        { text: "La Circular 022 de 2026 regula precios de 705 principios activos, con un ajuste generalizado de -7% frente a la circular anterior y sanciones severas para quien no la aplique.", studies: [14] },
        { text: "Conclusión de Benedetti: la contratación del futuro debe construirse sobre costos reales, no sobre tarifas históricas.", studies: [14] },
        { text: "Juvenny Organista analizó los modelos de compra directa de medicamentos desde el aseguramiento y sus resultados en eficiencia y acceso.", studies: [19] },
      ]
    },
    {
      id: "C",
      title: "Regulación e institucionalidad bajo el nuevo gobierno",
      color: "cat-c",
      codes: [
        { text: "INVIMA (Sindy Pahola Pulgarín) presentó su agenda regulatoria 2026–2030 para medicamentos y dispositivos médicos.", studies: [7] },
        { text: "El IETS (Adriana Robayo) anunció una \"nueva caja de herramientas\" de evaluación de tecnologías en salud para 2026–2030.", studies: [4] },
        { text: "Julio Mario Orozco Africano analizó los límites jurídicos del Plan de Desarrollo frente a la vía de decretos.", studies: [10] },
        { text: "El representante Andrés Forero, presidente de la Comisión VII del Senado, repasó la agenda legislativa pendiente: aprobación del presupuesto 2027, una solicitud adicional de 12 a 13,9 billones de pesos para el sector, y la ley de competencias territoriales — todo con plazos que vencían literalmente esa misma semana.", studies: [12] },
      ]
    },
    {
      id: "D",
      title: "Epidemiología: alertas que no dan tregua",
      color: "cat-d",
      codes: [
        { text: "Zulma Cucunubá, directora del Instituto Nacional de Salud, presentó un panorama de transiciones epidemiológicas simultáneas: 56.797 casos de dengue reportados a semana epidemiológica 26, 58 casos confirmados de fiebre amarilla con una letalidad preliminar de 46,5%, y un incremento del 92% en brotes de infecciones asociadas a la atención en salud.", studies: [5] },
        { text: "Ricardo Fábrega (OPS/OMS) situó estas alertas dentro de una discusión más amplia sobre cooperación y capacidades del sistema ante esta \"nueva etapa sanitaria\".", studies: [6] },
      ]
    },
    {
      id: "E",
      title: "Prestadores, infraestructura, IA y el día a día de la operación",
      color: "cat-e",
      codes: [
        { text: "Luis Eduardo Pino (OxLER) presentó instituciones de salud \"aumentadas\" por capacidades cognitivas y agentes inteligentes para transformar la gestión y la atención.", studies: [9] },
        { text: "Jacqueline Jaimes (Qualico) mostró casos de uso concretos de IA generativa para la gestión sanitaria: la discusión ya no era si adoptar IA, sino qué decisiones de implementación tomar primero.", studies: [20] },
        { text: "Juan Carlos Giraldo (ACHC) planteó la agenda de transformación de hospitales y clínicas para 2026–2030.", studies: [17] },
        { text: "El arquitecto Amedeo Vita y el ingeniero Javier Mora (ACAIH) llamaron a revisar la seguridad sísmica de la infraestructura hospitalaria, con lecciones desde el terremoto del Eje Cafetero de 1999 que siguen vigentes.", studies: [18] },
        { text: "El congreso cerró con un taller práctico de Andrés Fabián Jiménez sobre modelación contractual avanzada para IPS: costos, notas técnicas y gestión de contratos prospectivos de cara a 2027.", studies: [22] },
      ]
    },
  ],

  // ------------------------------------------------------------------
  // Cifras clave — dos puntos verificados (before/after) del congreso
  // ------------------------------------------------------------------
  comparisonIndicators: [
    {
      id: "deficit-fiscal",
      title: "Déficit fiscal proyectado de Colombia",
      unit: "% del PIB",
      loopLink: "Presentado por Fedesarrollo (Marcela Meléndez) como el techo de margen de maniobra fiscal para cualquier reforma del sector salud en 2026–2030.",
      before: { label: "Nivel de referencia reciente", value: "6%" },
      after: { label: "Proyectado (presupuesto radicado)", value: "9%" },
      deltaNote: "El deterioro fiscal deja poco margen de maniobra para el financiamiento adicional que el sector salud reclama para 2027.",
      source: "Fedesarrollo (Marcela Meléndez), sesión 15 — XXI Congreso Nacional de Salud, 11 de septiembre de 2026.",
      sourceUrl: null,
      confidence: "escenario"
    },
    {
      id: "cartera-nueva-eps",
      title: "Prestadores de Nueva EPS sin contrato formal",
      unit: "N.º de prestadores",
      loopLink: "Dimensiona, con la cifra más alta reportada en el congreso, la magnitud del problema de cartera y contratación que enfrenta la intervención de Nueva EPS.",
      before: { label: "Prestadores totales", value: "3.800+" },
      after: { label: "Sin contrato formal", value: "≈600" },
      deltaNote: "Cerca del 16% de la red de prestadores de Nueva EPS opera sin contrato formal; el lineamiento de pago se fijó en máximo 80% para lo público y 70% para lo privado, con excepciones por riesgo de cierre de servicios.",
      source: "Roberto Solano, Agente Interventor de Nueva EPS, sesión 13 — XXI Congreso Nacional de Salud, 11 de septiembre de 2026.",
      sourceUrl: null,
      confidence: "escenario"
    },
  ],

  // ------------------------------------------------------------------
  // Cifras clave adicionales — un solo punto verificado cada una,
  // agrupadas por eje temático. Todas declaradas en el escenario por
  // el ponente citado; no se dispone de URL pública individual.
  // Confiabilidad: todo este bloque se etiqueta como "escenario" al
  // renderizar (ver renderCifras en app.js) — no se repite el campo
  // en cada figura porque es uniforme para las 11.
  // ------------------------------------------------------------------
  keyFigureGroups: [
    {
      title: "Financiamiento y sostenibilidad",
      figures: [
        { value: "19,7 billones", label: "Déficit financiero estructural del sistema", detail: "Estimado anual, Fedesarrollo — sesión 15", session: 15 },
        { value: "25–33 billones", label: "Deudas cruzadas pendientes de conciliar", detail: "Entre actores del sistema, Fedesarrollo — sesión 15", session: 15 },
        { value: "≈23 billones", label: "Radicaciones y facturas sin resolver", detail: "Vigilancia especial, Procuraduría General de la Nación — sesión 16", session: 16 },
        { value: "1,1%", label: "Crecimiento económico promedio anual", detail: "Colombia, desde 2015 — Fedesarrollo, sesión 15", session: 15 },
      ]
    },
    {
      title: "Tarifas y precios regulados",
      figures: [
        { value: "32,7%", label: "Cobertura del tarifario SOAT frente a los procedimientos vigentes", detail: "3.281 códigos SOAT vs. 10.024 procedimientos CUPS (Res. 2706 de 2025) — sesión 14", session: 14 },
        { value: "-7%", label: "Ajuste de precios de medicamentos, Circular 022 de 2026", detail: "705 principios activos regulados frente a la circular anterior — sesión 14", session: 14 },
      ]
    },
    {
      title: "Epidemiología y alertas sanitarias",
      figures: [
        { value: "56.797", label: "Casos de dengue reportados", detail: "A semana epidemiológica 26 de 2026, INS — sesión 5", session: 5 },
        { value: "58", label: "Casos confirmados de fiebre amarilla", detail: "Letalidad preliminar 46,5%, INS — sesión 5", session: 5 },
        { value: "+92%", label: "Incremento en brotes de infecciones asociadas a la atención en salud", detail: "INS — sesión 5", session: 5 },
      ]
    },
    {
      title: "Regulación e institucionalidad",
      figures: [
        { value: "12–13,9 billones", label: "Solicitud presupuestal adicional para el sector salud, 2027", detail: "Comisión VII del Senado (Andrés Forero) — sesión 12", session: 12 },
      ]
    },
  ],

  // ------------------------------------------------------------------
  // Recomendaciones — síntesis propia del autor, ancladas en puntos de
  // apalancamiento del diagnóstico causal. No son conclusiones del
  // congreso ni posiciones de Consultorsalud o de los ponentes citados.
  // ------------------------------------------------------------------
  recommendations: [
    {
      title: "Publicar el manual tarifario único basado en costos reales",
      leverage: "Nodo 3 (cartera y mora) — cerrar la brecha SOAT/CUPS reduce la incertidumbre que alimenta la negociación caso a caso",
      text: "El tarifario SOAT vigente cubre apenas 3.281 de los 10.024 procedimientos ya definidos en la Resolución 2706 de 2025 (sesión 14). Con la clasificación de procedimientos ya publicada, el siguiente paso lógico es un manual tarifario único, obligatorio y basado en costos reales — no una actualización más del ISS 2001.",
      owner: "MinSalud / Comisión de Regulación en Salud",
      nextStep: "Publicar cronograma de expedición del tarifario único con plazos verificables.",
      outcomes: [
        { name: "Factibilidad", level: "alta", note: "La Resolución 2706 de 2025 ya define los procedimientos; falta fijar el tarifario, no la clasificación." },
        { name: "Evidencia disponible", level: "media", note: "Un solo ponente (Benedetti) documentó la brecha; no hay cifra oficial consolidada presentada en el congreso." },
        { name: "Alineación con gobernanza", level: "alta", note: "Coincide con la recomendación de consolidar una arquitectura única de datos y financiamiento de la revisión de gobernanza del autor." },
      ]
    },
    {
      title: "Evaluar públicamente la hoja de ruta de trazabilidad de ADRES antes de escalarla",
      leverage: "Nodo 2 (flujo de recursos) — bucle B1 del diagnóstico causal",
      text: "ADRES presentó la meta de trazabilidad total (\"cada peso con huella digital\") como anuncio, no como resultado. Antes de escalarla a todo el sistema, conviene una evaluación independiente con indicadores explícitos de reducción de cartera y de tiempos de pago.",
      owner: "ADRES / veeduría independiente",
      nextStep: "Definir y publicar 2-3 indicadores de seguimiento antes de la siguiente fase de despliegue.",
      outcomes: [
        { name: "Factibilidad", level: "alta", note: "ADRES ya opera la plataforma; el costo marginal de instrumentar indicadores de seguimiento es bajo." },
        { name: "Evidencia disponible", level: "baja", note: "Ningún resultado de implementación fue reportado en el congreso, solo la hoja de ruta." },
        { name: "Alineación con gobernanza", level: "alta", note: "Misma laguna que el bucle B1 de la revisión de gobernanza: la centralización analítica de ADRES (FEV-RIPS) tampoco tenía evaluación empírica disponible." },
      ]
    },
    {
      title: "Fijar metas trimestrales de regularización de contratos en la intervención de Nueva EPS",
      leverage: "Nodo 3 → Nodo 4 — reducir directamente el riesgo de cierre de servicios",
      text: "Con cerca de 600 de más de 3.800 prestadores sin contrato formal (sesión 13), el límite de pago (máximo 80% público / 70% privado) protege el flujo de caja de la intervención, pero no fija una meta explícita de reducción de la cartera sin contrato en el tiempo.",
      owner: "Agente Interventor Nueva EPS / Supersalud",
      nextStep: "Publicar una meta trimestral de reducción de prestadores sin contrato formal.",
      outcomes: [
        { name: "Factibilidad", level: "media", note: "Requiere capacidad de gestión contractual adicional dentro de una intervención ya sobrecargada." },
        { name: "Evidencia disponible", level: "alta", note: "Cifra declarada directamente por el agente interventor en el escenario." },
        { name: "Alineación con gobernanza", level: "alta", note: "Coherente con el llamado de la revisión de gobernanza a proteger la continuidad de la prestación percibida por la ciudadanía." },
      ]
    },
    {
      title: "Convertir las radicaciones sin resolver de la Procuraduría en un tablero público de seguimiento",
      leverage: "Nodo 5 (vigilancia especial) → Nodo 6 (confianza)",
      text: "La cifra de ≈23 billones de pesos en radicaciones y facturas sin resolver (sesión 16) se conoció como un dato agregado y puntual. Publicarla de forma progresiva y territorializada la convertiría en un indicador líder de riesgo, no solo en un balance retrospectivo.",
      owner: "Procuraduría General de la Nación",
      nextStep: "Habilitar un tablero público con actualización periódica, desagregado por EPS o región.",
      outcomes: [
        { name: "Factibilidad", level: "alta", note: "El dato ya existe dentro de la vigilancia especial; el costo marginal de un tablero público es bajo." },
        { name: "Evidencia disponible", level: "media", note: "Cifra agregada nacional; no se presentó desagregación por EPS o región en el congreso." },
        { name: "Alineación con gobernanza", level: "alta", note: "Extiende la recomendación de la revisión de gobernanza de usar la judicialización y la vigilancia como alerta temprana, no solo como litigio o sanción." },
      ]
    },
    {
      title: "Exigir métricas de resultado, no solo casos de uso, para la IA en salud",
      leverage: "Fuera del bucle principal — apalancamiento de innovación",
      text: "Las dos sesiones sobre inteligencia artificial (9 y 17) mostraron capacidades y decisiones de implementación pendientes, pero ningún caso de uso presentó una métrica de resultado (eficiencia, seguridad, reducción de error). La discusión de \"qué decisiones tomar primero\" debería incluir cómo se va a medir el resultado.",
      owner: "Proveedores de IA en salud / IPS adoptantes",
      nextStep: "Exigir un reporte de resultado (no solo de capacidades) en la próxima presentación pública de cada herramienta.",
      outcomes: [
        { name: "Factibilidad", level: "media", note: "Requiere que los proveedores de IA acepten reportar métricas de resultado, no solo funcionalidades." },
        { name: "Evidencia disponible", level: "baja", note: "Ningún caso de uso presentado incluyó datos de resultado medidos." },
        { name: "Alineación con gobernanza", level: "media", note: "No cubierto directamente por la revisión de gobernanza del autor, pero coherente con su exigencia de evaluación empírica antes de escalar cualquier iniciativa." },
      ]
    },
  ],

  // ------------------------------------------------------------------
  // Lagunas de evidencia — qué no se presentó o quedó sin resolver
  // ------------------------------------------------------------------
  gaps: [
    "Ninguna sesión presentó una cifra única y reconciliada de la deuda del sistema: se citaron 19,7 billones (déficit estructural anual, sesión 15), 25–33 billones (deudas cruzadas, sesión 15) y ≈23 billones (radicaciones sin resolver, sesión 16) sin que quedara claro cuánto se solapan entre sí.",
    "No hubo sesión dedicada a salud mental, salud indígena/SISPI, ni a la salud rural o dispersa — ausentes de una agenda centrada en financiamiento, tarifas e institucionalidad.",
    "Los casos de uso de IA generativa (sesiones 9 y 17) no presentaron métricas de resultado (eficiencia, seguridad, reducción de error), solo capacidades y decisiones de implementación pendientes.",
    "No se presentaron indicadores de resultado en salud (mortalidad evitable, calidad de la atención): casi todos los indicadores citados en el congreso fueron financieros o administrativos.",
    "La hoja de ruta de trazabilidad de ADRES 2026–2030 y la auditoría forense de la UPC son anuncios recientes, sin evaluación de impacto disponible todavía — el mismo tipo de laguna identificada para el bucle B1 en la revisión de gobernanza del autor.",
    "No se abordó la articulación territorial más allá de menciones generales a \"brechas territoriales\" en la sesión de epidemiología (sesión 5) — sin cifras desagregadas por departamento o municipio.",
  ],

  // ------------------------------------------------------------------
  // Nota técnica — plantilla de nota de política pública (contexto →
  // brecha → evidencia → opciones → próximos pasos) aplicada a una
  // oportunidad que atravesó el congreso sin nombrarse explícitamente:
  // la distancia entre las intervenciones que se anuncian a nivel de
  // pagador/regulador y su implementación real a nivel de IPS y otros
  // prestadores. Síntesis propia del autor.
  // ------------------------------------------------------------------
  technicalNote: {
    title: "De la intervención a la implementación",
    subtitle: "Cerrar la brecha entre lo que se anuncia a nivel de pagador/regulador y lo que se implementa a nivel de IPS y otros prestadores",
    purpose: "Esta nota técnica usa un formato estándar de nota de política pública — contexto, brecha, evidencia, opciones, próximos pasos — para sintetizar una oportunidad que atravesó el congreso sin nombrarse explícitamente como tal.",
    context: "El congreso mostró una agenda densa de intervenciones anunciadas desde el nivel central: la intervención de Nueva EPS, la auditoría forense de la UPC, la hoja de ruta de trazabilidad de ADRES, la agenda regulatoria de INVIMA y la nueva caja de herramientas del IETS. Todas son decisiones que se toman y se comunican desde el pagador, el regulador o el ente de control — no desde el prestador que debe absorberlas operativamente.",
    gapTable: {
      columns: ["Intervención anunciada (nivel pagador/regulador)", "Evidencia de implementación en IPS (nivel prestador)"],
      rows: [
        ["Límite de pago 80% público / 70% privado en la intervención de Nueva EPS (sesión 13)", "Sin meta explícita de regularización de contratos para los ≈600 prestadores sin contrato formal"],
        ["Auditoría forense de la UPC (sesión 11)", "Sin mecanismo reportado de retroalimentación operativa hacia las IPS auditadas"],
        ["Hoja de ruta de trazabilidad total de ADRES (sesión 21)", "Sin evaluación de cómo cambia el flujo de caja percibido por las IPS"],
        ["Casos de uso de IA generativa y agentes inteligentes (sesiones 9 y 17)", "Sin métricas de adopción o de resultado operativo a nivel de IPS"],
        ["Manual tarifario único pendiente (sesión 14)", "Una sola sesión del congreso (22) abordó cómo una IPS modela contractualmente estos cambios"],
      ]
    },
    opportunity: "El congreso cerró justamente con la sesión 22 — modelación contractual avanzada para IPS — la única que trató explícitamente cómo un prestador opera estos cambios, no solo cómo el pagador los anuncia. Que el sector ya reserve un espacio para esto sugiere que la implementación a nivel de IPS es la siguiente frontera; esta nota técnica propone hacerla explícita en la agenda, no dejarla como nota de cierre.",
    options: [
      {
        title: "Exigir un componente de implementación en cada intervención de EPS",
        text: "Toda intervención de EPS debería incluir, desde su diseño, un componente explícito de acompañamiento técnico a IPS — no solo límites de pago — con indicadores de adopción medidos a nivel de prestador.",
      },
      {
        title: "Estandarizar herramientas de modelación contractual para IPS",
        text: "Convertir herramientas como la presentada en la sesión 22 en requisito mínimo para las IPS que negocian con EPS intervenidas o bajo vigilancia especial, no en un taller aislado de congreso.",
      },
      {
        title: "Vincular el manual tarifario único con capacitación en costeo",
        text: "La publicación del manual tarifario único (ver Recomendaciones) debería ir acompañada de un programa que permita a las IPS costear procedimientos bajo el nuevo esquema, no solo recibir la tarifa.",
      },
      {
        title: "Medir adopción y resultado, no solo despliegue",
        text: "Cualquier iniciativa de IA en salud debería reportar cuántas IPS la adoptaron y con qué efecto operativo — no solo el caso de uso conceptual presentado en el escenario.",
      },
    ],
    outcomesFramework: {
      note: "Marco de resultados de implementación (adaptado de Proctor et al., 2011) aplicado a la adopción de herramientas de implementación por parte de las IPS — ninguna de estas dimensiones fue evaluada en el congreso; se listan como agenda pendiente.",
      rows: [
        { name: "Aceptabilidad", level: "por evaluar", note: "No se documentó si las IPS perciben estas herramientas como útiles o como carga administrativa adicional." },
        { name: "Adopción", level: "por evaluar", note: "No hay dato sobre cuántas IPS usan hoy herramientas de modelación contractual." },
        { name: "Factibilidad", level: "alta", note: "Las herramientas ya existen (sesión 22); el límite es la capacidad técnica instalada en cada IPS, no la disponibilidad de la herramienta." },
        { name: "Penetración", level: "incierta", note: "Probablemente concentrada en IPS grandes o urbanas; sin evidencia sobre IPS pequeñas o rurales." },
        { name: "Sostenibilidad", level: "por evaluar", note: "Depende de que el acompañamiento sea un programa continuo, no un evento puntual de congreso." },
      ]
    },
    nextSteps: [
      { actor: "MinSalud / ADRES", action: "Condicionar el desembolso ligado a la hoja de ruta de trazabilidad a métricas de adopción por IPS, no solo a la operación de la plataforma." },
      { actor: "Gremios (ACHC y similares)", action: "Documentar y difundir casos de IPS que ya cerraron esta brecha, no solo casos de crisis de cartera." },
      { actor: "Consultoras y proveedores de tecnología", action: "Reportar públicamente resultados de implementación (eficiencia, adopción) y no solo funcionalidades de sus herramientas." },
      { actor: "Academia / investigación", action: "Extender a IPS privadas y mixtas el llamado de la revisión de gobernanza del autor a investigar la gobernanza a nivel micro-institucional." },
    ],
    sources: "Basada en las sesiones 9, 11, 13, 14, 17, 21 y 22 del congreso, y en las recomendaciones B y C de la revisión de gobernanza del autor (ver \"Análisis relacionado del autor\" en el Resumen ejecutivo).",

    // ------------------------------------------------------------------
    // Herramienta práctica anidada con la sesión 22 (taller de notas
    // técnicas): mapa mental interactivo + plantilla descargable de los
    // elementos a considerar al construir una nota técnica de un
    // prestador (IPS u otro) hacia una EPS. Síntesis propia del autor,
    // no un formato oficial ni exigido por ninguna entidad.
    // ------------------------------------------------------------------
    providerNoteTool: {
      intro: "El congreso cerró con un taller práctico sobre modelación contractual avanzada para IPS — costos, notas técnicas y gestión de contratos prospectivos (sesión 22). A partir de esa sesión y de los hallazgos de tarifas (sesión 14) y epidemiología (sesión 5), este mapa mental resume los elementos que una nota técnica de un prestador hacia una EPS debería considerar. Toca o pasa el cursor sobre cada rama para ver el detalle.",
      center: "Nota técnica: IPS → EPS",
      branches: [
        {
          id: 1, label: "Identificación y alcance", sessions: [22],
          items: ["IPS / prestador y nivel de complejidad", "Línea de servicio o especialidad", "EPS o pagador destinatario", "Vigencia y período cubierto", "Población objetivo (afiliados cubiertos)"]
        },
        {
          id: 2, label: "Marco tarifario de referencia", sessions: [14, 22],
          items: ["Manual tarifario aplicado (SOAT, ISS 2001, tarifario propio)", "Códigos CUPS cubiertos vs. no cubiertos", "Ajustes pactados frente al período anterior", "Justificación de desviaciones frente a tarifas históricas"]
        },
        {
          id: 3, label: "Estructura de costos", sessions: [14, 22],
          items: ["Costos directos: personal, insumos, medicamentos", "Costos indirectos / overhead", "Costos fijos vs. variables", "Punto de equilibrio (break-even)"]
        },
        {
          id: 4, label: "Supuestos de utilización", sessions: [5, 22],
          items: ["Frecuencia de uso esperada por afiliado", "Base epidemiológica o demanda proyectada", "Estacionalidad o variabilidad esperada", "Fuente de los datos históricos"]
        },
        {
          id: 5, label: "Modelo de pago propuesto", sessions: [22],
          items: ["Capitación / evento / paquete / resultado", "Justificación técnica de la modalidad", "Ajuste por inflación o IPC", "Periodicidad de revisión tarifaria"]
        },
        {
          id: 6, label: "Riesgo compartido", sessions: [22],
          items: ["Corredor de riesgo (risk corridor)", "Techo (stop-loss)", "Piso de garantía", "Responsabilidad por desviaciones"]
        },
        {
          id: 7, label: "Indicadores de calidad y resultado", sessions: [22],
          items: ["Indicadores de calidad asociados al pago", "Metas de oportunidad de atención", "Indicadores de satisfacción del usuario", "Incentivos o penalidades por cumplimiento"]
        },
        {
          id: 8, label: "Anexos y soportes", sessions: [22],
          items: ["Histórico de utilización o facturación (12–24 meses)", "Benchmarks de mercado o de la red", "Memoria de cálculo / hoja de costeo", "Soportes normativos citados"]
        },
      ],
      template: {
        filename: "nota-tecnica-ips-eps-plantilla.xlsx",
        path: "downloads/nota-tecnica-ips-eps-plantilla.xlsx",
        label: "Descargar plantilla (.xlsx)",
        note: "Plantilla editable en Excel con los 8 elementos de este mapa mental, una hoja por sección con guías de qué completar y tablas de costos/riesgo listas para llenar (con subtotales calculados). No es un formato oficial ni exigido por ninguna EPS o entidad regulatoria — es una guía práctica basada en esta síntesis."
      }
    },
  },

  // ------------------------------------------------------------------
  // Mi lectura — síntesis y reflexión propia del autor
  // ------------------------------------------------------------------
  reading: {
    text: "Lo que más resuena, desde la óptica de acceso y valor, es que casi todas las conversaciones —tarifas, UPC, compra de medicamentos, evaluación de tecnologías, IA— terminaron en el mismo punto: la necesidad de decisiones basadas en costos reales y evidencia, no en inercias históricas. Si 2026–2027 es el momento en que se redefinen esas reglas, quienes trabajamos en la intersección entre industria, evidencia y sistema de salud tenemos mucho que aportar a esa conversación.",
    prompt: "¿Qué sesión les hubiera gustado ver comentada con más detalle? Con gusto profundizo en los comentarios."
  },

  // ------------------------------------------------------------------
  // Agenda completa (22 sesiones, 2 jornadas)
  // ------------------------------------------------------------------
  agenda: [
    { n: 1,  day: "Jueves 10 de septiembre", time: "8:00 a.m. – 8:15 a.m.",  title: "Mensaje de la Ministra al XXI Congreso Nacional de Salud", speaker: "Dra. Ana María Vesga", role: "Ministra de Salud y Protección Social", tag: "mensaje de apertura de la Ministra" },
    { n: 2,  day: "Jueves 10 de septiembre", time: "8:15 a.m. – 9:00 a.m.",  title: "Decisiones sectoriales 2026–2027: variables críticas de vigilancia para prestadores, aseguradores e industria", speaker: "Dr. Carlos Felipe Muñoz", role: "CEO Consultorsalud", tag: "variables críticas de vigilancia 2026-2027" },
    { n: 3,  day: "Jueves 10 de septiembre", time: "9:00 a.m. – 9:35 a.m.",  title: "Seguros voluntarios, pólizas novedosas de salud y gasto de bolsillo: comportamiento del mercado privado frente a la crisis del sistema público", speaker: "Dr. Fernando Dueñas Castro", role: "Director de la Cámara de Seguros de Salud – Fasecolda", tag: "seguros voluntarios y gasto de bolsillo" },
    { n: 4,  day: "Jueves 10 de septiembre", time: "9:35 a.m. – 10:10 a.m.", title: "La nueva caja de herramientas del IETS 2026–2030: soluciones para un mejor sistema de salud", speaker: "Dra. Adriana María Robayo", role: "Directora Ejecutiva del Instituto de Evaluación Tecnológica en Salud (IETS)", tag: "nueva caja de herramientas del IETS" },
    { n: 5,  day: "Jueves 10 de septiembre", time: "10:40 a.m. – 11:20 a.m.", title: "Carga de enfermedad en Colombia 2026: transición epidemiológica, alertas activas y brechas territoriales", speaker: "Dra. Zulma Cucunubá", role: "Directora Instituto Nacional de Salud", tag: "carga de enfermedad en Colombia 2026" },
    { n: 6,  day: "Jueves 10 de septiembre", time: "11:20 a.m. – 11:55 a.m.", title: "Colombia ante una nueva etapa sanitaria: cooperación, capacidades y transformación del sistema de salud", speaker: "Dr. Ricardo Fábrega", role: "Asesor internacional de sistemas y servicios de salud, OPS/OMS Colombia", tag: "una nueva etapa sanitaria" },
    { n: 7,  day: "Jueves 10 de septiembre", time: "11:55 a.m. – 12:30 p.m.", title: "Agenda regulatoria 2026–2030: medicamentos, dispositivos médicos y acceso bajo el nuevo gobierno", speaker: "Dra. Sindy Pahola Pulgarín", role: "Directora INVIMA", tag: "agenda regulatoria de medicamentos y dispositivos" },
    { n: 8,  day: "Jueves 10 de septiembre", time: "2:00 p.m. – 2:40 p.m.",  title: "Flujo de recursos y riesgo sistémico en salud: fuentes, cartera, reclamaciones, embargos y soluciones para recuperar la operación del sistema", speaker: "Dr. Jesús Albrey González Páez", role: "Gerente General, González Páez Abogados", tag: "flujo de recursos y riesgo sistémico" },
    { n: 9,  day: "Jueves 10 de septiembre", time: "2:40 p.m. – 3:10 p.m.",  title: "Instituciones de la salud aumentadas por IA: capacidades cognitivas y agentes inteligentes para transformar la gestión y la atención", speaker: "Dr. Luis Eduardo Pino Villareal", role: "Fundador y CEO OxLER", tag: "instituciones de salud aumentadas por IA" },
    { n: 10, day: "Jueves 10 de septiembre", time: "3:10 p.m. – 3:40 p.m.",  title: "Plan de Desarrollo o decretos: límites jurídicos y el impacto de la transformación 2026–2030 en actores y usuarios del sistema", speaker: "Dr. Julio Mario Orozco Africano", role: "Gerente General, Orozco Jervis Consultoría SAS", tag: "límites jurídicos del Plan de Desarrollo" },
    { n: 11, day: "Jueves 10 de septiembre", time: "4:10 p.m. – 4:40 p.m.",  title: "Auditoría forense de la UPC: detección de riesgos, recuperación de recursos y sostenibilidad", speaker: "Dr. Simón Guzmán Guerrero", role: "Socio Fundador, SAG Assessment & Consulting SAS", tag: "auditoría forense de la UPC" },
    { n: 12, day: "Jueves 10 de septiembre", time: "4:40 p.m. – 5:10 p.m.",  title: "La agenda legislativa del sector salud en el Congreso de la República: prioridades, posibilidades y plazos", speaker: "Dr. Andrés Forero", role: "Presidente de la Comisión VII del Senado de la República", tag: "agenda legislativa del sector salud" },
    { n: 13, day: "Viernes 11 de septiembre", time: "8:00 a.m. – 8:50 a.m.",  title: "Nueva EPS: diagnóstico, prioridades y ruta de estabilización", speaker: "Dr. Roberto Solano Navarra", role: "Agente Interventor Nueva EPS", tag: "diagnóstico y ruta de estabilización de Nueva EPS" },
    { n: 14, day: "Viernes 11 de septiembre", time: "8:50 a.m. – 9:15 a.m.",  title: "Costos, tarifas y precios regulados 2027: decisiones que determinarán el equilibrio financiero entre pagadores y prestadores", speaker: "Dr. Julio César Benedetti", role: "Consultor y asesor en salud", tag: "costos, tarifas y precios regulados" },
    { n: 15, day: "Viernes 11 de septiembre", time: "9:15 a.m. – 9:50 a.m.",  title: "Salud y Desarrollo: la ecuación económica que Colombia debe resolver — recursos, eficiencia, productividad y decisiones para 2026–2030", speaker: "Dra. Marcela Meléndez", role: "Directora ejecutiva de Fedesarrollo", tag: "la ecuación económica que Colombia debe resolver" },
    { n: 16, day: "Viernes 11 de septiembre", time: "9:50 a.m. – 10:20 a.m.", title: "Nueva EPS bajo vigilancia: hallazgos, protección de los recursos y medidas para recuperar la atención", speaker: "Dra. Mónica Andrea Ulloa Ruiz", role: "Procuradora delegada para Asuntos de la Salud, Procuraduría General de la Nación", tag: "Nueva EPS bajo vigilancia" },
    { n: 17, day: "Viernes 11 de septiembre", time: "10:50 a.m. – 11:25 a.m.", title: "IA generativa para la gestión sanitaria: herramientas concretas, casos de uso y decisiones de implementación", speaker: "Dra. Jacqueline Jaimes T.", role: "Gerente General de Qualico SAS", tag: "IA generativa para la gestión sanitaria" },
    { n: 18, day: "Viernes 11 de septiembre", time: "11:25 a.m. – 12:00 p.m.", title: "Compra directa de medicamentos desde el aseguramiento: modelos y resultados en eficiencia, ahorro y acceso", speaker: "Dra. Juvenny Organista Cardona", role: "Médica y experta en medicamentos", tag: "compra directa de medicamentos" },
    { n: 19, day: "Viernes 11 de septiembre", time: "12:00 p.m. – 12:35 p.m.", title: "Seguridad hospitalaria frente al riesgo sísmico: qué revisar hoy, qué exige la norma y qué decisiones tomar para proteger la operación", speaker: "Arq. Amedeo Vita · Ing. Javier Mora Daza", role: "Asociación Colombiana de Arquitectos e Ingenieros Hospitalarios (ACAIH)", tag: "seguridad hospitalaria frente al riesgo sísmico" },
    { n: 20, day: "Viernes 11 de septiembre", time: "2:00 p.m. – 2:40 p.m.",  title: "ADRES 2026–2030: flujo oportuno, trazabilidad y confianza en los recursos de la salud", speaker: "Dr. Iván Sánchez Arango", role: "Director General de la ADRES", tag: "ADRES: flujo oportuno y trazabilidad" },
    { n: 21, day: "Viernes 11 de septiembre", time: "2:40 p.m. – 3:20 p.m.",  title: "Hospitales y clínicas como actores de transformación: la agenda para la prestación de servicios de salud 2026–2030", speaker: "Dr. Juan Carlos Giraldo", role: "Director general de la Asociación Colombiana de Hospitales y Clínicas (ACHC)", tag: "hospitales y clínicas como actores de transformación" },
    { n: 22, day: "Viernes 11 de septiembre", time: "3:20 p.m. – 4:20 p.m.",  title: "Modelación contractual avanzada para IPS 2027: costos, notas técnicas y gestión de contratos prospectivos", speaker: "Ing. Andrés Fabián Jiménez T.", role: "Especialista en inteligencia financiera hospitalaria, Synergia C&G", tag: "modelación contractual avanzada para IPS" },
  ],

  // ------------------------------------------------------------------
  // Changelog — historial real de publicación (fechas de los commits
  // del repositorio), más reciente primero.
  // ------------------------------------------------------------------
  changelog: [
    { date: "2026-09-15", summary: "Navegación por índice lateral, buscador en vivo, atajos de teclado, modo de lectura enfocada, etiquetas de confiabilidad de datos, panel de fuentes, exportación a Markdown/PDF y mejoras de accesibilidad (WCAG AA)." },
    { date: "2026-09-15", summary: "Mapa mental interactivo y plantilla descargable en Word para notas técnicas de proveedor a EPS, anidados con la sesión 22 (taller de notas técnicas)." },
    { date: "2026-09-15", summary: "Nota técnica sobre la brecha entre intervención e implementación a nivel de IPS, con opciones de cierre y marco de resultados de implementación." },
    { date: "2026-09-15", summary: "Diagnóstico causal (bucles R1/B1), recomendaciones, lagunas de evidencia y avatares de ponentes (fotos oficiales para funcionarios públicos, iniciales para el resto)." },
    { date: "2026-09-15", summary: "Publicación inicial: explorador interactivo del XXI Congreso Nacional de Salud 2026 (ejes temáticos, cifras clave, agenda completa, metodología)." },
  ],

  methodology: {
    note: "Este artículo se elaboró a partir de la agenda oficial del XXI Congreso Nacional de Salud, anotaciones propias del autor durante las sesiones del 10 y 11 de septiembre de 2026, y la cobertura publicada por Consultorsalud en consultorsalud.com, contrastando cifras entre fuentes. No se incluyó ningún dato que no pudiera verificarse en estas fuentes.",
    sources: [
      { label: "Agenda oficial del XXI Congreso Nacional de Salud (Consultorsalud, PDF).", url: null },
      { label: "Anotaciones del autor durante las conferencias del 10 y 11 de septiembre de 2026.", url: null },
      { label: "Consultorsalud. \"XXI Congreso Nacional de Salud: las decisiones que marcarán el sistema entre 2026 y 2030\".", url: "https://consultorsalud.com/xxi-congreso-nacional-de-salud/" },
      { label: "Consultorsalud. \"XXI Congreso de Salud 2026: claves del segundo día\".", url: "https://consultorsalud.com/xxi-congreso-nacional-salud-2026-segundo-dia/" },
      { label: "Consultorsalud. \"XXI Congreso Nacional de Salud supera las 500 reservas tras el cierre exitoso de preventa\".", url: "https://consultorsalud.com/xxi-congreso-nacional-salud-500-cupos/" },
    ],
    limitations: [
      "Las cifras citadas son las declaradas verbalmente por cada ponente en el escenario (o en sus diapositivas), a partir de anotaciones propias del autor no verificadas por un tercero — no son, en general, auditorías externas independientes ni series de datos públicas descargables.",
      "El congreso tuvo una agenda amplia (22 sesiones); esta síntesis priorizó los puntos que, a juicio del autor, más conectaban con la intersección entre industria, evidencia y sistema de salud — no es un resumen exhaustivo de cada sesión.",
      "Los ejes temáticos (financiamiento, tarifas, regulación, epidemiología, prestadores/IA) son una clasificación editorial propia del autor para facilitar la lectura, no una categorización oficial del congreso.",
      "\"Mi lectura\" es una interpretación y opinión personal del autor, no una conclusión del congreso ni una posición de Consultorsalud o de los ponentes citados.",
      "Las fotos de ponentes son retratos oficiales tomados únicamente del sitio institucional propio de cada funcionario público (fuente citada al pasar el cursor sobre cada foto); los ponentes del sector privado y los funcionarios sin retrato oficial disponible se muestran con iniciales, nunca con fotos de redes sociales o prensa de terceros.",
    ]
  },

  // ------------------------------------------------------------------
  // Fotos de ponentes — solo retratos oficiales publicados en el sitio
  // institucional propio de cada funcionario público (.gov.co / entidad
  // oficial), usados con atribución (ver el atributo "title" al pasar
  // el cursor sobre cada foto). Los ponentes del sector privado, y los
  // funcionarios públicos sin retrato disponible en su propio sitio
  // institucional, se muestran con iniciales — nunca con una foto de
  // menor confianza (redes sociales, prensa, terceros).
  // Clave: nombre exacto tal como aparece en agenda[].speaker.
  // ------------------------------------------------------------------
  speakerPhotos: {
    "Dra. Zulma Cucunubá": {
      src: "img/speakers/cucunuba.jpeg",
      sourceLabel: "Instituto Nacional de Salud — ins.gov.co/conocenos/directivos",
      sourceUrl: "https://www.ins.gov.co/conocenos/directivos"
    },
    "Dra. Sindy Pahola Pulgarín": {
      src: "img/speakers/pulgarin.webp",
      sourceLabel: "INVIMA — invima.gov.co/el-instituto/quienes-somos",
      sourceUrl: "https://www.invima.gov.co/el-instituto/quienes-somos"
    },
    "Dra. Adriana María Robayo": {
      src: "img/speakers/robayo.jpeg",
      sourceLabel: "IETS — iets.org.co/nosotros/nuestro-equipo",
      sourceUrl: "https://www.iets.org.co/nosotros/nuestro-equipo/"
    },
    "Dr. Iván Sánchez Arango": {
      src: "img/speakers/sanchez-arango.jpg",
      sourceLabel: "ADRES — adres.gov.co/nuestra-entidad/talento-humano/equipo-directivo",
      sourceUrl: "https://www.adres.gov.co/nuestra-entidad/talento-humano/equipo-directivo"
    },
    "Dr. Andrés Forero": {
      src: "img/speakers/forero.jpeg",
      sourceLabel: "Cámara de Representantes — camara.gov.co (perfil oficial previo a su llegada al Senado)",
      sourceUrl: "https://www.camara.gov.co/representantes/andres-eduardo-forero-molina/"
    },
  },
};
