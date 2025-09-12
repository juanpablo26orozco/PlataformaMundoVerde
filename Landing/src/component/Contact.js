import React, { Component } from "react";
import { Link } from "react-router-dom";

//import icon
import FeatherIcon from "feather-icons-react";
import { Col, Container, Form, Input, Label, Row } from "reactstrap";

//import images
import contact from "../assets/images/contact.png";

export default class Contact extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section" id="contact">
          <Container>
            <Row>
              <Col lg={6}>
                <h2 className="fw-bold mb-4">Get in Touch</h2>
                <p className="text-muted mb-5">
                  Et harum quidem rerum facilis est expedita distinctio
                  temporecum soluta nobis est eligendi optio cumque nihil
                  impedit quo minus maxime.
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
                            Name
                          </Label>
                          <Input
                            name="name"
                            id="name"
                            type="text"
                            className="form-control"
                            placeholder="Enter name*"
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-4">
                          <Label
                            htmlFor="email"
                            className="text-muted form-label"
                          >
                            Email
                          </Label>
                          <Input
                            name="email"
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter email*"
                          />
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-4">
                          <Label
                            htmlFor="subject"
                            className="text-muted form-label"
                          >
                            Subject
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            placeholder="Enter Subject.."
                          />
                        </div>

                        <div className="mb-4 pb-2">
                          <Label
                            htmlFor="comments"
                            className="text-muted form-label"
                          >
                            Message
                          </Label>
                          <textarea
                            name="comments"
                            id="comments"
                            rows="4"
                            className="form-control"
                            placeholder="Enter message..."
                          ></textarea>
                        </div>
                        <Link to="#">
                        <button
                          type="submit"
                          name="send"

                          className="btn btn-outline-primary"
                        >
                          Send Message
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
                        className="me-2 text-muted icon icon-xs"
                      />
                    </i>{" "}
                    Support@info.com
                  </p>
                  <p className="text-muted mb-3">
                    <i>
                      <FeatherIcon
                        icon="phone"
                        className="me-2 text-muted icon icon-xs"
                      />
                    </i>{" "}
                    +91 123 4556 789
                  </p>
                  <p className="text-muted mb-3">
                    <i>
                      <FeatherIcon
                        icon="map-pin"
                        className="me-2 text-muted icon icon-xs"
                      />
                    </i>{" "}
                    2976 Edwards Street Rocky Mount, NC 27804
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
