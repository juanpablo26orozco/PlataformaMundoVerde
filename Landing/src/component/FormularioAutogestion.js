import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const FormularioAutogestion = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert('Formulario enviado!');
  };

  return (
    <section style={{ background: '#f1f8e9', borderRadius: 18, boxShadow: '0 2px 16px 0 rgba(46,125,50,0.10)', padding: '44px 22px', marginTop: 40 }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 style={{ color: '#2E7D32', fontWeight: 900, fontSize: '1.5rem', marginBottom: 32 }}>Formulario de Autogestión</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" value={form.email} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label for="mensaje">Mensaje</Label>
                <Input type="textarea" name="mensaje" id="mensaje" value={form.mensaje} onChange={handleChange} required />
              </FormGroup>
              <Button color="success" type="submit">Enviar</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FormularioAutogestion;
