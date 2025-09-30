// Índice global de búsqueda para toda la app
// Cada entrada representa un recurso, sección, concepto o página principal

const searchIndex = [
  // Páginas principales
  {
    title: "Inicio",
    type: "página",
    description: "Landing principal de Mundo Verde",
    action: { route: "/" }
  },
  {
    title: "Calculadora de Huella de Carbono",
    type: "página",
    description: "Herramienta para calcular y gestionar emisiones de carbono.",
    action: { route: "/calculadora" }
  },
  {
    title: "Autogestión de Sostenibilidad",
    type: "página",
    description: "Autodiagnóstico, instructivo y descargas para gestión ambiental.",
    action: { route: "/autogestion" }
  },
  {
    title: "Documentos y Herramientas",
    type: "página",
    description: "Repositorio de documentos y herramientas ambientales.",
    action: { route: "/documentos" }
  },
  {
    title: "Conceptos Claves",
    type: "página",
    description: "Información sobre huella de carbono y sostenibilidad.",
    action: { route: "/huella-carbono" }
  },

  // Secciones internas (ejemplo para autogestión)
  {
    title: "Instructivo para Autogestión",
    type: "sección",
    description: "Guía paso a paso para diligenciar el autodiagnóstico.",
    action: { route: "/autogestion", sectionId: "autogestion-instructivo" }
  },
  {
    title: "Formulario de Autogestión",
    type: "sección",
    description: "Formulario interactivo para autodiagnóstico ambiental.",
    action: { route: "/autogestion", sectionId: "autogestion-formulario" }
  },
  {
    title: "Descargas de Autogestión",
    type: "sección",
    description: "Descarga los formatos y cuestionarios en Excel.",
    action: { route: "/autogestion", sectionId: "autogestion-descargas" }
  },

  // Documentos y descargas (Autogestión)
  {
    title: "Autodiagnóstico SuperSociedades (Excel)",
    type: "descarga",
    description: "Herramienta para autodiagnóstico integral de sostenibilidad.",
    action: { download: "/Autodiagnostico_docs/1. Autodiagnóstico de sostenibilidad SuperSociedades - GRI.xlsx" }
  },
  {
    title: "Cuestionario de Sostenibilidad (Excel)",
    type: "descarga",
    description: "Cuestionario para recopilar información sobre prácticas sostenibles.",
    action: { download: "/Autodiagnostico_docs/2. Cuestionario de Sostenibilidad Organizaciones.xls" }
  },
  {
    title: "Instructivo para diligenciar Autodiagnóstico (PDF)",
    type: "documento",
    description: "Guía PDF para completar el autodiagnóstico de sostenibilidad.",
    action: { download: "/Autodiagnostico_docs/1.Instructivo_para_diligenciar_Autodiagnostico_de_Sostenibilidad.pdf" }
  },

  // Documentos y descargas (DocumentosPage)
  // Categoría 1: Revisión Inicial Ambiental - RIA
  {
    title: "Herramientas de Sostenibilidad y PML (PDF)",
    type: "documento",
    description: "Manual y guía de herramientas para la gestión sostenible y Producción Más Limpia.",
    category: "Revisión Inicial Ambiental - RIA",
    action: { route: "/documentos", sectionId: "cat-0", docId: "1.Herramientas_de_Sostenibilidad_y_PML.pdf" }
  },
  {
    title: "Formato RIA (Excel)",
    type: "descarga",
    description: "Plantilla editable para diligenciar el RIA.",
    category: "Revisión Inicial Ambiental - RIA",
    action: { route: "/documentos", sectionId: "cat-0", docId: "Formato_RIA.xlsx" }
  },

  // Categoría 2: Ciclo de Vida
  {
    title: "El Contexto del Análisis del Ciclo de Vida (PDF)",
    type: "documento",
    description: "Documento sobre el contexto y la importancia del análisis del ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "1.EL_contexto_del_analisis_del_ciclo_de_vida.pdf" }
  },
  {
    title: "Ejercicio Ciclo de Vida (PDF)",
    type: "documento",
    description: "Ejercicio práctico sobre el análisis del ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "1.1Ejercicio_Ciclo_de_vida.pdf" }
  },
  {
    title: "Metodología del Análisis del Ciclo de Vida (PDF)",
    type: "documento",
    description: "Metodología detallada para el análisis del ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "2.Metodologia_del_análisis_del_ciclo_de_vida.pdf" }
  },
  {
    title: "Ejercicio Análisis Ciclo de Vida (PDF)",
    type: "documento",
    description: "Ejercicio de análisis aplicado al ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "2.1Ejercicio_analisis_ciclo_de_vida.pdf" }
  },
  {
    title: "Datos Usados en el Análisis de Ciclo de Vida (PDF)",
    type: "documento",
    description: "Datos empleados en el análisis de ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "3.Datos_Usados_en_el_analisis_de_ciclo_de_vida.pdf" }
  },
  {
    title: "Ejercicio Datos Usados en el Análisis de Ciclo de Vida (PDF)",
    type: "documento",
    description: "Ejercicio sobre los datos utilizados en el análisis de ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "3.1Ejercicio_Datos_Usados_en_el_analisis_de_ciclo_de_vida.pdf" }
  },
  {
    title: "Conceptos Clave del Ciclo de Vida de un Producto (PDF)",
    type: "documento",
    description: "Conceptos fundamentales sobre el ciclo de vida de un producto.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "4.Conceptos_clave_del_ciclo_de_vida_un_producto.pdf" }
  },
  {
    title: "Guía Herramienta Ciclo de Vida (PDF)",
    type: "documento",
    description: "Guía para el uso de la herramienta de ciclo de vida.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "5.Guia_herramienta_ciclo_de_vida.pdf" }
  },
  {
    title: "Ciclo de Vida - Proceso Productivo (Excel)",
    type: "descarga",
    description: "Plantilla Excel para el análisis de ciclo de vida de un proceso productivo.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "ciclo_de_vida_Proceso_Productivo.xlsx" }
  },
  {
    title: "Ciclo de Vida - Producto o Servicio Específico (Excel)",
    type: "descarga",
    description: "Plantilla Excel para el análisis de ciclo de vida de un producto o servicio.",
    category: "Ciclo de Vida",
    action: { route: "/documentos", sectionId: "cat-1", docId: "Ciclo_de_vida_Producto_o_Servico_especifico.xlsx" }
  },

  // Conceptos clave (ejemplo)
  {
    title: "¿Qué es la Huella de Carbono?",
    type: "concepto",
    description: "Definición y fundamentos de la huella de carbono.",
    action: { route: "/calculadora", sectionId: "conceptos-basicos-content" }
  },
  {
    title: "Factores de Emisión para Colombia",
    type: "concepto",
    description: "Valores oficiales y metodologías para calcular emisiones.",
    action: { route: "/calculadora", sectionId: "factores-emision" }
  },
  // ...agregar más recursos, secciones y conceptos relevantes
    // Secciones y documentos de Huella de Carbono
    {
      title: "Conceptos Claves - Huella de Carbono",
      type: "sección",
      description: "Introducción y conceptos básicos sobre huella de carbono.",
      action: { route: "/huella-carbono", sectionId: "conceptos-basicos" }
    },
    {
      title: "Problemas Medio Ambientales",
      type: "sección",
      description: "Principales desafíos ambientales y su impacto.",
      action: { route: "/huella-carbono", sectionId: "problemas-ambientales" }
    },
    {
      title: "Guía para Elaborar Reportes de Sostenibilidad",
      type: "sección",
      description: "Cómo comunicar el desempeño ambiental y social.",
      action: { route: "/huella-carbono", sectionId: "guia-reportes-sostenibilidad" }
    },
    {
      title: "Componentes Sociambientales de una Organización",
      type: "sección",
      description: "Elementos sociales y ambientales en la gestión sostenible.",
      action: { route: "/huella-carbono", sectionId: "componentes-socioambientales" }
    },
    {
      title: "Amenazas, Impactos y Aspectos Ambientales",
      type: "sección",
      description: "Identificación y gestión de riesgos ambientales.",
      action: { route: "/huella-carbono", sectionId: "amenazas-impactos-aspectos" }
    },
    {
      title: "Acciones para el Consumo Responsable",
      type: "sección",
      description: "Hábitos y estrategias para reducir la huella de carbono.",
      action: { route: "/huella-carbono", sectionId: "consumo-responsable" }
    },
    {
      title: "Uso Eficiente y Ahorro de Agua",
      type: "sección",
      description: "Prácticas para optimizar el uso del agua.",
      action: { route: "/huella-carbono", sectionId: "uso-agua" }
    },
    {
      title: "Uso Eficiente y Ahorro de Energía",
      type: "sección",
      description: "Estrategias para optimizar el consumo energético.",
      action: { route: "/huella-carbono", sectionId: "uso-energia" }
    },
    {
      title: "Información Web y Recursos de Referencia",
      type: "sección",
      description: "Fuentes oficiales y herramientas sobre sostenibilidad.",
      action: { route: "/huella-carbono", sectionId: "informacion-web" }
    },
    // Documentos PDF de Huella de Carbono
    {
      title: "Los Problemas Medio Ambientales (PDF)",
      type: "documento",
      description: "Documento introductorio sobre problemas ambientales.",
      action: { route: "/huella-carbono", sectionId: "problemas-ambientales", docId: "1.Los_Problemas_medio_ambientales.pdf" }
    },
    {
      title: "Guía para Elaborar Reportes de Sostenibilidad (PDF)",
      type: "documento",
      description: "Manual práctico para reportes de sostenibilidad.",
      action: { route: "/huella-carbono", sectionId: "guia-reportes-sostenibilidad", docId: "2.Guia_para_elaborar_el_reporte_de_Sostenibilidad.pdf" }
    },
    {
      title: "Componentes Sociambientales (PDF)",
      type: "documento",
      description: "Marco conceptual sobre gestión sociambiental.",
      action: { route: "/huella-carbono", sectionId: "componentes-socioambientales", docId: "3.Componentes_sociambientales_de_una_organización.pdf" }
    },
    {
      title: "Amenazas, Impactos y Aspectos Ambientales (PDF)",
      type: "documento",
      description: "Guía para identificar y evaluar amenazas ambientales.",
      action: { route: "/huella-carbono", sectionId: "amenazas-impactos-aspectos", docId: "4.Amenazas_impactos_y_aspectos_ambientales.pdf" }
    },
    {
      title: "Acciones de Consumo Responsable (PDF)",
      type: "documento",
      description: "Estrategias para consumo responsable.",
      action: { route: "/huella-carbono", sectionId: "consumo-responsable", docId: "5.Acciones_consumo_responsable.pdf" }
    },
    {
      title: "Uso Eficiente y Ahorro de Agua (PDF)",
      type: "documento",
      description: "Guía práctica para optimizar el uso del agua.",
      action: { route: "/huella-carbono", sectionId: "uso-agua", docId: "6.Uso_eficiente_y_ahorro_de_agua.pdf" }
    },
    {
      title: "Uso Eficiente y Ahorro de Energía (PDF)",
      type: "documento",
      description: "Recomendaciones para optimizar el consumo energético.",
      action: { route: "/huella-carbono", sectionId: "uso-energia", docId: "7.Uso_eficiente_y_ahorro_de_energia.pdf" }
    },
];

export default searchIndex;
