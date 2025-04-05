import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import UserStats from '../components/UserStats';
import ValvulaGraficas from "./valvulas/ValvulaGraficas";
import RiegoGrafico from "./riego/RiegoGrafico";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown, Card, ButtonGroup } from 'react-bootstrap';
import { FaTemperatureHigh, FaUserCog, FaSignOutAlt, FaUsers, FaMicrochip, FaWater, FaWrench, FaSun, FaTint, FaTable } from 'react-icons/fa';
import backgroundImage from "../img/dash.jpg";

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
                const response = await fetch("https://18.191.201.190/api/usuarios");
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        // Función para obtener las válvulas
        const fetchValvulas = async () => {
            try {
                const response = await fetch("https://18.191.201.190/api/valvulas/");
                const data = await response.json();
                setValvulas(data);
            } catch (error) {
                console.error("Error al obtener válvulas:", error);
            }
        };

        // Función para obtener riegos
        const fetchRiegos = async () => {
            try {
                const response = await axios.get('https://18.191.201.190/api/riegos');
                const data = await response.data;
                setRiegos(data);
            } catch (error) {
                console.error('Error al obtener los riegos:', error);
            }
        };

        // Función para obtener los sensores
        const fetchSensores = async () => {
            try {
                const response = await fetch("https://18.191.201.190/api/sensores");
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
                backgroundImage: 'url("https://i.pinimg.com/736x/35/e0/a0/35e0a0c69d1af9405065ad01c658da10.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                color: '#fff',
                paddingTop: '56px',
            }}
        >
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <h5>MI SISTEMA</h5>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                        <Button
                                variant="link"
                                href={`/editUsuarios/${usuario.id}`}
                                style={{
                                    backgroundColor: 'Black', // Dark green background
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
                                src={`https://18.191.201.190/uploads/${usuario.foto}`}
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

                    <Container fluid style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center", // Centramos el contenido verticalmente
                        minHeight: "100vh",
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        padding: 2,
                        color: "black",
                        transition: "transform 0.3s ease-in-out", // Agrega una transición suave al cargar el formulario
                        "&:hover": {
                            transform: "scale(1.05)", // Aplicamos un zoom suave al pasar el cursor por encima
                        },
                    }}>
                        {/* Navbar */}
                        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                            <Container>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        <Nav.Link href="/usuarios"><FaUsers /> Administrar Usuarios</Nav.Link>
                                        <Nav.Link href="/sensores"><FaMicrochip /> Administrar Sensores</Nav.Link>
                                        <Nav.Link href="/riego"><FaWater /> Administrar Riego</Nav.Link>
                                        <Nav.Link href="/valvula"><FaWrench /> Administrar Válvulas</Nav.Link>
                                        <Nav.Link onClick={handleLogout}><FaSignOutAlt /> Cerrar sesión</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>

                        {/* Contenido del Dashboard */}
                        <Container className="mt-5 pt-3" >
                            <img
                                src={`https://18.191.201.190/uploads/${usuario.foto}`}
                                alt={usuario.nombre}
                                style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: '20px' }}
                            />
                            <h2 className="text-center text-white">Bienvenid@, {usuario.nombre}</h2>
                            <h6 className="text-center text-white">Haz accedido como Administrador</h6>
                            <Button
                                variant="link"
                                href={`/editUsuarios/${usuario.id}`}
                                style={{
                                    backgroundColor: '#006400', // Dark green background
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
                            <Row className="mt-4">
                                <Col md={3}>
                                    <Card className="p-3 text-white shadow-sm" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                        <Card.Body>
                                            <FaUsers size={30} />
                                            <h5 className="mt-3">Usuarios Registrados</h5>
                                            <h2>{usuarios.length}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="p-3 text-white shadow-sm" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                        <Card.Body>
                                            <FaMicrochip size={30} />
                                            <h5 className="mt-3">Sensores Registrados</h5>
                                            <h2>{sensores.length}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="p-3 text-white shadow-sm" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                        <Card.Body>
                                            <FaWater size={30} />
                                            <h5 className="mt-3">Riegos Registrados</h5>
                                            <h2>{riegos.length}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="p-3 text-white shadow-sm" style={{ backgroundColor: 'transparent', border: 'none' }}>
                                        <Card.Body>
                                            <FaWrench size={30} />
                                            <h5 className="mt-3">Válvulas Registradas</h5>
                                            <h2>{valvulas.length}</h2>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col md={6}>
                                    <UserStats usuarios={usuarios} />
                                </Col>
                                <Col md={6}>
                                    <ValvulaGraficas valvulas={valvulas} />
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col md={12}>
                                    <RiegoGrafico riegos={riegos} />
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                );

            case "Sistema":
                return (
                    <div
                    style={{
                        backgroundImage: 'url("https://i.pinimg.com/736x/4b/58/a8/4b58a8d613a8ee1ea2ee1ad1f83f2d27.jpg")',
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
                                        src={`https://18.191.201.190/uploads/${usuario.foto}`}
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
