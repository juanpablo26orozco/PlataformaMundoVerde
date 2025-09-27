import React, { useState, useMemo } from 'react';
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

const options = [
  { value: 'IMP', label: 'Importante (IMP)', score: 3 },
  { value: 'M', label: 'Medio (M)', score: 2 },
  { value: 'AC', label: 'Aceptable (AC)', score: 1 },
  { value: 'NA', label: 'No aplica (NA)', score: 0 },
];

const FormularioAutogestion = () => {
  // Estado de respuestas
  const [answers, setAnswers] = useState({});
  const [showSummaryA, setShowSummaryA] = useState(false);
  const [showSectionB, setShowSectionB] = useState(false);
  const [showSummaryB, setShowSummaryB] = useState(false);

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

  // Handler de respuesta
  function handleAnswerChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  // Render pregunta
  function QuestionRow({ question }) {
    return (
      <div style={{marginBottom: 18, padding: '12px 0', borderBottom: '1px solid #e0e7ff'}}>
        <div style={{fontWeight: 600, marginBottom: 8}}>{question.text}</div>
        <div style={{display: 'flex', gap: 18}}>
          {options.map(opt => (
            <label key={opt.value} style={{fontWeight: 500, cursor: 'pointer'}}>
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={answers[question.id] === opt.value}
                onChange={() => handleAnswerChange(question.id, opt.value)}
                style={{marginRight: 6}}
              />
              {opt.label} <span style={{color:'#388e3c', fontWeight:700}}>({opt.score})</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Render bloque
  function BlockGroup({ block, averages }) {
    return (
      <Card className="mb-4" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)'}}>
        <CardBody>
          <h4 style={{color:'#2E7D32', fontWeight:800, fontSize:'1.15rem', marginBottom:18}}>{block.title}</h4>
          {block.questions.map(q => (
            <QuestionRow key={q.id} question={q} />
          ))}
          <div style={{marginTop:18, fontWeight:600, color:'#388e3c'}}>
            Promedio bloque: {averages[block.id] !== null ? averages[block.id].toFixed(2) : '—'}
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

  // Submit sección A: muestra resumen y permite avanzar a sección B
  function handleSubmitA(e) {
    e.preventDefault();
    setShowSummaryA(true);
    setShowSectionB(true);
  }

  // Submit sección B: muestra resumen ambiental
  function handleSubmitB(e) {
    e.preventDefault();
    setShowSummaryB(true);
  }

  return (
    <section style={{ background: '#f1f8e9', borderRadius: 18, boxShadow: '0 2px 16px 0 rgba(46,125,50,0.10)', padding: '44px 22px', marginTop: 40 }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 style={{ color: '#2E7D32', fontWeight: 900, fontSize: '1.5rem', marginBottom: 32 }}>Sección A: Diagnóstico Económico</h2>
            <form onSubmit={handleSubmitA}>
              {sectionA.blocks.map(block => (
                <BlockGroup key={block.id} block={block} averages={blockAveragesA} />
              ))}
              <Button color="success" type="submit" style={{marginTop:24}}>Calcular resultados sección A</Button>
            </form>
            {showSummaryA && <SummaryPanelA />}
            {showSectionB && (
              <>
                <h2 style={{ color: '#1565c0', fontWeight: 900, fontSize: '1.5rem', margin: '48px 0 32px 0' }}>Sección B: Gestión Ambiental</h2>
                <form onSubmit={handleSubmitB}>
                  {sectionB.blocks.map(block => (
                    <BlockGroup key={block.id} block={block} averages={blockAveragesB} />
                  ))}
                  <Button color="primary" type="submit" style={{marginTop:24}}>Calcular resultados sección B</Button>
                </form>
                {showSummaryB && <SummaryPanelB />}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FormularioAutogestion;
