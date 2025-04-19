import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Carousel, Button, Row, Col, Card } from "react-bootstrap";
import { FaHome, FaCogs, FaInfoCircle, FaSignInAlt, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGithub } from 'react-icons/fa';

const imagen1 = "https://i.pinimg.com/736x/23/76/c4/2376c4cb820a87243588cbcc67056a2f.jpg";
const video1 = "https://videocdn.cdnpk.net/videos/cccbb392-77c0-4759-a5ae-6800e085cc34/horizontal/previews/clear/large.mp4?token=exp=1745093128~hmac=a00f4ffb790ef5bd3b3958805cb4789ddc459f46e80c199e2d02445fbb913e0f";
const video2 = "https://videocdn.cdnpk.net/videos/af8f5d9c-73f3-473e-b16a-ee6a11c1fc2e/horizontal/previews/clear/large.mp4?token=exp=1745091764~hmac=77a403e951ce753b5e424f6af148ad4513153253e184780fd7e1e6f7b1fa0090";

const PagPrincipal = () => {
    return (
        <div>
            <style>
                {`
                    .card-hover:hover {
                        transform: scale(1.05);
                        transition: transform 0.3s ease-in-out;
                        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
                    }

                    .icon-card {
                        font-size: 30px;
                        color: rgba(0, 128, 0, 0.6);
                        margin-bottom: 10px;
                    }

                    .icon-card:hover {
                        color: rgba(0, 128, 0, 1);
                        transition: color 0.3s ease;
                    }

                    .btn-card {
                        background-color: #28a745;
                        border: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        transition: background-color 0.3s ease;
                    }

                    .btn-card:hover {
                        background-color: #218838;
                    }

                    .card-body:hover .icon-card {
                        opacity: 1;
                    }

                    .navbar-nav .nav-link:hover {
                        background-color: rgba(0, 128, 0, 0.2);
                        border-radius: 4px;
                    }

                    footer {
                        background-color: #333;
                        color: white;
                        padding: 30px 0;
                        box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
                    }

                    footer a {
                        text-decoration: none;
                        color: white;
                        transition: color 0.3s ease;
                    }

                    footer a:hover {
                        color: #28a745;
                    }

                    footer .social-icons a {
                        font-size: 24px;
                        margin-right: 15px;
                        transition: transform 0.3s ease;
                    }

                    footer .social-icons a:hover {
                        transform: scale(1.2);
                    }

                    footer .text-center {
                        text-align: center;
                    }

                    footer .footer-col {
                        transition: transform 0.3s ease;
                    }

                    footer .footer-col:hover {
                        transform: translateY(-5px);
                    }

                    .footer-line {
                        border-bottom: 1px solid #28a745;
                        margin: 10px 0;
                        width: 40px;
                    }

                    .footer-icon {
                        font-size: 18px;
                        margin-right: 10px;
                    }

                    .footer-icon:hover {
                        color: #28a745;
                    }

                    .github-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: 2px solid #28a745;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }

                    .github-avatar:hover {
                        transform: scale(1.1);
                    }

                    .footer-col a:hover span {
                        color: #28a745;
                        text-decoration: underline;
                    }
                `}
            </style>

            <Navbar bg="success" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="#">SEMAICF</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="me-auto">
                            <Nav.Link href="#"><FaHome /> Inicio</Nav.Link>
                            <Nav.Link href="/sesion"><FaCogs /> Sistema</Nav.Link>
                            <Nav.Link href="https://iris050709.github.io/SEMAICF/"><FaInfoCircle /> Sobre nosotros</Nav.Link>
                            <Nav.Link href="/sesion"><FaSignInAlt /> Iniciar sesión</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={imagen1}
                        alt="First slide"
                        style={{ objectFit: "cover", height: "400px" }}
                    />
                    <Carousel.Caption>
                        <h3 style={{ fontWeight: "700" }}>Bienvenido a SEMAICF</h3>
                        <p style={{ fontWeight: "400" }}>Gestiona y controla el riego de tus plantas de forma automática.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <video
                        className="d-block w-100"
                        src={video1}
                        autoPlay
                        loop
                        muted
                        style={{ objectFit: "cover", height: "400px" }}
                        title="Video sobre riego inteligente"
                    />
                    <Carousel.Caption>
                        <h3 style={{ fontWeight: "700" }}>Riego Inteligente</h3>
                        <p style={{ fontWeight: "400" }}>Transformamos el riego con tecnología inteligente, optimizando recursos y cuidando el medio ambiente.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <video
                        className="d-block w-100"
                        src={video2}
                        autoPlay
                        loop
                        muted
                        style={{ objectFit: "cover", height: "400px" }}
                        title="Video sobre energías limpias"
                    />
                    <Carousel.Caption>
                        <h3 style={{ fontWeight: "700" }}>Energías Limpias</h3>
                        <p style={{ fontWeight: "400" }}>Un riego eficiente y amigable con el medio ambiente, impulsado por la energía solar.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="my-5">
                <Row>
                    <Col md={4}>
                        <Card className="card-hover">
                            <Card.Body>
                                <FaCogs className="icon-card" />
                                <Card.Title>Conoce Nuestro Sistema</Card.Title>
                                <Card.Text>
                                    Descubre cómo nuestro sistema de riego SEMAICF puede transformar tu jardín, optimizando recursos hidricos.
                                </Card.Text>
                                <Button variant="success" className="btn-card" href="/proyecto">Ver detalles</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card-hover">
                            <Card.Body>
                                <FaInfoCircle className="icon-card" />
                                <Card.Title>Sobre Nosotros</Card.Title>
                                <Card.Text>
                                    Conoce nuestra historia, misión y visión. Comprometidos con ofrecer un servicio responsable y sostenible.
                                </Card.Text>
                                <Button variant="success" className="btn-card" href="https://iris050709.github.io/SEMAICF/">Ver historial</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card-hover">
                            <Card.Body>
                                <FaCogs className="icon-card" />
                                <Card.Title>Servicios de Instalación</Card.Title>
                                <Card.Text>
                                    Nos aseguramos que tu sistema de riego funcione de manera óptima desde el primer día.
                                </Card.Text>
                                <Button variant="success" className="btn-card" href="/instalacion">Contactanos</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <footer>
                <Container>
                    <Row>
                        <Col md={4} className="footer-col">
                            <h5><FaFacebook className="footer-icon" /> Síguenos:</h5>
                            <div className="social-icons">
                                <a href="https://facebook.com" style={{ color: "#3b5998" }}><FaFacebook /></a>
                                <a href="https://twitter.com" style={{ color: "#00acee" }}><FaTwitter /></a>
                                <a href="https://instagram.com" style={{ color: "#C13584" }}><FaInstagram /></a>
                            </div>
                            <div className="footer-line"></div>
                        </Col>

                        <Col md={4} className="footer-col">
                            <h5><FaMapMarkerAlt className="footer-icon" /> Contacto:</h5>
                            <p>Atarasquillo, Lerma, Mexico</p>
                            <p><FaPhoneAlt className="footer-icon" /> +52 722 501 4319</p>
                            <p><FaEnvelope className="footer-icon" /><a href="mailto:SEMAICF@gmail.com">SEMAICF@gmail.com</a></p>
                            <div className="footer-line"></div>
                        </Col>

                        <Col md={4} className="footer-col">
                            <h5><FaInfoCircle className="footer-icon" /> Desarrolladores:</h5>

                            <div className="d-flex align-items-center mb-3">
                                <a href="https://github.com/iris050709" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white">
                                    <img src="https://github.com/iris050709.png" alt="Iris GitHub" className="github-avatar me-2" />
                                    <span>Iris Cruz Clemente</span>
                                </a>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <a href="https://github.com/fernandaAgustin" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white">
                                    <img src="https://github.com/fernandaAgustin.png" alt="Fernanda GitHub" className="github-avatar me-2" />
                                    <span>Fernanda Agustin Osorio</span>
                                </a>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <a href="https://github.com/CesarMorales19" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white">
                                    <img src="https://github.com/CesarMorales1.png" alt="Cesar GitHub" className="github-avatar me-2" />
                                    <span>Cesar Morales Perez</span>
                                </a>
                            </div>

                            <div className="footer-line"></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center mt-3">
                            <p>© 2024 SEMAICF Todos los derechos reservados.</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

export default PagPrincipal;
