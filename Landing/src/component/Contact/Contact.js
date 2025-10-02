import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

//import icon
import FeatherIcon from "feather-icons-react";
import { Col, Container, Form, Input, Label, Row, Alert } from "reactstrap";

//import images
import contact from "../../assets/images/contact.png";

// Import config
import config from "../../utils/envConfig";

const Contact = () => {
  const { t } = useTranslation();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el teléfono, formatear y validar
    if (name === 'phone') {
      // Solo permitir números y el símbolo +
      const cleaned = value.replace(/[^\d+]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validar teléfono colombiano
  const validatePhone = (phone) => {
    // Remover espacios y guiones
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Formatos válidos:
    // +573001234567 (13 dígitos con +57)
    // 573001234567 (12 dígitos)
    // 3001234567 (10 dígitos - se asume +57)
    
    const patterns = [
      /^\+57[3][0-9]{9}$/,  // +573001234567
      /^57[3][0-9]{9}$/,    // 573001234567
      /^[3][0-9]{9}$/       // 3001234567
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.validation.nameRequired');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('contact.validation.phoneRequired');
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t('contact.validation.phoneInvalid');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.validation.messageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar por WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    // Obtener configuración desde variables de entorno (centralizado)
    const companyWhatsApp = config.whatsappNumber;
    const companyName = config.companyName;
    
    // Formatear mensaje para WhatsApp
    const whatsappMessage = `
🌱 *Contacto desde ${companyName}*

👤 *Nombre:* ${formData.name}
📱 *Teléfono:* ${formData.phone}
${formData.subject ? `📋 *Asunto:* ${formData.subject}\n` : ''}
💬 *Mensaje:*
${formData.message}
    `.trim();
    
    // Construir URL de WhatsApp
    const whatsappUrl = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Mostrar mensaje de éxito
    setSuccessMessage(t('contact.validation.success'));
    
    // Limpiar formulario después de 2 segundos
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSuccessMessage('');
    }, 2000);
  };
  
  return (
    <React.Fragment>
      <section className="section" id="contact">
        <Container>
          <Row>
            <Col lg={6}>
              <h2 className="fw-bold mb-4">{t('contact.title')}</h2>
              <p className="text-muted mb-5">
                {t('contact.subtitle')}
              </p>

              <div>
                <Form onSubmit={handleSubmit} name="myForm">
                  {successMessage && (
                    <Alert color="success" className="mb-4">
                      <FeatherIcon icon="check-circle" size={18} className="me-2" />
                      {successMessage}
                    </Alert>
                  )}
                  
                  <Row>
                    <Col lg={12}>
                      <div className="mb-4">
                        <Label
                          htmlFor="name"
                          className="text-muted form-label"
                        >
                          {t('contact.name')} <span style={{color: '#dc3545'}}>*</span>
                        </Label>
                        <Input
                          name="name"
                          id="name"
                          type="text"
                          className="form-control"
                          placeholder={t('contact.namePlaceholder')}
                          value={formData.name}
                          onChange={handleChange}
                          invalid={!!errors.name}
                        />
                        {errors.name && (
                          <div className="invalid-feedback d-block">
                            {errors.name}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="mb-4">
                        <Label
                          htmlFor="phone"
                          className="text-muted form-label"
                        >
                          {t('contact.phone')} <span style={{color: '#dc3545'}}>*</span>
                        </Label>
                        <Input
                          name="phone"
                          id="phone"
                          type="tel"
                          className="form-control"
                          placeholder={t('contact.phonePlaceholder')}
                          value={formData.phone}
                          onChange={handleChange}
                          invalid={!!errors.phone}
                          maxLength="13"
                        />
                        {errors.phone && (
                          <div className="invalid-feedback d-block">
                            {errors.phone}
                          </div>
                        )}
                        <small className="text-muted">
                          {t('contact.phoneHelper')}
                        </small>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="mb-4">
                        <Label
                          htmlFor="subject"
                          className="text-muted form-label"
                        >
                          {t('contact.subject')}
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          placeholder={t('contact.subjectPlaceholder')}
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-4 pb-2">
                        <Label
                          htmlFor="message"
                          className="text-muted form-label"
                        >
                          {t('contact.message')} <span style={{color: '#dc3545'}}>*</span>
                        </Label>
                        <textarea
                          name="message"
                          id="message"
                          rows="4"
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          placeholder={t('contact.messagePlaceholder')}
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                        {errors.message && (
                          <div className="invalid-feedback d-block">
                            {errors.message}
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-success"
                      >
                        <FeatherIcon icon="send" size={18} className="me-2" />
                        {t('contact.sendButton')}
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>

            <Col lg={5} className="ms-lg-auto">
              <div className="mt-5 mt-lg-0">
                <img src={contact} alt="" className="img-fluid d-block" />
                <p className="text-muted mt-5 mb-3">
                  <i>
                    <FeatherIcon
                      icon="mail"
                      className="me-2 text-success icon icon-xs"
                    />
                  </i>{" "}
                  {t('contact.contactEmail')}
                </p>
                <p className="text-muted mb-3">
                  <i>
                    <FeatherIcon
                      icon="phone"
                      className="me-2 text-success icon icon-xs"
                    />
                  </i>{" "}
                  {t('contact.contactPhone')}
                </p>
                <p className="text-muted mb-3">
                  <i>
                    <FeatherIcon
                      icon="map-pin"
                      className="me-2 text-success icon icon-xs"
                    />
                  </i>{" "}
                  {t('contact.contactAddress')}
                </p>
                <ul className="list-inline pt-4">
                  <li className="list-inline-item me-3">
                    <Link
                      to="#"
                      className="social-icon icon-mono avatar-xs rounded-circle"
                    >
                      <i>
                        <FeatherIcon icon="facebook" className="icon-xs" />
                      </i>{" "}
                    </Link>
                  </li>
                  <li className="list-inline-item me-3">
                    <Link
                      to="#"
                      className="social-icon icon-mono avatar-xs rounded-circle"
                    >
                      <i>
                        <FeatherIcon icon="twitter" className="icon-xs" />
                      </i>{" "}
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      to="#"
                      className="social-icon icon-mono avatar-xs rounded-circle"
                    >
                      <i>
                        <FeatherIcon icon="instagram" className="icon-xs" />
                      </i>{" "}
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Contact;
