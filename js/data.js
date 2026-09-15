/* ============================================================
   Datos de la aplicación — XXI Congreso Nacional de Salud 2026
   Contenido derivado de un artículo de LinkedIn de autoría propia,
   basado en la agenda oficial del congreso, transcripciones propias
   de las sesiones grabadas (10–11 sept. 2026) y la cobertura
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
    framework: "Síntesis de congreso · agenda oficial + transcripción propia de las sesiones",
    disclaimer: "Esta aplicación sintetiza un artículo de LinkedIn de autoría propia sobre el XXI Congreso Nacional de Salud (Bogotá, 10–11 de septiembre de 2026), organizado por Consultorsalud. Las cifras y citas provienen de la agenda oficial del congreso, de transcripciones propias de las sesiones grabadas y de la cobertura publicada por Consultorsalud (consultorsalud.com); la selección de ejes temáticos, la lectura final y las opiniones son responsabilidad del autor, no de los ponentes citados ni del organizador del evento.",
    license: {
      name: "Creative Commons Atribución 4.0 Internacional (CC BY 4.0)",
      url: "https://creativecommons.org/licenses/by/4.0/deed.es",
      text: "Este contenido puede compartirse y adaptarse libremente, incluso con fines comerciales, siempre citando al autor."
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
        { text: "Jacqueline Jaimes (Qualico) mostró casos de uso concretos de IA generativa para la gestión sanitaria: la discusión ya no es si adoptar IA, sino qué decisiones de implementación tomar primero.", studies: [20] },
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
      sourceUrl: null
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
      sourceUrl: null
    },
  ],

  // ------------------------------------------------------------------
  // Cifras clave adicionales — un solo punto verificado cada una,
  // agrupadas por eje temático. Todas declaradas en el escenario por
  // el ponente citado; no se dispone de URL pública individual.
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
  // Mi lectura — síntesis y reflexión propia del autor
  // ------------------------------------------------------------------
  reading: {
    text: "Lo que más resuena, desde la óptica de acceso y valor, es que casi todas las conversaciones —tarifas, UPC, compra de medicamentos, evaluación de tecnologías, IA— terminan en el mismo punto: la necesidad de decisiones basadas en costos reales y evidencia, no en inercias históricas. Si 2026–2027 es el momento en que se redefinen esas reglas, quienes trabajamos en la intersección entre industria, evidencia y sistema de salud tenemos mucho que aportar a esa conversación.",
    prompt: "¿Qué sesión les hubiera gustado ver comentada con más detalle? Con gusto profundizo en los comentarios."
  },

  // ------------------------------------------------------------------
  // Agenda completa (22 sesiones, 2 jornadas)
  // ------------------------------------------------------------------
  agenda: [
    { n: 1,  day: "Jueves 10 de septiembre", time: "8:00 a.m. – 8:15 a.m.",  title: "Mensaje de la Ministra al XXI Congreso Nacional de Salud", speaker: "Dra. Ana María Vesga", role: "Ministra de Salud y Protección Social" },
    { n: 2,  day: "Jueves 10 de septiembre", time: "8:15 a.m. – 9:00 a.m.",  title: "Decisiones sectoriales 2026–2027: variables críticas de vigilancia para prestadores, aseguradores e industria", speaker: "Dr. Carlos Felipe Muñoz", role: "CEO Consultorsalud" },
    { n: 3,  day: "Jueves 10 de septiembre", time: "9:00 a.m. – 9:35 a.m.",  title: "Seguros voluntarios, pólizas novedosas de salud y gasto de bolsillo: comportamiento del mercado privado frente a la crisis del sistema público", speaker: "Dr. Fernando Dueñas Castro", role: "Director de la Cámara de Seguros de Salud – Fasecolda" },
    { n: 4,  day: "Jueves 10 de septiembre", time: "9:35 a.m. – 10:10 a.m.", title: "La nueva caja de herramientas del IETS 2026–2030: soluciones para un mejor sistema de salud", speaker: "Dra. Adriana María Robayo", role: "Directora Ejecutiva del Instituto de Evaluación Tecnológica en Salud (IETS)" },
    { n: 5,  day: "Jueves 10 de septiembre", time: "10:40 a.m. – 11:20 a.m.", title: "Carga de enfermedad en Colombia 2026: transición epidemiológica, alertas activas y brechas territoriales", speaker: "Dra. Zulma Cucunubá", role: "Directora Instituto Nacional de Salud" },
    { n: 6,  day: "Jueves 10 de septiembre", time: "11:20 a.m. – 11:55 a.m.", title: "Colombia ante una nueva etapa sanitaria: cooperación, capacidades y transformación del sistema de salud", speaker: "Dr. Ricardo Fábrega", role: "Asesor internacional de sistemas y servicios de salud, OPS/OMS Colombia" },
    { n: 7,  day: "Jueves 10 de septiembre", time: "11:55 a.m. – 12:30 p.m.", title: "Agenda regulatoria 2026–2030: medicamentos, dispositivos médicos y acceso bajo el nuevo gobierno", speaker: "Dra. Sindy Pahola Pulgarín", role: "Directora INVIMA" },
    { n: 8,  day: "Jueves 10 de septiembre", time: "2:00 p.m. – 2:40 p.m.",  title: "Flujo de recursos y riesgo sistémico en salud: fuentes, cartera, reclamaciones, embargos y soluciones para recuperar la operación del sistema", speaker: "Dr. Jesús Albrey González Páez", role: "Gerente General, González Páez Abogados" },
    { n: 9,  day: "Jueves 10 de septiembre", time: "2:40 p.m. – 3:10 p.m.",  title: "Instituciones de la salud aumentadas por IA: capacidades cognitivas y agentes inteligentes para transformar la gestión y la atención", speaker: "Dr. Luis Eduardo Pino Villareal", role: "Fundador y CEO OxLER" },
    { n: 10, day: "Jueves 10 de septiembre", time: "3:10 p.m. – 3:40 p.m.",  title: "Plan de Desarrollo o decretos: límites jurídicos y el impacto de la transformación 2026–2030 en actores y usuarios del sistema", speaker: "Dr. Julio Mario Orozco Africano", role: "Gerente General, Orozco Jervis Consultoría SAS" },
    { n: 11, day: "Jueves 10 de septiembre", time: "4:10 p.m. – 4:40 p.m.",  title: "Auditoría forense de la UPC: detección de riesgos, recuperación de recursos y sostenibilidad", speaker: "Dr. Simón Guzmán Guerrero", role: "Socio Fundador, SAG Assessment & Consulting SAS" },
    { n: 12, day: "Jueves 10 de septiembre", time: "4:40 p.m. – 5:10 p.m.",  title: "La agenda legislativa del sector salud en el Congreso de la República: prioridades, posibilidades y plazos", speaker: "Dr. Andrés Forero", role: "Presidente de la Comisión VII del Senado de la República" },
    { n: 13, day: "Viernes 11 de septiembre", time: "8:00 a.m. – 8:50 a.m.",  title: "Nueva EPS: diagnóstico, prioridades y ruta de estabilización", speaker: "Dr. Roberto Solano Navarra", role: "Agente Interventor Nueva EPS" },
    { n: 14, day: "Viernes 11 de septiembre", time: "8:50 a.m. – 9:15 a.m.",  title: "Costos, tarifas y precios regulados 2027: decisiones que determinarán el equilibrio financiero entre pagadores y prestadores", speaker: "Dr. Julio César Benedetti", role: "Consultor y asesor en salud" },
    { n: 15, day: "Viernes 11 de septiembre", time: "9:15 a.m. – 9:50 a.m.",  title: "Salud y Desarrollo: la ecuación económica que Colombia debe resolver — recursos, eficiencia, productividad y decisiones para 2026–2030", speaker: "Dra. Marcela Meléndez", role: "Directora ejecutiva de Fedesarrollo" },
    { n: 16, day: "Viernes 11 de septiembre", time: "9:50 a.m. – 10:20 a.m.", title: "Nueva EPS bajo vigilancia: hallazgos, protección de los recursos y medidas para recuperar la atención", speaker: "Dra. Mónica Andrea Ulloa Ruiz", role: "Procuradora delegada para Asuntos de la Salud, Procuraduría General de la Nación" },
    { n: 17, day: "Viernes 11 de septiembre", time: "10:50 a.m. – 11:25 a.m.", title: "IA generativa para la gestión sanitaria: herramientas concretas, casos de uso y decisiones de implementación", speaker: "Dra. Jacqueline Jaimes T.", role: "Gerente General de Qualico SAS" },
    { n: 18, day: "Viernes 11 de septiembre", time: "11:25 a.m. – 12:00 p.m.", title: "Compra directa de medicamentos desde el aseguramiento: modelos y resultados en eficiencia, ahorro y acceso", speaker: "Dra. Juvenny Organista Cardona", role: "Médica y experta en medicamentos" },
    { n: 19, day: "Viernes 11 de septiembre", time: "12:00 p.m. – 12:35 p.m.", title: "Seguridad hospitalaria frente al riesgo sísmico: qué revisar hoy, qué exige la norma y qué decisiones tomar para proteger la operación", speaker: "Arq. Amedeo Vita · Ing. Javier Mora Daza", role: "Asociación Colombiana de Arquitectos e Ingenieros Hospitalarios (ACAIH)" },
    { n: 20, day: "Viernes 11 de septiembre", time: "2:00 p.m. – 2:40 p.m.",  title: "ADRES 2026–2030: flujo oportuno, trazabilidad y confianza en los recursos de la salud", speaker: "Dr. Iván Sánchez Arango", role: "Director General de la ADRES" },
    { n: 21, day: "Viernes 11 de septiembre", time: "2:40 p.m. – 3:20 p.m.",  title: "Hospitales y clínicas como actores de transformación: la agenda para la prestación de servicios de salud 2026–2030", speaker: "Dr. Juan Carlos Giraldo", role: "Director general de la Asociación Colombiana de Hospitales y Clínicas (ACHC)" },
    { n: 22, day: "Viernes 11 de septiembre", time: "3:20 p.m. – 4:20 p.m.",  title: "Modelación contractual avanzada para IPS 2027: costos, notas técnicas y gestión de contratos prospectivos", speaker: "Ing. Andrés Fabián Jiménez T.", role: "Especialista en inteligencia financiera hospitalaria, Synergia C&G" },
  ],

  methodology: {
    note: "Este artículo se elaboró a partir de la agenda oficial del XXI Congreso Nacional de Salud, las grabaciones propias de las sesiones del 10 y 11 de septiembre de 2026, y la cobertura publicada por Consultorsalud en consultorsalud.com, contrastando cifras entre fuentes. No se incluyó ningún dato que no pudiera verificarse en estas fuentes.",
    sources: [
      { label: "Agenda oficial del XXI Congreso Nacional de Salud (Consultorsalud, PDF).", url: null },
      { label: "Grabaciones de audio de las sesiones del 10 y 11 de septiembre de 2026 (transcripciones propias del autor).", url: null },
      { label: "Consultorsalud. \"XXI Congreso Nacional de Salud: las decisiones que marcarán el sistema entre 2026 y 2030\".", url: "https://consultorsalud.com/xxi-congreso-nacional-de-salud/" },
      { label: "Consultorsalud. \"XXI Congreso de Salud 2026: claves del segundo día\".", url: "https://consultorsalud.com/xxi-congreso-nacional-salud-2026-segundo-dia/" },
      { label: "Consultorsalud. \"XXI Congreso Nacional de Salud supera las 500 reservas tras el cierre exitoso de preventa\".", url: "https://consultorsalud.com/xxi-congreso-nacional-salud-500-cupos/" },
    ],
    limitations: [
      "Las cifras citadas son las declaradas verbalmente por cada ponente en el escenario (o en sus diapositivas), a partir de transcripciones propias no verificadas por un tercero — no son, en general, auditorías externas independientes ni series de datos públicas descargables.",
      "El congreso tiene una agenda amplia (22 sesiones); esta síntesis prioriza los puntos que, a juicio del autor, más conectan con la intersección entre industria, evidencia y sistema de salud — no es un resumen exhaustivo de cada sesión.",
      "Los ejes temáticos (financiamiento, tarifas, regulación, epidemiología, prestadores/IA) son una clasificación editorial propia del autor para facilitar la lectura, no una categorización oficial del congreso.",
      "\"Mi lectura\" es una interpretación y opinión personal del autor, no una conclusión del congreso ni una posición de Consultorsalud o de los ponentes citados.",
    ]
  }
};
