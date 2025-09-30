import React, { useState, useMemo } from 'react';
import './FormularioAutogestion.css';
import ResumenGlobal from './ResumenGlobal';

import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';

// Utilidades de cálculo
function selectionToScore(selection) {
  switch (selection) {
    case 'IMP': return 3;
    case 'M': return 2;
    case 'AC': return 1;
    case 'NA': return 0;
    default: return null;
  }
}

function averageIgnoringZeros(values) {
  const nums = values.filter(v => typeof v === 'number' && v > 0);
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function excelStyleFinalPercent(groupAverages, n) {
  const numericGroups = groupAverages.map(g => (typeof g === 'number' ? g : 0));
  const sum = numericGroups.reduce((a,b) => a + b, 0);
  const step1 = sum / n;
  const step2 = (step1 * 100) / n;
  return step2;
}

// Esquema de la sección A
const sectionA = {
  id: 'A',
  title: 'Diagnóstico Económico',
  finalFormulaDivisor: 7,
  blocks: [
    {
      id: 'A1',
      title: 'A1. Satisfacción de los requerimientos de clientes y mercados',
      questions: [
        { id: 'A_q_1', text: 'La empresa dispone de un portafolio de productos/servicios suficientemente innovadores para mantener o abrir nuevos mercados en el corto, mediano y largo plazo.' },
        { id: 'A_q_2', text: 'La empresa continuamente identifica innovaciones para mejorar sus productos y procesos.' },
        { id: 'A_q_3', text: 'La empresa continuamente identifica nuevas oportunidades de mercado para sus productos.' },
        { id: 'A_q_4', text: 'La empresa siempre entrega el producto/servicio en el tiempo acordado con el cliente.' },
        { id: 'A_q_5', text: 'La calidad del producto/servicio es consistente y de acuerdo a las expectativas del cliente.' },
        { id: 'A_q_6', text: 'La empresa recibe un precio que genera un margen de utilidad razonable y sostenible.' },
        { id: 'A_q_7', text: 'Las ventas están distribuidas entre varios clientes (no existe dependencia de uno o unos clientes específicos).' },
        { id: 'A_q_8', text: 'Las ventas por cliente aumentan cada año.' },
      ]
    },
    {
      id: 'A2',
      title: 'A2. Relación económica con los empleados',
      questions: [
        { id: 'A_q_9', text: 'Las ventas y utilidades por empleado aumentan cada año.' },
        { id: 'A_q_10', text: 'Los empleados reciben un salario y otros incentivos de acuerdo a sus conocimientos, el costo de vida, la cantidad de horas laborales (ej. horas extras) y supera el salario mínimo.' },
      ]
    },
    {
      id: 'A3',
      title: 'A3. Relación económica con proveedores',
      questions: [
        { id: 'A_q_11', text: 'Los productos, tiempo de entrega, el precio, la calidad y el servicio de los proveedores están de acuerdo a las necesidades de la empresa.' },
        { id: 'A_q_12', text: 'La empresa trabaja en conjunto con proveedores para fortalecer relaciones de largo plazo.' },
        { id: 'A_q_13', text: 'La disponibilidad de materia prima está garantizada a corto, mediano y largo plazo.' },
        { id: 'A_q_14', text: 'Los proveedores reciben un precio de acuerdo a la calidad de los productos y/o servicios que ofrecen y a las condiciones del mercado.' },
      ]
    },
    {
      id: 'A4',
      title: 'A4. Satisfacción de los requerimientos de los inversionistas',
      questions: [
        { id: 'A_q_15', text: 'La empresa tiene una estructura financiera óptima.' },
        { id: 'A_q_16', text: 'La utilidad neta de operación aumenta cada año.' },
        { id: 'A_q_17', text: 'La empresa tiene una gestión de cobro adecuada.' },
        { id: 'A_q_18', text: 'La empresa tiene un manejo de inventarios adecuado.' },
        { id: 'A_q_19', text: 'La utilización de la capacidad instalada es adecuada.' },
        { id: 'A_q_20', text: 'La empresa tiene un retorno sobre las inversiones de acuerdo a las condiciones del mercado.' },
      ]
    },
    {
      id: 'A5',
      title: 'A5. Relación económica con la sociedad',
      questions: [
        { id: 'A_q_21', text: 'La empresa realiza inversiones (tiempo y recursos financieros) en el bienestar familiar de sus empleados y de la comunidad donde se encuentra ubicada.' },
        { id: 'A_q_22', text: 'La empresa recibe apoyo de diferentes organizaciones gubernamentales y/o no gubernamentales para lograr sus objetivos económicos, ambientales y sociales.' },
      ]
    },
    {
      id: 'A6',
      title: 'A6. Relación económica de aspectos financieros',
      questions: [
        { id: 'A_q_23', text: '¿La empresa y/o organización tiene activos suficientes para respaldar los créditos adquiridos en caso de riesgo ambiental?' },
        { id: 'A_q_24', text: 'La empresa y/o organización incluyen los aspectos ambientales en los procesos financieros mediante técnicas-económicas-financiero.' },
        { id: 'A_q_25', text: 'Tiene en cuenta las variables ambientales dentro de los riesgos financieros de la empresa y/o organización.' },
      ]
    },
    {
      id: 'A7',
      title: 'A7. Relación interna de procesos administrativos ambientales',
      questions: [
        { id: 'A_q_26', text: 'Existen controles administrativos ambiental de la empresa y/o organización en el uso racional de los recursos (compara y uso de papel, energía, agua entre otros).' },
      ]
    },
  ]
};

// Esquema de la sección B
const sectionB = {
  id: 'B',
  title: 'Gestión Ambiental',
  finalFormulaDivisor: 6,
  blocks: [
    {
      id: 'B1',
      title: 'B1. Organización de la gestión ambiental',
      questions: [
        { id: 'B_q_27', text: 'La protección del medio ambiente es un objetivo empresarial importante y cuenta con el apoyo activo de la alta gerencia.' },
        { id: 'B_q_28', text: 'La empresa ha definido e implementado planes para mejorar su impacto ambiental.' },
        { id: 'B_q_29', text: 'Se mantiene un registro del consumo y salidas de materiales de mayor relevancia y de energía.' },
        { id: 'B_q_30', text: 'Antes de hacer grandes inversiones (Por ejemplo, en nuevas instalaciones, maquinaria o equipos) se investiga el impacto de las mismas en el medio ambiente.' },
        { id: 'B_q_31', text: 'En la empresa se ha logrado asegurar un apoyo amplio para la gestión ambiental a través de grupos de discusión y estructuras establecidas.' },
      ]
    },
    {
      id: 'B2',
      title: 'B2. Protección del medio ambiente a nivel de la producción',
      questions: [
        { id: 'B_q_32', text: 'En la empresa se trata de minimizar el uso de recursos (por ejemplo, materiales, energía, agua, etc.).' },
        { id: 'B_q_33', text: 'Hasta donde sea posible, en la empresa se utiliza energía limpia (generada a través de la energía eólica, energía solar, gas y/o la cogeneración).' },
        { id: 'B_q_34', text: 'Se están tomando medidas concretas para reducir las emisiones al aire (sustancias como dióxido de carbono, dióxido de azufre y óxidos de nitrógeno).' },
        { id: 'B_q_35', text: 'Se están tomando medidas concretas para reducir la cantidad de desechos sólidos, líquidos y gaseosos.' },
        { id: 'B_q_36', text: 'La empresa trata de evitar la generación de desechos tóxicos.' },
        { id: 'B_q_37', text: 'La empresa trata de evitar la generación de aguas residuales.' },
        { id: 'B_q_38', text: 'La empresa trata de optimizar el transporte de materiales, productos intermedios y productos terminados.' },
        { id: 'B_q_39', text: 'La empresa evita hacer negocios con proveedores que no toman en cuenta consideraciones ambientales o que no cumplen las normas ambientales.' },
      ]
    },
    {
      id: 'B3',
      title: 'B3. Desarrollo de productos tomando en cuenta el medio ambiente',
      questions: [
        { id: 'B_q_40', text: 'En el diseño de productos la empresa procura minimizar el uso de materia prima e incluye criterios ecológicos al seleccionarlas.' },
        { id: 'B_q_41', text: 'En el diseño de productos la empresa procura minimizar el uso de materiales de empaque e incluye criterios ecológicos al seleccionarlos.' },
        { id: 'B_q_42', text: 'En el diseño de productos la empresa toma en cuenta aspectos ambientales al definir el proceso para su producción (uso energía, desechos, agua residuales, etc.).' },
        { id: 'B_q_43', text: 'En la empresa se procura diseñar productos que requieran un mínimo de recursos y de energía durante su utilización o consumo.' },
        { id: 'B_q_44', text: 'En la empresa se fomenta el aprovechamiento de los productos al final de su vida útil (por ejemplo, mediante reutilización, procesamiento o reciclaje).' },
      ]
    },
    {
      id: 'B4',
      title: 'B4. Gestión del recurso hídrico, consumo de agua',
      questions: [
        { id: 'B_q_45', text: '¿Se tiene identificada la fuente de agua para consumo humano?' },
        { id: 'B_q_46', text: '¿Se utiliza el agua lluvia en algún proceso?' },
        { id: 'B_q_47', text: '¿Se utilizan las aguas subterráneas?' },
        { id: 'B_q_48', text: '¿Se utiliza agua almacenada en tanques?' },
        { id: 'B_q_49', text: '¿Se tiene tratamiento de purificación para el agua almacenada en tanques?' },
        { id: 'B_q_50', text: '¿Tiene identificados los procesos en que utiliza agua cruda?' },
        { id: 'B_q_51', text: '¿Tiene identificados los procesos en que utiliza agua potable?' },
        { id: 'B_q_52', text: '¿Tiene identificados los procesos en que utiliza agua tratada?' },
        { id: 'B_q_53', text: '¿Se hacen pruebas de laboratorio al agua de consumo?' },
        { id: 'B_q_54', text: '¿El agua de consumo recibe tratamiento?' },
        { id: 'B_q_55', text: '¿Se han reportado casos de afección a la salud humana por la falta de tratamiento de aguas?' },
        { id: 'B_q_56', text: '¿Se tienen cuantificados los costos anuales del tratamiento de aguas?' },
      ]
    },
    {
      id: 'B5',
      title: 'B5. Gestión del recurso hídrico (Aguas residuales)',
      questions: [
        { id: 'B_q_57', text: '¿Se conoce donde se vierten las aguas residuales?' },
        { id: 'B_q_58', text: '¿Existe tratamiento de las aguas residuales?' },
        { id: 'B_q_59', text: '¿Se conoce el tipo de tratamiento que se hace a las aguas residuales?' },
        { id: 'B_q_60', text: '¿Se tiene registro de los costos por tratamiento de las aguas residuales?' },
        { id: 'B_q_61', text: '¿Se conoce y se aplica la legislación relacionada con el manejo de las aguas residuales?' },
        { id: 'B_q_62', text: '¿Existen indicadores de aguas residuales?' },
        { id: 'B_q_63', text: '¿Existen mediciones de los parámetros físicos y químicos de las aguas residuales? (Si la respuesta es afirmativa, anexe los registros)' },
        { id: 'B_q_64', text: 'Reducción del consumo de agua en el proceso productivo' },
        { id: 'B_q_65', text: '¿Se han adecuado equipos para mejorar el rendimiento en el consumo de agua?' },
        { id: 'B_q_66', text: '¿Se han ejecutado acciones para reducir el consumo de agua?' },
        { id: 'B_q_67', text: '¿Existe consumo excesivo de agua en los procesos de producción?' },
        { id: 'B_q_68', text: '¿Se han ejecutado planes de capacitación para mejorar las prácticas de manejo de aguas?' },
        { id: 'B_q_69', text: 'Evitar derrames y excesos para optimizar el consumo de agua' },
        { id: 'B_q_70', text: '¿Se regulan las bombas de agua y las cañerías?' },
        { id: 'B_q_71', text: '¿Tiene instalados instrumentos para la medición del agua?' },
        { id: 'B_q_72', text: 'Fugas que causan goteo' },
        { id: 'B_q_73', text: '¿Realiza inspección en las cañerías para detección de fugas?' },
        { id: 'B_q_74', text: '¿Hace mantenimiento en las cañerías?' },
        { id: 'B_q_75', text: 'Reutilización o recicle del agua' },
        { id: 'B_q_76', text: '¿Se considera la posibilidad de reutilizar por lo menos una fracción del agua de lavado o limpieza?' },
        { id: 'B_q_77', text: '¿Evalúa las posibilidades de reducir o reciclar el agua en otras fases de la producción (p. ej. Reciclando el agua de refrigeración)?' },
        { id: 'B_q_78', text: '¿Considera usted la posibilidad de recolectar agua lluvia y utilizarla?' },
        { id: 'B_q_79', text: 'Reducción del consumo de agua en áreas fuera de producción' },
        { id: 'B_q_80', text: '¿Verifica que todas las llaves estén correctamente cerradas y no presenten fugas?' },
        { id: 'B_q_81', text: '¿Han sido selladas o desmontadas las llaves de agua que son prescindibles?' },
        { id: 'B_q_82', text: '¿Existen campañas que recuerdan la importancia de ahorrar de agua?' },
        { id: 'B_q_83', text: 'Ahorro de agua durante procesos de limpieza' },
        { id: 'B_q_84', text: '¿El personal hace uso eficiente del agua?' },
        { id: 'B_q_85', text: 'Evitar bloqueos al sistema de agua residual' },
        { id: 'B_q_86', text: '¿Existen rejillas para impedir que los residuos sólidos lleguen a la canalización?' },
        { id: 'B_q_87', text: '¿Se hace mantenimiento a las rejillas para minimizar problemas?' },
        { id: 'B_q_88', text: 'Tratamiento de agua residual' },
        { id: 'B_q_89', text: '¿Está su empresa conectada al drenaje público (alcantarillado) que está en servicio?' },
        { id: 'B_q_90', text: '¿Se ha sensibilizado al personal sobre los beneficios que se pueden alcanzar por la reducción del consumo de agua?' },
        { id: 'B_q_91', text: '¿Se han hecho cambios en la formulación de productos para disminuir el consumo de agua?' },
      ]
    },
    {
      id: 'B6',
      title: 'B6. Gestión de Residuos Sólidos',
      questions: [
        { id: 'B_q_92', text: '¿Identifica la normatividad que aplica para el Plan de Gestión Integral de Residuos Sólidos PGIRS?' },
        { id: 'B_q_93', text: '¿Se ha conformado el Grupo encargado del PGIRS en la empresa?' },
        { id: 'B_q_94', text: '¿Se ha realizado el Diagnóstico ambiental sobre el PGIRS?' },
        { id: 'B_q_95', text: '¿Se tienen Programas de sensibilización para el PGIRS?' },
        { id: 'B_q_96', text: '¿Se realiza separación en la fuente?' },
        { id: 'B_q_97', text: '¿Clasifica los residuos sólidos según la Normatividad?' },
        { id: 'B_q_98', text: '¿Se cuenta con rutas establecidas para el movimiento interno de residuos?' },
        { id: 'B_q_99', text: '¿Se tiene sitio de almacenamiento intermedio y/o central, cumpliendo con la norma?' },
        { id: 'B_q_100', text: '¿Se utiliza algún sistema de tratamiento?' },
        { id: 'B_q_101', text: '¿Se cuenta con plan de contingencia para el manejo de los residuos sólidos?' },
        { id: 'B_q_102', text: '¿Se cuenta con plan de seguimiento periódico?' },
        { id: 'B_q_103', text: '¿Se elaboran y presentan los informes o reportes?' },
      ]
    },
  ]
};

// Esquema de la sección C
const sectionC = {
  id: 'C',
  title: 'Gestión Energía',
  finalFormulaDivisor: 3,
  blocks: [
    {
      id: 'C1',
      title: 'C1. Tipo y clase de energía consumida',
      questions: [
        { id: 'C_q_104', text: '¿Existen medidores de energía?' },
        { id: 'C_q_105', text: '¿Los equipos funcionan con energía eléctrica?' },
        { id: 'C_q_106', text: '¿Existen fichas técnicas de los equipos?' },
        { id: 'C_q_107', text: '¿Las condiciones eléctricas son adecuadas?' },
        { id: 'C_q_108', text: '¿Los elementos de protección son los adecuados para prevenir el riesgo?' },
        { id: 'C_q_109', text: '¿Se ha realizado capacitación en riesgo eléctrico?' },
        { id: 'C_q_110', text: '¿Existe un plano de la red eléctrica de la instalación?' },
        { id: 'C_q_111', text: '¿Se tiene la señalización pertinente para riesgos eléctricos?' },
      ]
    },
    {
      id: 'C2',
      title: 'C2. Cantidad de energía consumida',
      questions: [
        { id: 'C_q_112', text: '¿Existen registro de consumo de energía por KW?' },
        { id: 'C_q_113', text: '¿Se ha establecido una frecuencia de registro?' },
        { id: 'C_q_114', text: '¿Aplican un método para ahorrar energía?' },
        { id: 'C_q_115', text: '¿Se ha tenido riesgo eléctrico en el área?' },
        { id: 'C_q_116', text: '¿Existen equipos de protección para riesgos eléctricos?' },
      ]
    },
    {
      id: 'C3',
      title: 'C3. Posibilidad de Cambio Tecnológico para Consumo de Energía',
      questions: [
        { id: 'C_q_117', text: '¿Existen equipos de consumo a gas?' },
        { id: 'C_q_118', text: '¿Existen registros de consumo a gas?' },
        { id: 'C_q_119', text: 'Existe posibilidades de cambio en las tecnologías para el consumo de energía por energías limpias (eólica, solar, gas, entre otras).' },
      ]
    },
  ]
};

// Esquema de la sección D
const sectionD = {
  id: 'D',
  title: 'Seguridad y Salud en el Trabajo',
  finalFormulaDivisor: 10,
  blocks: [
    {
      id: 'D1',
      title: 'D1. Normatividad',
      questions: [
        { id: 'D_q_120', text: '¿Se aplica la normatividad de Seguridad y Salud en el Trabajo?' },
      ]
    },
    {
      id: 'D2',
      title: 'D2. Documentación',
      questions: [
        { id: 'D_q_121', text: '¿Se encuentra documentado el programa de Seguridad y Salud en el Trabajo?' },
        { id: 'D_q_122', text: '¿Se tiene elaborado matriz de riesgo?' },
        { id: 'D_q_123', text: '¿Se encuentra divulgado e implementado?' },
      ]
    },
    {
      id: 'D3',
      title: 'D3. Comité paritario',
      questions: [
        { id: 'D_q_124', text: '¿Se cuenta con un comité paritario?' },
        { id: 'D_q_125', text: '¿Existen evidencias del trabajo realizado por dicho comité?' },
      ]
    },
    {
      id: 'D4',
      title: 'D4. Accidentes',
      questions: [
        { id: 'D_q_126', text: '¿Se han reportado los accidentes ocurridos?' },
        { id: 'D_q_127', text: '¿Se ha identificado y trabajado en las causas de los accidentes reportados?' },
        { id: 'D_q_128', text: '¿Se tiene identificada la frecuencia con la que ocurren?' },
        { id: 'D_q_129', text: '¿Los accidentes presentados han generado algún impacto ambiental?' },
        { id: 'D_q_130', text: '¿Se conocen casos de enfermedades profesionales?' },
      ]
    },
    {
      id: 'D5',
      title: 'D5. Incidentes',
      questions: [
        { id: 'D_q_131', text: '¿Se han reportado los incidentes ocurridos?' },
        { id: 'D_q_132', text: '¿Se han identificado y trabajado en las causas de los incidentes reportados?' },
        { id: 'D_q_133', text: '¿Se tiene identificada la frecuencia con la que ocurren?' },
        { id: 'D_q_134', text: '¿Los incidentes identificados han generado algún impacto ambiental?' },
      ]
    },
    {
      id: 'D6',
      title: 'D6. Planes de emergencia',
      questions: [
        { id: 'D_q_135', text: '¿Existen planes de contingencia o emergencia?' },
        { id: 'D_q_136', text: 'Si existen, ¿se encuentran documentados, divulgados e implementados?' },
        { id: 'D_q_137', text: '¿Está conformada una brigada de emergencia capacitada para atender cualquier tipo de eventualidades?' },
        { id: 'D_q_138', text: '¿Se han realizado simulacros de atención de emergencia?' },
        { id: 'D_q_139', text: 'En caso afirmativo, ¿Se tiene identificada la frecuencia con la que se han realizado?' },
      ]
    },
    {
      id: 'D7',
      title: 'D7. Señalización',
      questions: [
        { id: 'D_q_140', text: '¿Existe señalización acorde a las normas legales vigentes (Advertencia, Peligro, Ruta de Evacuación)?' },
      ]
    },
    {
      id: 'D8',
      title: 'D8. Elementos de protección personal',
      questions: [
        { id: 'D_q_141', text: '¿Se cuenta con los elementos de protección necesarios según factores de riesgo?' },
        { id: 'D_q_142', text: '¿Existe evidencia del suministro de los elementos de protección necesarios con la frecuencia indicada?' },
        { id: 'D_q_143', text: '¿Se vigila que el personal utilice los elementos de protección suministrados de manera adecuada durante el desarrollo de la labor?' },
        { id: 'D_q_144', text: '¿Se ha capacitado al personal sobre la importancia del uso adecuado de los elementos de protección suministrados y la manera adecuada de utilizarlos?' },
      ]
    },
    {
      id: 'D9',
      title: 'D9. Uso de extintores',
      questions: [
        { id: 'D_q_145', text: '¿Están identificados y clasificados los riesgos (físicos, químicos y biológicos) de acuerdo a los diferentes puestos de trabajo?' },
        { id: 'D_q_146', text: '¿La distribución y ubicación de los extintores obedece a la reglamentación legal?' },
        { id: 'D_q_147', text: '¿Existen evidencias de los registros de mantenimiento de los extintores?' },
        { id: 'D_q_148', text: '¿Se controla la vigencia de los extintores?' },
        { id: 'D_q_149', text: '¿Se ha capacitado al personal sobre el uso adecuado de los extintores?' },
      ]
    },
    {
      id: 'D10',
      title: 'D10. Panorama de factores de riesgo',
      questions: [
        { id: 'D_q_150', text: '¿Están identificados y clasificados los riesgos (físicos, químicos y biológicos) de acuerdo a los diferentes puestos de trabajo?' },
        { id: 'D_q_151', text: '¿Existen métodos de control para identificar nuevos factores de riesgos?' },
        { id: 'D_q_152', text: '¿Existen planos actualizados de las diferentes áreas para identificar y ubicar factores de riesgo?' },
        { id: 'D_q_153', text: '¿Se tienen acciones frente a los diferentes riesgos existentes?' },
      ]
    },
  ]
};

// Esquema de la sección E
const sectionE = {
  id: 'E',
  title: 'Diagnóstico Aspectos Sociales',
  finalFormulaDivisor: 4,
  blocks: [
    {
      id: 'E1',
      title: 'E1. Relación con la comunidad',
      questions: [
        { id: 'E_q_1', text: 'La empresa realiza actividades de vinculación con la comunidad.' },
        { id: 'E_q_2', text: 'La empresa promueve el desarrollo social de la comunidad.' },
        { id: 'E_q_3', text: 'La empresa tiene políticas de responsabilidad social.' },
      ]
    },
    {
      id: 'E2',
      title: 'E2. Cumplimiento de normativas sociales',
      questions: [
        { id: 'E_q_4', text: 'La empresa cumple con las normativas laborales vigentes.' },
        { id: 'E_q_5', text: 'La empresa garantiza la no discriminación en el empleo.' },
        { id: 'E_q_6', text: 'La empresa respeta los derechos de los trabajadores.' },
      ]
    },
    {
      id: 'E3',
      title: 'E3. Impacto social de la empresa',
      questions: [
        { id: 'E_q_7', text: 'La empresa evalúa el impacto social de sus actividades.' },
        { id: 'E_q_8', text: 'La empresa tiene programas para mitigar impactos sociales negativos.' },
        { id: 'E_q_9', text: 'La empresa reporta sobre su desempeño en aspectos sociales.' },
      ]
    },
  ]
};

// Esquema de la sección F
const sectionF = {
  id: 'F',
  title: 'Diagnóstico Almacén',
  finalFormulaDivisor: 3,
  blocks: [
    {
      id: 'F1',
      title: 'F1. Registro y fichas de almacenamiento de los insumos y productos',
      questions: [
        { id: 'F_q_195', text: '¿Requiere de articulos y/o materias primas?' },
        { id: 'F_q_196', text: '¿Clasifica los insumos y materia prima que almacena? (Según su composición química, física, peligrosidad etc.)' },
        { id: 'F_q_197', text: '¿Dispone del espacio suficiente y adecuado para almacenar la materia prima e insumos que se necesita.' },
        { id: 'F_q_198', text: '¿Identifica los insumos/productos y registra su ubicación y rotación?' },
        { id: 'F_q_199', text: '¿Cuenta con fichas técnicas/hojas de seguridad para insumos críticos?' },
      ]
    },
    {
      id: 'F2',
      title: 'F2. Señalización y rutas de almacenamiento',
      questions: [
        { id: 'F_q_200', text: '¿Cuenta con señalización visible de rutas, salidas y zonas de almacenamiento?' },
        { id: 'F_q_201', text: '¿Se respetan pasillos y áreas libres para circulación segura?' },
        { id: 'F_q_202', text: '¿Se controla el apilamiento y disposición segura para evitar volcamiento/caídas?' },
        { id: 'F_q_203', text: '¿Existe control de temperatura/humedad cuando aplica?' },
      ]
    },
    {
      id: 'F3',
      title: 'F3. Insumos con alto riesgo de peligrosidad',
      questions: [
        { id: 'F_q_204', text: '¿Se almacenan sustancias peligrosas conforme a su clasificación?' },
        { id: 'F_q_205', text: '¿Hay segregación por compatibilidad (ácidos, bases, inflamables, etc.)?' },
        { id: 'F_q_206', text: '¿Existen kits y procedimientos para atención de derrames?' },
        { id: 'F_q_207', text: '¿El personal cuenta con EPP específico para manipulación de peligrosos?' },
        { id: 'F_q_208', text: '¿Se llevan registros de ingreso/salida y control de inventario para peligrosos?' },
        { id: 'F_q_209', text: '¿Se cumple con la rotulación/etiquetado GHS u otro estándar aplicable?' },
        { id: 'F_q_210', text: '¿Se realizan inspecciones periódicas al área de sustancias peligrosas?' },
      ]
    },
  ]
};

const options = [
  { value: 'IMP', label: 'Importante (IMP)', score: 3 },
  { value: 'M', label: 'Medio (M)', score: 2 },
  { value: 'AC', label: 'Aceptable (AC)', score: 1 },
  { value: 'NA', label: 'No aplica (NA)', score: 0 },
];

const optionsE = [
  { value: 'Siempre', label: 'Siempre', score: 3 },
  { value: 'Casi siempre', label: 'Casi siempre', score: 2 },
  { value: 'Algunas veces', label: 'Algunas veces', score: 1 },
  { value: 'Nunca', label: 'Nunca', score: 0 },
];

const sectionSteps = [
  { key: 'A', label: 'Diagnóstico Económico', color: '#e8f5e9', gradient: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' },
  { key: 'B', label: 'Gestión Ambiental', color: '#e3f2fd', gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' },
  { key: 'C', label: 'Gestión Energía', color: '#f1f8e9', gradient: 'linear-gradient(135deg, #f1f8e9 0%, #c8e6c9 100%)' },
  { key: 'D', label: 'Seguridad y Salud en el Trabajo', color: '#f3e5f5', gradient: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)' },
  { key: 'E', label: 'Diagnóstico Aspectos Sociales', color: '#fffde7', gradient: 'linear-gradient(135deg, #fffde7 0%, #ffe082 100%)' },
  { key: 'F', label: 'Diagnóstico Almacén', color: '#f9fbe7', gradient: 'linear-gradient(135deg, #f9fbe7 0%, #fffde7 100%)' },
];

const FormularioAutogestion = ({ noCard = false }) => {
  // Estado para datos de empresa (debe ir antes de cualquier uso)
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombreEmpresa: "",
    nit: "",
    direccion: "",
    departamento: "",
    municipio: "",
    añoBase: "",
    fechaReporte: "",
    telefono: "",
    correo: "",
    personaElabora: "",
    cargo: ""
  });

  // Importar datos de departamentos y municipios
  const departamentosMunicipios = require('../../data/departamentos_municipios.json');
  const departamentos = departamentosMunicipios.map(d => d.departamento);
  const municipiosFiltrados = datosEmpresa.departamento
    ? (departamentosMunicipios.find(d => d.departamento === datosEmpresa.departamento)?.municipios || [])
    : [];
  // Estado para datos de empresa
  
  // Handler para datos de empresa
  function handleEmpresaChange(e) {
    const { name, value } = e.target;
    setDatosEmpresa(prev => ({ ...prev, [name]: value }));
  }
  // Estado para error de validación
  const [stepError, setStepError] = useState("");
  // Estado para mostrar el modal de error
  const [showErrorModal, setShowErrorModal] = useState(false);
  // Estado de respuestas
  const [answers, setAnswers] = useState({});
  const [answersE, setAnswersE] = useState({});
  const [answersF, setAnswersF] = useState({});

  // Estado para preguntas faltantes
  const [missingQuestions, setMissingQuestions] = useState([]);

  // Wizard
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = A, 1 = B, ...
  // Mapeo de respuestas a score sección F
  const scoresF = useMemo(() => {
    const out = {};
    sectionF.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answersF[q.id]);
      });
    });
    return out;
  }, [answersF]);

  // Promedios por bloque sección F
  const blockAveragesF = useMemo(() => {
    const out = {};
    sectionF.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresF[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresF]);

  // Porcentaje final sección F
  const categoryPercentF = useMemo(() => {
    const groupAvgs = sectionF.blocks.map(b => blockAveragesF[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionF.finalFormulaDivisor);
  }, [blockAveragesF]);
  // Handler de respuesta sección F
  function handleAnswerChangeF(questionId, value) {
    setAnswersF(prev => ({ ...prev, [questionId]: value }));
  }

  // Mapeo de respuestas a score sección A
  const scoresA = useMemo(() => {
    const out = {};
    sectionA.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers]);

  // Mapeo de respuestas a score sección B
  const scoresB = useMemo(() => {
    const out = {};
    sectionB.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers]);

  // Mapeo de respuestas a score sección C
  const scoresC = useMemo(() => {
    const out = {};
    sectionC.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers]);

  // Mapeo de respuestas a score sección D
  const scoresD = useMemo(() => {
    const out = {};
    sectionD.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = selectionToScore(answers[q.id]);
      });
    });
    return out;
  }, [answers]);

  // Mapeo de respuestas a score sección E
  const scoresE = useMemo(() => {
    const out = {};
    sectionE.blocks.forEach(block => {
      block.questions.forEach(q => {
        out[q.id] = optionsE.find(opt => opt.value === answersE[q.id])?.score ?? null;
      });
    });
    return out;
  }, [answersE]);

  // Promedios por bloque sección A
  const blockAveragesA = useMemo(() => {
    const out = {};
    sectionA.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresA[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresA]);

  // Promedios por bloque sección B
  const blockAveragesB = useMemo(() => {
    const out = {};
    sectionB.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresB[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresB]);

  // Promedios por bloque sección C
  const blockAveragesC = useMemo(() => {
    const out = {};
    sectionC.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresC[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresC]);

  // Promedios por bloque sección D
  const blockAveragesD = useMemo(() => {
    const out = {};
    sectionD.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresD[q.id]);
      out[block.id] = averageIgnoringZeros(vals);
    });
    return out;
  }, [scoresD]);

  // Promedios por bloque sección E
  const blockAveragesE = useMemo(() => {
    const out = {};
    sectionE.blocks.forEach(block => {
      const vals = block.questions.map(q => scoresE[q.id]);
      const nums = vals.filter(v => typeof v === 'number' && v > 0);
      out[block.id] = nums.length === 0 ? null : nums.reduce((a, b) => a + b, 0) / nums.length;
    });
    return out;
  }, [scoresE]);

  // Porcentaje final sección A
  const categoryPercentA = useMemo(() => {
    const groupAvgs = sectionA.blocks.map(b => blockAveragesA[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionA.finalFormulaDivisor);
  }, [blockAveragesA]);

  // Porcentaje final sección B
  const categoryPercentB = useMemo(() => {
    const groupAvgs = sectionB.blocks.map(b => blockAveragesB[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionB.finalFormulaDivisor);
  }, [blockAveragesB]);

  // Porcentaje final sección C
  const categoryPercentC = useMemo(() => {
    const groupAvgs = sectionC.blocks.map(b => blockAveragesC[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionC.finalFormulaDivisor);
  }, [blockAveragesC]);

  // Porcentaje final sección D
  const categoryPercentD = useMemo(() => {
    const groupAvgs = sectionD.blocks.map(b => blockAveragesD[b.id]);
    return excelStyleFinalPercent(groupAvgs, sectionD.finalFormulaDivisor);
  }, [blockAveragesD]);

  // Porcentaje final sección E
  const categoryPercentE = useMemo(() => {
    const groupAvgs = sectionE.blocks.map(b => blockAveragesE[b.id] ?? 0);
    const sum = groupAvgs.reduce((a,b) => a + b, 0);
    const step1 = sum / sectionE.finalFormulaDivisor;
    const step2 = (step1 / 3) * 100;
    return step2;
  }, [blockAveragesE]);

  // Handler de respuesta
  function handleAnswerChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  // Handler de respuesta sección E
  function handleAnswerChangeE(questionId, value) {
    setAnswersE(prev => ({ ...prev, [questionId]: value }));
  }

  // Render pregunta
  const QuestionRow = React.memo(function QuestionRow({ question }) {
      const name = `${question.id}`;
      return (
        <div className={`autogestion-question-row${question.missing ? ' autogestion-question-missing' : ''}`}>
          <div className="autogestion-question-text">{question.text}</div>
          <div className="autogestion-question-options">
            {options.map(opt => (
              <label key={opt.value} className="autogestion-question-label" onClick={(e) => {
                e.preventDefault();
                handleAnswerChange(question.id, opt.value);
              }}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={answers[question.id] === opt.value}
                  onChange={() => {}}
                  className="autogestion-radio"
                />
                {opt.label} <span className="autogestion-question-score">({opt.score})</span>
              </label>
            ))}
          </div>
        </div>
      );
  });

  // Render pregunta sección E
  const QuestionRowE = React.memo(function QuestionRowE({ question }) {
    return (
      <div className={`autogestion-question-row${question.missing ? ' autogestion-question-missing' : ''}`}>
        <div className="autogestion-question-text">{question.text}</div>
        <div className="autogestion-question-options">
          {optionsE.map(opt => (
            <label key={opt.value} className="autogestion-question-label" onClick={(e) => {
              e.preventDefault();
              handleAnswerChangeE(question.id, opt.value);
            }}>
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={answersE[question.id] === opt.value}
                onChange={() => {}}
                className="autogestion-radio"
              />
              {opt.label} <span className="autogestion-question-score">({opt.score})</span>
            </label>
          ))}
        </div>
      </div>
    );
  });

  // Render pregunta sección F
  const QuestionRowF = React.memo(function QuestionRowF({ question }) {
    const name = `${question.id}`;
    return (
      <div className={`autogestion-question-row${question.missing ? ' autogestion-question-missing' : ''}`}>
        <div className="autogestion-question-text">{question.text}</div>
        <div className="autogestion-question-options">
          {options.map(opt => (
            <label key={opt.value} className="autogestion-question-label" onClick={(e) => {
              e.preventDefault();
              handleAnswerChangeF(question.id, opt.value);
            }}>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={answersF[question.id] === opt.value}
                onChange={() => {}}
                className="autogestion-radio"
              />
              {opt.label} <span className="autogestion-question-score">({opt.score})</span>
            </label>
          ))}
        </div>
      </div>
    );
  });

  // Render bloque
  function BlockGroup({ block, averages }) {
    return (
      <Card className="autogestion-block-card">
        <CardBody>
          <h4 className="autogestion-block-title">{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRow key={q.id} question={{...q, missing: missingQuestions.includes(q.id)}} />
          ))}
          <div className="autogestion-block-average">
            Promedio bloque: {averages[block.id] !== null ? averages[block.id].toFixed(2) : '—'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render bloque sección E
  function BlockGroupE({ block }) {
    return (
      <Card className="autogestion-block-card">
        <CardBody>
          <h4 className="autogestion-block-title autogestion-block-title-e">{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRowE key={q.id} question={{...q, missing: missingQuestions.includes(q.id)}} />
          ))}
          <div className="autogestion-block-average autogestion-block-average-e">
            Promedio bloque: {blockAveragesE[block.id] !== null ? blockAveragesE[block.id].toFixed(2) : '—'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render bloque sección F
  function BlockGroupF({ block }) {
    return (
      <Card className="autogestion-block-card">
        <CardBody>
          <h4 className="autogestion-block-title autogestion-block-title-f">{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRowF key={q.id} question={{...q, missing: missingQuestions.includes(q.id)}} />
          ))}
          <div className="autogestion-block-average autogestion-block-average-f">
            Promedio bloque: {blockAveragesF[block.id] !== null ? blockAveragesF[block.id].toFixed(2) : '—'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen sección A
  function SummaryPanelA() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#f1f8e9'}}>
        <CardBody>
          <h3 style={{color:'#2E7D32', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>Resumen de resultados sección económica</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionA.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesA[block.id] !== null ? blockAveragesA[block.id].toFixed(2) : 'Sin respuestas'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#217a3a', fontSize:'1.18rem'}}>
            Porcentaje final sección económica: {isNaN(categoryPercentA) ? '—' : categoryPercentA.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen sección B
  function SummaryPanelB() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#e3f2fd'}}>
        <CardBody>
          <h3 style={{color:'#1565c0', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>Resumen de resultados sección ambiental</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionB.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesB[block.id] !== null ? blockAveragesB[block.id].toFixed(2) : 'Sin respuestas'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#1565c0', fontSize:'1.18rem'}}>
            Porcentaje final sección ambiental: {isNaN(categoryPercentB) ? '—' : categoryPercentB.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen sección C
  function SummaryPanelC() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#e8f5e9'}}>
        <CardBody>
          <h3 style={{color:'#2e7d32', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>Resumen de resultados sección energía</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionC.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesC[block.id] !== null ? blockAveragesC[block.id].toFixed(2) : 'Sin respuestas'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#2e7d32', fontSize:'1.18rem'}}>
            Porcentaje final sección energía: {isNaN(categoryPercentC) ? '—' : categoryPercentC.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen sección D
  function SummaryPanelD() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#f3e5f5'}}>
        <CardBody>
          <h3 style={{color:'#6a1b9a', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>Resumen de resultados sección seguridad y salud en el trabajo</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionD.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesD[block.id] !== null ? blockAveragesD[block.id].toFixed(2) : 'Sin respuestas'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#6a1b9a', fontSize:'1.18rem'}}>
            Porcentaje final sección seguridad y salud en el trabajo: {isNaN(categoryPercentD) ? '—' : categoryPercentD.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen sección E
  function SummaryPanelE() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(21,101,192,0.10)', background:'#e3f2fd'}}>
        <CardBody>
          <h3 style={{color:'#1565c0', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>Resumen de resultados sección social</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionE.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesE[block.id] !== null ? blockAveragesE[block.id].toFixed(2) : 'Sin respuestas'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#1565c0', fontSize:'1.18rem'}}>
            Porcentaje final sección social: {isNaN(categoryPercentE) ? '—' : categoryPercentE.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Render resumen sección F
  function SummaryPanelF() {
    return (
      <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(21,101,192,0.10)', background:'#f9fbe7'}}>
        <CardBody>
          <h3 style={{color:'#c0a115', fontWeight:900, fontSize:'1.25rem', marginBottom:18}}>Resumen de resultados sección almacén</h3>
          <ul style={{paddingLeft:0, listStyle:'none'}}>
            {sectionF.blocks.map(block => (
              <li key={block.id} style={{marginBottom:10}}>
                <b>{block.title}:</b> {blockAveragesF[block.id] !== null ? blockAveragesF[block.id].toFixed(2) : 'Sin respuestas'}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18, fontWeight:700, color:'#c0a115', fontSize:'1.18rem'}}>
            Porcentaje final sección almacén: {isNaN(categoryPercentF) ? '—' : categoryPercentF.toFixed(1) + ' %'}
          </div>
        </CardBody>
      </Card>
    );
  }

  // Navegación wizard - Simplificada y mejorada
  function handleNextStep() {
    // Validar que todas las preguntas del paso actual estén respondidas
    let missing = [];
    if (currentStep === 0) {
      sectionA.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 1) {
      sectionB.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 2) {
      sectionC.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 3) {
      sectionD.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answers[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 4) {
      sectionE.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answersE[q.id]) missing.push(q.id);
        });
      });
    } else if (currentStep === 5) {
      sectionF.blocks.forEach(block => {
        block.questions.forEach(q => {
          if (!answersF[q.id]) missing.push(q.id);
        });
      });
    }
    setMissingQuestions(missing);
    if (missing.length > 0) {
      setStepError("Por favor responde todas las preguntas antes de continuar.");
      setShowErrorModal(true);
      return;
    }
    setStepError("");
    setShowErrorModal(false);
    setMissingQuestions([]);
    if (currentStep < sectionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }
  
  function handlePrevStep() {
    setStepError("");
    setMissingQuestions([]);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }
  
  function handleStartWizard() {
    setStepError("");
    setMissingQuestions([]);
    setShowWizard(true);
    setCurrentStep(0);
  }
  
  function handleCloseWizard() {
    setStepError("");
    setMissingQuestions([]);
    setShowWizard(false);
    setCurrentStep(0);
  }

  return (
  <>
      {/* Modal de error emergente */}
      {showErrorModal && (
        <div className="autogestion-modal-overlay">
          <div className="autogestion-modal">
            <div className="autogestion-modal-header">Error</div>
            <div className="autogestion-modal-body">{stepError}</div>
            <div className="autogestion-modal-footer">
              <Button color="danger" onClick={() => setShowErrorModal(false)} style={{fontWeight:700, borderRadius:10}}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
      {/* Formulario de datos de empresa al inicio */}
      {!showWizard && (
        noCard ? (
          <div style={{maxWidth:600, margin:'0 auto', padding:'0 28px 32px 28px', background:'transparent'}}>
            <h2 style={{fontWeight:900, fontSize:'1.35rem', marginBottom:24, color:'#388e3c', textAlign:'center', marginTop:0, paddingTop:0}}>Datos de la Empresa</h2>
            <form>
              <div style={{display:'flex', flexWrap:'wrap', gap:'18px'}}>
                <input name="nombreEmpresa" value={datosEmpresa.nombreEmpresa} onChange={handleEmpresaChange} placeholder="Nombre de la empresa" className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                <input name="nit" value={datosEmpresa.nit} onChange={handleEmpresaChange} placeholder="NIT" className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="direccion" value={datosEmpresa.direccion} onChange={handleEmpresaChange} placeholder="Dirección" className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                {/* Select de departamento */}
                <select name="departamento" value={datosEmpresa.departamento} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}}>
                  <option value="">Departamento</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {/* Select de municipio dependiente del departamento */}
                <select name="municipio" value={datosEmpresa.municipio} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} disabled={!datosEmpresa.departamento}>
                  <option value="">Municipio</option>
                  {municipiosFiltrados.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
                <input name="añoBase" value={datosEmpresa.añoBase} onChange={handleEmpresaChange} placeholder="Año base" className="form-control" style={{flex:'1 1 80px', marginBottom:10}} />
                <input name="fechaReporte" value={datosEmpresa.fechaReporte} onChange={handleEmpresaChange} placeholder="Fecha de reporte" type="date" className="form-control" style={{flex:'1 1 140px', marginBottom:10}} />
                <input name="telefono" value={datosEmpresa.telefono} onChange={handleEmpresaChange} placeholder="Teléfono" className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="correo" value={datosEmpresa.correo} onChange={handleEmpresaChange} placeholder="Correo electrónico" className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="personaElabora" value={datosEmpresa.personaElabora} onChange={handleEmpresaChange} placeholder="Persona que elabora" className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="cargo" value={datosEmpresa.cargo} onChange={handleEmpresaChange} placeholder="Cargo" className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
              </div>
            </form>
            <div style={{textAlign:'center', marginTop:32}}>
              <Button color="success" size="lg" style={{fontWeight:900, fontSize:'1.2rem', padding:'18px 44px', borderRadius:16}} onClick={handleStartWizard}>
                Iniciar diagnóstico
              </Button>
            </div>
          </div>
        ) : (
          <div style={{maxWidth:600, margin:'0 auto', background:'#fff', borderRadius:18, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', padding:'0 28px 32px 28px'}}>
            <h2 style={{fontWeight:900, fontSize:'1.35rem', marginBottom:24, color:'#388e3c', textAlign:'center', marginTop:0}}>Datos de la Empresa</h2>
            <form>
              <div style={{display:'flex', flexWrap:'wrap', gap:'18px'}}>
                <input name="nombreEmpresa" value={datosEmpresa.nombreEmpresa} onChange={handleEmpresaChange} placeholder="Nombre de la empresa" className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                <input name="nit" value={datosEmpresa.nit} onChange={handleEmpresaChange} placeholder="NIT" className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="direccion" value={datosEmpresa.direccion} onChange={handleEmpresaChange} placeholder="Dirección" className="form-control" style={{flex:'1 1 220px', marginBottom:10}} />
                {/* Select de departamento */}
                <select name="departamento" value={datosEmpresa.departamento} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}}>
                  <option value="">Departamento</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {/* Select de municipio dependiente del departamento */}
                <select name="municipio" value={datosEmpresa.municipio} onChange={handleEmpresaChange} className="form-control" style={{flex:'1 1 120px', marginBottom:10}} disabled={!datosEmpresa.departamento}>
                  <option value="">Municipio</option>
                  {municipiosFiltrados.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
                <input name="añoBase" value={datosEmpresa.añoBase} onChange={handleEmpresaChange} placeholder="Año base" className="form-control" style={{flex:'1 1 80px', marginBottom:10}} />
                <input name="fechaReporte" value={datosEmpresa.fechaReporte} onChange={handleEmpresaChange} placeholder="Fecha de reporte" type="date" className="form-control" style={{flex:'1 1 140px', marginBottom:10}} />
                <input name="telefono" value={datosEmpresa.telefono} onChange={handleEmpresaChange} placeholder="Teléfono" className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
                <input name="correo" value={datosEmpresa.correo} onChange={handleEmpresaChange} placeholder="Correo electrónico" className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="personaElabora" value={datosEmpresa.personaElabora} onChange={handleEmpresaChange} placeholder="Persona que elabora" className="form-control" style={{flex:'1 1 180px', marginBottom:10}} />
                <input name="cargo" value={datosEmpresa.cargo} onChange={handleEmpresaChange} placeholder="Cargo" className="form-control" style={{flex:'1 1 120px', marginBottom:10}} />
              </div>
            </form>
            <div style={{textAlign:'center', marginTop:32}}>
              <Button color="success" size="lg" style={{fontWeight:900, fontSize:'1.2rem', padding:'18px 44px', borderRadius:16}} onClick={handleStartWizard}>
                Iniciar diagnóstico
              </Button>
            </div>
          </div>
        )
      )}
      {/* Wizard pantalla completa - REDISEÑADO PARA EVITAR SOBREPOSICIÓN */}
      {showWizard && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          background: sectionSteps[currentStep].gradient,
          zIndex:9999,
          overflowY:'auto',
          paddingTop: '20px',
          paddingBottom: '20px',
          transition:'background 0.5s',
          scrollBehavior: 'auto',
        }}>
          <div style={{
            width:'100%',
            maxWidth:900,
            margin:'0 auto',
          }}>
            {/* Barra de progreso y cabecera - NO STICKY para evitar ocultamiento */}
            <div style={{
              width:'100%',
              display:'flex', 
              alignItems:'center', 
              justifyContent:'space-between',
              background:'rgba(241,248,233,0.95)',
              borderRadius:18,
              boxShadow:'0 2px 12px 0 rgba(46,125,50,0.08)',
              padding:'18px 32px',
              marginBottom: '20px'
            }}>
              <div style={{fontWeight:900, fontSize:'1.15rem', color:'#388e3c'}}>
                Paso {currentStep+1} de {sectionSteps.length}: <span style={{color:'#1565c0'}}>{sectionSteps[currentStep].label}</span>
              </div>
              <Button color="danger" outline onClick={handleCloseWizard} style={{fontWeight:700, fontSize:'1rem', borderRadius:12, padding:'8px 24px'}}>Salir</Button>
            </div>

            {/* Contenido del paso - SIN PADDING EXTRA QUE CAUSE PROBLEMAS */}
            <div style={{
              width:'100%',
              background:'white',
              borderRadius:24,
              boxShadow:'0 4px 32px 0 rgba(46,125,50,0.13)',
              padding:'30px 32px',
              position:'relative',
              display:'flex',
              flexDirection:'column',
              justifyContent:'flex-start',
            }}>
              {stepError && (
                <div className="autogestion-step-error" style={{
                  background:'#ffeaea',
                  color:'#c62828',
                  fontWeight:'bold',
                  borderRadius:'8px',
                  padding:'12px',
                  marginBottom:'18px',
                  textAlign:'center',
                  boxShadow:'0 2px 8px 0 rgba(198,40,40,0.08)'
                }}>
                  {stepError}
                </div>
              )}
              {currentStep === 0 && (
                <>
                  <h2 style={{ color: '#2E7D32', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>Sección A: Diagnóstico Económico</h2>
                  {sectionA.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesA} />
                  ))}
                  <SummaryPanelA />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" disabled={currentStep === 0} onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Anterior</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Siguiente</Button>
                  </div>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <h2 style={{ color: '#1565c0', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>Sección B: Gestión Ambiental</h2>
                  {sectionB.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesB} />
                  ))}
                  <SummaryPanelB />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Anterior</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Siguiente</Button>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 style={{ color: '#2e7d32', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>Sección C: Gestión Energía</h2>
                  {sectionC.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesC} />
                  ))}
                  <SummaryPanelC />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Anterior</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Siguiente</Button>
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 style={{ color: '#6a1b9a', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>Sección D: Seguridad y Salud en el Trabajo</h2>
                  {sectionD.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesD} />
                  ))}
                  <SummaryPanelD />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Anterior</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Siguiente</Button>
                  </div>
                </>
              )}
              {currentStep === 4 && (
                <>
                  <h2 style={{ color: '#1565c0', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>Sección E: Diagnóstico Aspectos Sociales</h2>
                  {sectionE.blocks.map(block => (
                    <BlockGroupE key={block.id} block={block} />
                  ))}
                  <SummaryPanelE />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Anterior</Button>
                    <Button color="success" onClick={handleNextStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Siguiente</Button>
                  </div>
                </>
              )}
              {currentStep === 5 && (
                <>
                  <h2 style={{ color: '#c0a115', fontWeight: 900, fontSize: '1.7rem', marginBottom: 32, textAlign:'center' }}>Sección F: Diagnóstico Almacén</h2>
                  {sectionF.blocks.map(block => (
                    <BlockGroupF key={block.id} block={block} />
                  ))}
                  <SummaryPanelF />
                  {/* Mostrar datos de empresa junto al resumen global */}
                  <div style={{maxWidth:700, margin:'32px auto 0 auto', background:'#fff', borderRadius:18, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', padding:'32px 28px'}}>
                    <h3 style={{fontWeight:900, fontSize:'1.25rem', marginBottom:18, color:'#388e3c'}}>Datos de la Empresa</h3>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'18px'}}>
                      <div style={{flex:'1 1 220px', marginBottom:10}}><b>Nombre:</b> {datosEmpresa.nombreEmpresa}</div>
                      <div style={{flex:'1 1 120px', marginBottom:10}}><b>NIT:</b> {datosEmpresa.nit}</div>
                      <div style={{flex:'1 1 220px', marginBottom:10}}><b>Dirección:</b> {datosEmpresa.direccion}</div>
                      <div style={{flex:'1 1 120px', marginBottom:10}}><b>Departamento:</b> {datosEmpresa.departamento}</div>
                      <div style={{flex:'1 1 120px', marginBottom:10}}><b>Municipio:</b> {datosEmpresa.municipio}</div>
                      <div style={{flex:'1 1 80px', marginBottom:10}}><b>Año base:</b> {datosEmpresa.añoBase}</div>
                      <div style={{flex:'1 1 140px', marginBottom:10}}><b>Fecha de reporte:</b> {datosEmpresa.fechaReporte}</div>
                      <div style={{flex:'1 1 120px', marginBottom:10}}><b>Teléfono:</b> {datosEmpresa.telefono}</div>
                      <div style={{flex:'1 1 180px', marginBottom:10}}><b>Correo:</b> {datosEmpresa.correo}</div>
                      <div style={{flex:'1 1 180px', marginBottom:10}}><b>Persona que elabora:</b> {datosEmpresa.personaElabora}</div>
                      <div style={{flex:'1 1 120px', marginBottom:10}}><b>Cargo:</b> {datosEmpresa.cargo}</div>
                    </div>
                  </div>
                  <ResumenGlobal
                    porcentajes={{
                      A: categoryPercentA,
                      B: categoryPercentB,
                      C: categoryPercentC,
                      D: categoryPercentD,
                      E: categoryPercentE,
                      F: categoryPercentF
                    }}
                  />
                  <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32}}>
                    <Button color="secondary" onClick={handlePrevStep} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Anterior</Button>
                    <Button color="primary" onClick={handleCloseWizard} style={{fontWeight:700, fontSize:'1.15rem', borderRadius:14, padding:'14px 38px'}}>Finalizar</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormularioAutogestion;
