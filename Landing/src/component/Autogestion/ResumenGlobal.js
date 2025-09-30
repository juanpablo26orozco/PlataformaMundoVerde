import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';

const sectionNames = [
  { key: 'A', label: 'Económico', color: '#2E7D32' },
  { key: 'B', label: 'Ambiental', color: '#1565c0' },
  { key: 'C', label: 'Energía', color: '#2e7d32' },
  { key: 'D', label: 'Seguridad y Salud en el Trabajo', color: '#6a1b9a' },
  { key: 'E', label: 'Aspectos Sociales', color: '#1565c0' },
  { key: 'F', label: 'Almacén', color: '#c0a115' },
];

function ResumenGlobal({ porcentajes }) {
  return (
    <Card className="mb-5" style={{borderRadius:16, boxShadow:'0 2px 12px 0 rgba(76,175,80,0.10)', background:'#fffde7'}}>
      <CardBody>
        <h3 style={{fontWeight:900, fontSize:'1.35rem', marginBottom:24, color:'#388e3c'}}>Resumen Global: Promedio Porcentual Diagnóstico</h3>
        <Row>
          {sectionNames.map(sec => (
            <Col key={sec.key} md={4} sm={6} xs={12} style={{marginBottom:24}}>
              <div style={{
                background:'#f1f8e9',
                borderRadius:12,
                boxShadow:'0 1px 6px 0 rgba(46,125,50,0.08)',
                padding:'22px 12px',
                textAlign:'center',
                border:`2px solid ${sec.color}`
              }}>
                <div style={{fontWeight:700, fontSize:'1.08rem', color:sec.color, marginBottom:10}}>{sec.label}</div>
                <div style={{fontWeight:900, fontSize:'2.1rem', color:sec.color}}>
                  {porcentajes[sec.key] !== undefined && !isNaN(porcentajes[sec.key]) ? porcentajes[sec.key].toFixed(1) + ' %' : '—'}
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div style={{marginTop:32, fontWeight:500, color:'#616161', fontSize:'1rem'}}>
          Los indicadores muestran el porcentaje de avance por cada sección, comparables entre sí.
        </div>
      </CardBody>
    </Card>
  );
}

export default ResumenGlobal;
