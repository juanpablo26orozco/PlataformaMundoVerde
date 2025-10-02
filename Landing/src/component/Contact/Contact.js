import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from 'react-i18next';

//import icon
import FeatherIcon from "feather-icons-react";
import { Col, Container, Form, Input, Label, Row } from "reactstrap";

//import images
import contact from "../../assets/images/contact.png";

class Contact extends Component {
  render() {
    const { t } = this.props;
    
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
                  <Form method="post" name="myForm">
                    <p id="error-msg"></p>
                    <div id="simple-msg"></div>
                    <Row>
                      <Col lg={6}>
                        <div className="mb-4">
                          <Label
                            htmlFor="name"
                            className="text-muted form-label"
                          >
                            {t('contact.name')}
                          </Label>
                          <Input
                            name="name"
                            id="name"
                            type="text"
                            className="form-control"
                            placeholder={t('contact.namePlaceholder')}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-4">
                          <Label
                            htmlFor="email"
                            className="text-muted form-label"
                          >
                            {t('contact.email')}
                          </Label>
                          <Input
                            name="email"
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder={t('contact.emailPlaceholder')}
                          />
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
                          />
                        </div>

                        <div className="mb-4 pb-2">
                          <Label
                            htmlFor="comments"
                            className="text-muted form-label"
                          >
                            {t('contact.message')}
                          </Label>
                          <textarea
                            name="comments"
                            id="comments"
                            rows="4"
                            className="form-control"
                            placeholder={t('contact.messagePlaceholder')}
                          ></textarea>
                        </div>
                        <Link to="#">
                        <button
                          type="submit"
                          name="send"
                          className="btn btn-success"
                        >
                          {t('contact.sendButton')}
                        </button>
                        </Link>
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
  }
}

export default withTranslation()(Contact);
