import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Carousel, Button, Row, Col, Card } from "react-bootstrap";
import { FaHome, FaCogs, FaInfoCircle, FaSignInAlt, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Importar iconos de React Icons

// Importar imágenes y video desde src/img
import imagen1 from "../img/i1.webp";
const video1 = "https://media.istockphoto.com/id/696885278/video/two-gardeners-analyzing-flower-growth-in-the-greenhouse.mp4?s=mp4-640x640-is&k=20&c=4o32hN1SmVeaaEhq-e_iEEmGZAgj01rwMS3MjiRIl3M=";
const video2 = "https://media.istockphoto.com/id/1460856874/video/close-up-of-modern-photovoltaic-solar-battery-rows-of-sustainable-energy-solar-panels.mp4?s=mp4-640x640-is&k=20&c=DCpz6y708Iihtg7WFx1ZWnzh29mUoHvcnJiZu2ZXCfk="; // Importar el video

const PagPrincipal = () => {
    return (
        <div>
            {/* CSS inline */}
            <style>
                {`
                    /* Efecto al pasar el cursor por encima del Card */
                    .card-hover:hover {
                        transform: scale(1.05); /* Aumenta ligeramente el tamaño */
                        transition: transform 0.3s ease-in-out; /* Suaviza la transición */
                        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* Agrega una sombra sutil */
                    }

                    /* Estilo para los iconos dentro de los Cards */
                    .icon-card {
                        font-size: 30px; /* Tamaño del icono */
                        color: rgba(0, 128, 0, 0.6); /* Verde transparente */
                        margin-bottom: 10px; /* Espacio entre el icono y el texto */
                    }

                    /* Efecto de hover sobre el icono */
                    .icon-card:hover {
                        color: rgba(0, 128, 0, 1); /* Verde sólido cuando el cursor está encima */
                        transition: color 0.3s ease;
                    }

                    /* Personalización del botón */
                    .btn-card {
                        background-color: #28a745; /* Verde Bootstrap */
                        border: none; /* Sin borde */
                        padding: 10px 20px;
                        font-size: 16px;
                        transition: background-color 0.3s ease; /* Transición suave en el color */
                    }

                    /* Efecto de hover sobre el botón */
                    .btn-card:hover {
                        background-color: #218838; /* Verde más oscuro cuando pasa el cursor */
                    }

                    /* Efecto de opacidad para iconos */
                    .card-body:hover .icon-card {
                        opacity: 1; /* Hacer el icono completamente visible cuando se pasa el cursor */
                    }

                    /* Efecto de hover en Navbar */
                    .navbar-nav .nav-link:hover {
                        background-color: rgba(0, 128, 0, 0.2); /* Fondo verde transparente al pasar el cursor */
                        border-radius: 4px; /* Borde redondeado */
                    }

                    /* Estilos para el pie de página */
                    footer {
                        background-color: #333; /* Gris oscuro */
                        color: white;
                        padding: 30px 0;
                        box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1); /* Sombra ligera */
                    }

                    footer a {
                        text-decoration: none;
                        color: white;
                        transition: color 0.3s ease; /* Transición de color */
                    }

                    footer a:hover {
                        color: #28a745; /* Verde para iconos y enlaces al pasar el cursor */
                    }

                    footer .social-icons a {
                        font-size: 24px;
                        margin-right: 15px;
                        transition: transform 0.3s ease; /* Efecto de transición de los iconos sociales */
                    }

                    footer .social-icons a:hover {
                        transform: scale(1.2); /* Aumenta ligeramente el tamaño del icono al pasar el cursor */
                    }

                    footer .text-center {
                        text-align: center;
                    }

                    footer .footer-col {
                        transition: transform 0.3s ease; /* Transición de transformación */
                    }

                    footer .footer-col:hover {
                        transform: translateY(-5px); /* Eleva ligeramente los textos al pasar el cursor */
                    }

                    /* Estilo de línea de separación */
                    .footer-line {
                        border-bottom: 1px solid #28a745; /* Línea verde */
                        margin: 10px 0; /* Espaciado */
                        width: 40px; /* Ancho de la línea */
                    }

                    /* Estilo de iconos pequeños y su alineación */
                    .footer-icon {
                        font-size: 18px;
                        margin-right: 10px;
                    }

                    .footer-icon:hover {
                        color: #28a745; /* Verde para iconos al pasar el cursor */
                    }
                `}
            </style>

            {/* Menú de Navegación utilizando react-bootstrap */}
            <Navbar bg="success" variant="dark" expand="lg" >
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

            {/* Imagenes/Videos */}
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={imagen1}
                        alt="First slide"
                        style={{ objectFit: "cover", height: "400px" }}  // Ajustar altura y mantener proporciones
                    />
                    <Carousel.Caption style={{ fontFamily: "'Roboto', sans-serif" }}>
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
                        style={{ objectFit: "cover", height: "400px" }}  // Ajustar altura y mantener proporciones
                    />
                    <Carousel.Caption style={{ fontFamily: "'Roboto', sans-serif" }}>
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
                        style={{ objectFit: "cover", height: "400px" }}  // Ajustar altura y mantener proporciones
                    />
                    <Carousel.Caption style={{ fontFamily: "'Roboto', sans-serif" }}>
                        <h3 style={{ fontWeight: "700" }}>Energías Limpias</h3>
                        <p style={{ fontWeight: "400" }}>Un riego eficiente y amigable con el medio ambiente, impulsado por la energía solar.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* Contenedores dinámicos */}
            <Container className="my-5">
                <Row>
                    <Col md={4}>
                        <Card className="card-hover">
                            <Card.Body>
                                <FaCogs className="icon-card" />
                                <Card.Title>Conoce Nuestro Sistema</Card.Title>
                                <Card.Text>
                                    Descubre cómo nuestro sistema de riego SIMAICF puede transformar tu jardín, optimizando recursos hidricos.
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

            {/* Pie de página */}
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
                            <p>Atarrasquillo, Lerma, Mexico</p>
                            <p><FaPhoneAlt className="footer-icon" /> +52 722 5014319</p>
                            <p><FaEnvelope className="footer-icon" /><a href="mailto:SIMAICF@gmail.com">SIMAICF@gmail.com</a></p>
                            <div className="footer-line"></div>
                        </Col>
                        <Col md={4} className="footer-col">
                            <h5><FaInfoCircle className="footer-icon" /> Desarrolladores:</h5>
                            <p>Iris Cruz Clemente</p>
                            <p>Fernanda Agustin Osorio</p>
                            <p>Cesar Morales Perez</p>
                            <div className="footer-line"></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center mt-3">
                            <p>© 2024 SIMAICF Todos los derechos reservados.</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

export default PagPrincipal;
