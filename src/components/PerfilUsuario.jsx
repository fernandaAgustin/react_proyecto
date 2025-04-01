import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import UserStats from '../components/UserStats';
import ValvulaGraficas from "./valvulas/ValvulaGraficas";
import RiegoGrafico from "./riego/RiegoGrafico";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, NavDropdown } from 'react-bootstrap';
import { FaUserCog, FaSignOutAlt } from 'react-icons/fa'; // Usando íconos de react-icons


const PerfilUsuario = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [valvulas, setValvulas] = useState([]);
    const [riegos, setRiegos] = useState([]);

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

        // Llamamos las funciones para obtener datos
        fetchUsuarios();
        fetchValvulas();
        fetchRiegos();

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
                    <Container>
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/temperatura">
                                <FaUserCog /> DATOS TEMPERATURA
                            </Nav.Link>
                            <Nav.Link href="/agua">
                                <FaUserCog /> DATOS DE AGUA
                            </Nav.Link>
                            <Nav.Link href="/luz">
                                <FaUserCog /> DATOS DE LUZ
                            </Nav.Link>
                            <Nav.Link href="/humedad">
                                <FaUserCog /> DATOS DE Humedad
                            </Nav.Link>
                            <Nav.Link onClick={handleLogout}>
                                <FaSignOutAlt /> Cerrar sesión
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenido del Dashboard */}
            <Row>
                <Col mb={5} >
                <h2 className="mt-5">Bienvenid@, {usuario.nombre}</h2>
                <h6>Haz accedido como Usuario</h6>
                    <div className="text-center">
                        <img 
                            src={`http://localhost:3000/uploads/${usuario.foto}`} 
                            alt={usuario.nombre} 
                            style={{ width: 120, height: 120, borderRadius: '50%' }} 
                        />
                        <h4>{usuario.nombre}</h4>
                    </div>
                </Col>
                        </Row>
                    </Container>
                );
            case "Administrador":
                return (
            <Container>
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/usuarios">
                                <FaUserCog /> Administrar Usuarios
                            </Nav.Link>
                            <Nav.Link href="/sensores">
                                <FaUserCog /> Administrar Sensores
                            </Nav.Link>
                            <Nav.Link href="/riego">
                                <FaUserCog /> Administrar Riego
                            </Nav.Link>
                            <Nav.Link href="/valvula">
                                <FaUserCog /> Administrar Válvulas
                            </Nav.Link>
                            <Nav.Link onClick={handleLogout}>
                                <FaSignOutAlt /> Cerrar sesión
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenido del Dashboard */}
            <Row>
                <Col mb={5} >
                <h2 className="mt-5">Bienvenid@, {usuario.nombre}</h2>
                <h6>Haz accedido como Administrador</h6>
                    <div className="text-center">
                        <img 
                            src={`http://localhost:3000/uploads/${usuario.foto}`} 
                            alt={usuario.nombre} 
                            style={{ width: 120, height: 120, borderRadius: '50%' }} 
                        />
                        <h4>{usuario.nombre}</h4>
                    </div>
                </Col>
                            <Col md={8}>
                                <UserStats usuarios={usuarios} />
                                <ValvulaGraficas valvulas={valvulas} />
                                <RiegoGrafico riegos={riegos} />
                            </Col>
                        </Row>
                    </Container>
                );

            case "Sistema":
                return (
                    <Container>
                        <h2 className="my-4">Dashboard del Supervisor del Sistema de Riego</h2>
                        <Row>
                            <Col md={4}>
                                <div className="text-center">
                                    <img 
                                        src={`http://localhost:3000/uploads/${usuario.foto}`} 
                                        alt={usuario.nombre} 
                                        style={{ width: 120, height: 120, borderRadius: '50%' }} 
                                    />
                                    <h4>{usuario.nombre}</h4>
                                </div>
                            </Col>
                            <Col md={8}>
                                <ul className="list-unstyled">
                                    <li><Button variant="link" href={`/editUsuarios/${usuario.id}`}><FaUserAlt /> Editar perfil</Button></li>
                                    <li><Button variant="link" onClick={handleLogout}><FaSignOutAlt /> Cerrar sesión</Button></li>
                                </ul>
                            </Col>
                        </Row>
                    </Container>
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
