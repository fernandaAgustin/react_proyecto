import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import UserStats from '../components/UserStats';
import ValvulaGraficas from "./valvulas/ValvulaGraficas";
import RiegoGrafico from "./riego/RiegoGrafico";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown, Card, ButtonGroup } from 'react-bootstrap';
import { FaTemperatureHigh, FaUserCog, FaSignOutAlt, FaUsers, FaMicrochip, FaWater, FaWrench, FaSun, FaTint, FaTable } from 'react-icons/fa';
import backgroundImage from "../img/admin.png";

const PerfilUsuario = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [valvulas, setValvulas] = useState([]);
    const [riegos, setRiegos] = useState([]);
    const [sensores, setSensores] = useState([]); // Añadimos estado para sensores

    useEffect(() => {
        const datosUsuario = localStorage.getItem("usuario");
        if (datosUsuario) {
            try {
                const usuarioParseado = JSON.parse(datosUsuario);
                setUsuario(usuarioParseado);
            } catch (error) {
                console.error("Error al parsear usuario:", error);
                navigate("/"); // Redirigir al login si ocurre un error
            }
        } else {
            navigate("/"); // Redirigir al login si no hay datos de usuario
        }

        // Función para obtener los usuarios
        const fetchUsuarios = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/usuarios");
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        // Función para obtener las válvulas
        const fetchValvulas = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/valvulas/");
                const data = await response.json();
                setValvulas(data);
            } catch (error) {
                console.error("Error al obtener válvulas:", error);
            }
        };

        // Función para obtener riegos
        const fetchRiegos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/riegos');
                const data = await response.data;
                setRiegos(data);
            } catch (error) {
                console.error('Error al obtener los riegos:', error);
            }
        };

        // Función para obtener los sensores
        const fetchSensores = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/sensores");
                const data = await response.json();
                setSensores(data);
            } catch (error) {
                console.error("Error al obtener sensores:", error);
            }
        };

        // Llamamos las funciones para obtener datos
        fetchUsuarios();
        fetchValvulas();
        fetchRiegos();
        fetchSensores(); // Llamamos la función para obtener los sensores

    }, [navigate]);

    if (!usuario) {
        return <p>Cargando...</p>;
    }

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    const renderProfileContent = () => {
        if (!usuario || !usuario.rol) {
            return <p>Rol no válido. Redirigiendo...</p>;
        }

        switch (usuario.rol) {
            case "Usuario":
                return (
                    <div
                        style={{
                            backgroundImage: 'url("https://i.pinimg.com/736x/01/7f/7c/017f7c711c5945e3217b2af2b5f84bfb.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '100vh',
                            color: '#fff',
                            paddingTop: '56px',
                        }}
                    >
                        <Navbar bg="transparent" variant="dark" expand="lg" fixed="top" className="shadow">
                            <Container>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <h5 >MI SISTEMA</h5>
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="ms-auto">
                                        <Button
                                            bg="transparent"
                                            variant="link"
                                            href={`/editUsuarios/${usuario.id}`}
                                            style={{
                                                color: 'white', // White text color
                                                padding: '8px 16px', // Padding around the text
                                                border: 'none', // Remove border
                                                borderRadius: '5px', // Rounded corners
                                                fontSize: '16px', // Font size
                                                textDecoration: 'none', // Remove underline for the link
                                                display: 'inline-flex', // Keep the content inline
                                                alignItems: 'center', // Center icon and text vertically
                                            }}
                                        >
                                            <FaUserCog style={{ marginRight: '8px' }} /> Editar perfil
                                        </Button>
                                        <Nav.Link onClick={handleLogout} className="text-white">
                                            <FaSignOutAlt /> Cerrar sesión
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>

                        <Container className="text-center pt-5">
                            <Row className="justify-content-center">
                                <Col xs={12} md={6}>
                                    <div className="bg-dark bg-opacity-50 p-4 rounded shadow">
                                        <img
                                            src={`http://localhost:3000/uploads/${usuario.foto}`}
                                            alt={usuario.nombre}
                                            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                                            className="mb-3"
                                        />
                                        <h2 className="fw-light">Bienvenid@</h2>
                                        <h4 className="fw-bold">{usuario.nombre}</h4>
                                        <p className="fst-italic">Has accedido como Usuario</p>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mt-5 justify-content-center">
                                {[
                                    { href: '/temperatura', variant: 'primary', icon: <FaTemperatureHigh size={28} />, text: 'Temperatura' },
                                    { href: '/agua', variant: 'info', icon: <FaWater size={28} />, text: 'LLuvia' },
                                    { href: '/luz', variant: 'warning', icon: <FaSun size={28} />, text: 'Luz' },
                                    { href: '/humedad', variant: 'success', icon: <FaTint size={28} />, text: 'Humedad' },
                                ].map((btn, idx) => (
                                    <Col xs={10} sm={6} md={3} className="mb-4" key={idx}>
                                        <Button
                                            href={btn.href}
                                            variant={btn.variant}
                                            className="w-100 py-4 shadow-sm rounded-4"
                                            style={{
                                                backdropFilter: 'blur(10px)',
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                transition: 'transform 0.3s ease, background 0.3s',
                                            }}
                                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        >
                                            <div className="mb-2">{btn.icon}</div>
                                            <h6 className="m-0">{btn.text}</h6>
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </div>



                );
            case "Administrador":
                return (

                    <div
                        style={{
                            backgroundImage: 'url("https://i.pinimg.com/736x/2d/36/85/2d3685a4ecd4912b675aad67d09930c6.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '100vh',
                            paddingTop: '70px',
                        }}
                    >
                        {/* Navbar */}
                        <Navbar
                            bg="transparent"
                            variant="dark"
                            expand="lg"
                            fixed="top"
                            className="shadow"
                            style={{
                                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', // Más sombra para el efecto flotante
                                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo negro con algo de transparencia para hacer que flote
                                color: 'black', // El texto será blanco para resaltar sobre el fondo oscuro
                            }}
                        >
                            <Container>
                                <Navbar.Brand style={{ color: '#00cc66', fontWeight: 'bold' }}>
                                    🌿 SEMAICF
                                </Navbar.Brand>
                                <Navbar.Toggle />
                                <Navbar.Collapse>
                                    <Nav className="ms-auto">
                                        <Nav.Link href="/usuarios" style={{ color: 'black' }}><FaUsers /> Usuarios</Nav.Link>
                                        <Nav.Link href="/sensores" style={{ color: 'black' }}><FaMicrochip /> Sensores</Nav.Link>
                                        <Nav.Link href="/riego" style={{ color: 'black' }}><FaWater /> Riego</Nav.Link>
                                        <Nav.Link href="/valvula" style={{ color: 'black' }}><FaWrench /> Válvulas</Nav.Link>
                                        <Nav.Link onClick={handleLogout} style={{ color: 'black' }}><FaSignOutAlt /> Cerrar sesión</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>

                        {/* Contenido */}
                        <Container className="text-center text-light">
                            <img
                                src={`http://localhost:3000/uploads/${usuario.foto}`}
                                alt={usuario.nombre}
                                className="rounded-circle my-3"
                                style={{ width: 120, height: 120 }}
                            />
                            <h2 style={{ color: "black" }}>Bienvenid@, {usuario.nombre} </h2>
                            <h6 style={{ color: "black" }}>Has accedido como Administrador</h6>
                            <Button
                                href={`/editUsuarios/${usuario.id}`}
                                style={{
                                    backgroundColor: '#00cc66',
                                    color: '#fff',
                                    border: 'none',
                                    marginTop: 10
                                }}
                            >
                                <FaUserCog className="me-2" /> Editar perfil
                            </Button>

                            {/* Tarjetas de resumen */}
                            <Row className="mt-5">
                                {[
                                    { title: 'Usuarios', icon: <FaUsers />, count: usuarios.length },
                                    { title: 'Sensores', icon: <FaMicrochip />, count: sensores.length },
                                    { title: 'Riegos', icon: <FaWater />, count: riegos.length },
                                    { title: 'Válvulas', icon: <FaWrench />, count: valvulas.length },
                                ].map((item, i) => (
                                    <Col key={i} xs={12} sm={6} md={3} className="mb-4">
                                        <Card
                                            className="text-center text-light h-100 shadow-sm"
                                            style={{ backgroundColor: 'rgba(109, 109, 109, 0.6)', border: '2px solid rgb(61, 135, 99)' }}
                                        >
                                            <Card.Body>
                                                <div style={{ fontSize: 30, marginBottom: 10 }}>{item.icon}</div>
                                                <h5>{item.title}</h5>
                                                <h2>{item.count}</h2>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* Gráficas */}
                            <Row className="mt-4">
                                <Col xs={12} md={6} className="mb-4">
                                    <UserStats usuarios={usuarios} />
                                </Col>
                                <Col xs={12} md={6} className="mb-4">
                                    <ValvulaGraficas valvulas={valvulas} />
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xs={12}>
                                    <RiegoGrafico riegos={riegos} />
                                </Col>
                            </Row>
                        </Container>
                    </div>

                );

            case "Sistema":
                return (
                    <div
                        style={{
                            backgroundImage: 'url("https://i.pinimg.com/736x/44/12/91/441291f95e7f3f5b9ed94977e00b1980.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '100vh',
                            paddingTop: '50px',
                            paddingBottom: '50px',
                            color: '#fff',
                        }}
                    >
                        <Container>
                            <div className="bg-dark bg-opacity-75 p-5 rounded-4 shadow-lg">
                                <h2 className="text-center mb-4">Supervisor del Sistema de Riego</h2>
                                <Row className="align-items-center">
                                    <Col md={4} className="text-center mb-3 mb-md-0">
                                        <img
                                            src={`http://localhost:3000/uploads/${usuario.foto}`}
                                            alt={usuario.nombre}
                                            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <h4 className="mt-3">{usuario.nombre}</h4>
                                    </Col>
                                    <Col md={8}>
                                        <ul className="list-unstyled">
                                            <li className="mb-2">
                                                <Button variant="outline-light" href={`/editUsuarios/${usuario.id}`} className="w-100 text-start">
                                                    <FaUserCog className="me-2" /> Editar perfil
                                                </Button>
                                            </li>
                                            <li className="mb-2">
                                                <Button variant="outline-danger" onClick={handleLogout} className="w-100 text-start">
                                                    <FaSignOutAlt className="me-2" /> Cerrar sesión
                                                </Button>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>

                                <hr className="border-light my-4" />

                                <Row className="text-center">
                                    {[
                                        { href: '/aguasis', icon: <FaWater size={24} />, text: 'LLUVIA' },
                                        { href: '/tablaluz', icon: <FaSun size={24} />, text: 'ILUMINACIÓN' },
                                        { href: '/tablatem', icon: <FaTemperatureHigh size={24} />, text: 'AMBIENTE' },
                                        { href: '/shumedad', icon: <FaTint size={24} />, text: 'HUMEDAD' },
                                    ].map((btn, idx) => (
                                        <Col xs={12} sm={6} md={4} className="mb-3" key={idx}>
                                            <Button
                                                href={btn.href}
                                                variant="light"
                                                className="w-100 py-3 rounded-3 shadow-sm"
                                                style={{
                                                    transition: 'transform 0.3s ease, background 0.3s',
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                            >
                                                {btn.icon}
                                                <div className="mt-2">{btn.text}</div>
                                            </Button>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Container>
                    </div>
                );

            default:
                return <p>Rol no reconocido</p>;
        }
    };

    return (
        <div>
            {renderProfileContent()}
        </div>
    );
};

export default PerfilUsuario;
