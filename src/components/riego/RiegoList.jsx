import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UploadExcel from './UploadExcel';
import { AppBar, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Avatar, Typography, Toolbar, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Button, TextField, Paper } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, BarChart, Logout, Edit, Delete, Add, CloudUpload, Home } from '@mui/icons-material';
import RiegoGrafico from './RiegoGrafico';
import { saveAs } from 'file-saver'; // Librería para descargar el archivo
import * as XLSX from 'xlsx'; // Importa XLSX para crear el archivo Excel


const drawerWidth = 240;

const Sidebar = ({ usuario, handleLogout }) => (
    <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                color: 'white'
            },
        }}
    >
        <Toolbar />
        <Box sx={{}}>
            <List>
                <ListItem sx={{ justifyContent: 'center' }}>
                    <Avatar src={`http://localhost:3000/uploads/${usuario.foto}`} alt={usuario.nombre} sx={{ width: 80, height: 80 }} />
                </ListItem>
                <ListItem sx={{ justifyContent: 'center' }}>
                    <Typography sx={{ color: 'white', fontWeight: 'bold', }}>{usuario.nombre}</Typography>
                </ListItem>
                <ListItemButton component="a" href="/perfil" sx={{
                    '&:hover': {
                        transform: 'scale(1.15)',
                        transition: 'transform 0.3s ease-in-out',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)'
                    }
                }}>
                    <ListItemIcon><Home sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Home" sx={{ color: 'white' }} />
                </ListItemButton>
                <ListItemButton component="a" href="/usuarios" sx={{
                    '&:hover': {
                        transform: 'scale(1.15)',
                        transition: 'transform 0.3s ease-in-out',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)'
                    }
                }}>
                    <ListItemIcon><People sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Administrar Usuarios" sx={{ color: 'white' }} />
                </ListItemButton>
                <ListItemButton component="a" href="/sensores" sx={{
                    '&:hover': {
                        transform: 'scale(1.15)',
                        transition: 'transform 0.3s ease-in-out',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)'
                    }
                }}>
                    <ListItemIcon><Speed sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Administrar Sensores" sx={{ color: 'white' }} />
                </ListItemButton>
                <ListItemButton component="a" href="/riego" sx={{
                    '&:hover': {
                        transform: 'scale(1.15)',
                        transition: 'transform 0.3s ease-in-out',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)'
                    }
                }}>
                    <ListItemIcon><Opacity sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Administrar Riego" sx={{ color: 'white' }} />
                </ListItemButton>
                <ListItemButton component="a" href="/valvula" sx={{
                    '&:hover': {
                        transform: 'scale(1.15)',
                        transition: 'transform 0.3s ease-in-out',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)'
                    }
                }}>
                    <ListItemIcon><ToggleOn sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Administrar Válvulas" sx={{ color: 'white' }} />
                </ListItemButton>
                <ListItemButton onClick={handleLogout} sx={{
                    '&:hover': {
                        transform: 'scale(1.15)',
                        transition: 'transform 0.3s ease-in-out',
                        backgroundColor: 'rgba(255, 255, 255, 0.28)'
                    }
                }}>
                    <ListItemIcon><Logout sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Cerrar sesión" sx={{ color: 'white' }} />
                </ListItemButton>
            </List>
        </Box>
    </Drawer>
);
const RiegoList = () => {
    const [usuario, setUsuario] = useState(null);
    const [riegos, setRiegos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const riegosPorPagina = 10;
    const navigate = useNavigate();
    const [busquedaValvula, setBusquedaValvula] = useState('');
    const [busquedaFecha, setBusquedaFecha] = useState('');

    useEffect(() => {
        const datosUsuario = localStorage.getItem('usuario');
        if (datosUsuario) {
            try {
                setUsuario(JSON.parse(datosUsuario));
            } catch (error) {
                console.error('Error al parsear usuario:', error);
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const obtenerRiegos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/riegos');
            setRiegos(response.data);
        } catch (error) {
            console.error('Error al obtener los riegos:', error);
        }
    };

    const eliminarRiego = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/riegos/${id}`);
            obtenerRiegos();
            alert("Riego eliminado correctamente");
        } catch (error) {
            console.error('Error al eliminar el riego:', error);
        }
    };

    const redirigirEdicion = (id) => {
        navigate(`/editar-riego/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    useEffect(() => {
        obtenerRiegos();
    }, []);

    const riegosFiltrados = riegos.filter((riego) =>
        (busquedaValvula === '' || riego.valvula_id.toString().includes(busquedaValvula)) &&
        (busquedaFecha === '' || new Date(riego.fecha_riego).toLocaleDateString().includes(busquedaFecha))
    );

    const indexOfLastRiego = currentPage * riegosPorPagina;
    const indexOfFirstRiego = indexOfLastRiego - riegosPorPagina;
    const currentRiegos = riegosFiltrados.slice(indexOfFirstRiego, indexOfLastRiego);
    const totalPages = Math.ceil(riegosFiltrados.length / riegosPorPagina);

    const exportarExcel = () => {
        // Filtrar los riegos según los criterios de búsqueda
        const riegosFiltradosParaExportar = riegos.filter((riego) =>
            (busquedaValvula === '' || riego.valvula_id.toString().includes(busquedaValvula)) &&
            (busquedaFecha === '' || new Date(riego.fecha_riego).toLocaleDateString().includes(busquedaFecha))
        );
    
        // Formatear los datos para exportar
        const data = riegosFiltradosParaExportar.map((riego) => ({
            ID: riego.id,
            Válvula: riego.valvula_id,
            'Cantidad de Agua (L)': riego.cantidad_agua,
            'Duración (min)': riego.duracion,
            Fecha: new Date(riego.fecha_riego).toLocaleDateString(),
        }));
    
        // Crear una hoja de trabajo a partir de los datos
        const ws = XLSX.utils.json_to_sheet(data);
    
        // Crear un libro de trabajo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Riegos');
    
        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, 'Lista_de_Riegos.xlsx');
    };
    

    if (!usuario) return <p>Cargando...</p>;

    return (
        <Box
            sx={{
                display: 'flex',
                background: 'white',
                minHeight: '100vh',
                color: 'black'
            }}
        >
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px}`, backgroundColor: '#333' }}>
                <Toolbar sx={{ color: '#fff', backgroundColor: '#042425' }}>
                    <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', backgroundColor: '#042425' }}>
                        Administrar Riego
                    </Typography>
                </Toolbar>
            </AppBar>
            <Sidebar usuario={usuario} handleLogout={handleLogout} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    maxHeight: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Lista de Riegos</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <TextField
                        label="Buscar por Válvula"
                        variant="outlined"
                        value={busquedaValvula}
                        onChange={(e) => setBusquedaValvula(e.target.value)}
                        sx={{
                            mr: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            width: '300px',
                            borderRadius: '10px',
                            '& .MuiInputBase-root': {
                                color: 'grey',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            '& .MuiInputLabel-root': {
                                color: '#B0BEC5',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1ABC9C',
                            },
                        }}
                    />
                    <TextField
                        label="Buscar por Fecha"
                        variant="outlined"
                        value={busquedaFecha}
                        onChange={(e) => setBusquedaFecha(e.target.value)}
                        sx={{
                            mr: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            width: '300px',
                            borderRadius: '10px',
                            '& .MuiInputBase-root': {
                                color: 'grey',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            '& .MuiInputLabel-root': {
                                color: '#B0BEC5',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#1ABC9C',
                            },
                        }}
                    />
                </Box>

                <Button
    variant="contained"
    onClick={exportarExcel}
    sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#2C3E50',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: '#34495E',
        },
    }}
>
    Exportar a Excel
</Button>


                {/* Botón de Subir Excel */}
                <UploadExcel
                    onUploadSuccess={obtenerRiegos}
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        '& .MuiButton-root': {
                            backgroundColor: '#2C3E50',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#34495E',
                            },
                        },
                    }}
                >
                    <CloudUpload sx={{ mr: 1 }} /> Subir Excel
                </UploadExcel>

                {/* Tabla sin scroll */}
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 2,
                        backgroundColor: "rgba(54, 129, 78, 0.2)",
                        minHeight: '400px',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowY: 'auto',
                    }}
                >
                    <Table sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)", color: 'black', borderCollapse: 'collapse'  }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Válvula</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Cantidad de Agua (L)</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Duración (min)</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Fecha</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRiegos.map((riego) => (
                                <TableRow key={riego.id}>
                                    <TableCell sx={{ color: 'black' }}>{riego.id}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{riego.valvula_id}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{riego.cantidad_agua}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{riego.duracion}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{new Date(riego.fecha_riego).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <IconButton color="primary" onClick={() => redirigirEdicion(riego.id)}>
                                                <Edit sx={{ color: '#fff' }} />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => eliminarRiego(riego.id)}>
                                                <Delete sx={{ color: '#fff' }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    sx={{
                        mt: 4, // Added margin-top for better spacing
                        display: 'flex',
                        justifyContent: 'center', // Center the pagination
                        alignItems: 'center',
                        backgroundColor: '#2C3E50',
                        color: '#fff',
                        borderRadius: '8px',
                        '& .MuiPaginationItem-root': {
                            backgroundColor: '#34495E',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '10px 20px', // Increase padding for a better button size
                            '&:hover': {
                                backgroundColor: '#1ABC9C',
                            },
                        },
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    component={Link}
                    to="/nuevoRiego"
                    sx={{
                        mt: 4, // Added margin-top for better spacing
                        backgroundColor: '#2C3E50',
                        color: '#fff',
                        padding: '12px 24px', // Increased padding for better button size
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                            backgroundColor: '#34495E',
                        },
                    }}
                >
                    Nuevo Riego
                </Button>
                <RiegoGrafico riegos={riegosFiltrados} />
            </Box>
        </Box>
    );
};

export default RiegoList;