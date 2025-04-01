import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UploadExcel from "./UploadExcel";
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, BarChart, Logout, Add, Delete, Edit, CloudUpload, Home } from '@mui/icons-material';
import SensorCharts from "./SensorCharts"; 
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

const SensorList = () => {
    const [sensores, setSensores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const sensoresPorPagina = 30;
    const [usuario, setUsuario] = useState(null);
    const [searchQueryName, setSearchQueryName] = useState("");
    const [searchQueryType, setSearchQueryType] = useState("");
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    const fetchSensores = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/sensores");
            setSensores(response.data);
        } catch (error) {
            console.error("Error al obtener los sensores:", error);
        }
    };

    useEffect(() => {
        fetchSensores();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/sensores/${id}`);
            setSensores(sensores.filter(sensor => sensor.id !== id));
            alert("Sensor eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar el sensor:", error);
        }
    };

    const filteredSensores = sensores.filter(sensor =>
        sensor.nombre.toLowerCase().includes(searchQueryName.toLowerCase()) &&
        sensor.tipo.toLowerCase().includes(searchQueryType.toLowerCase())
    );

    const indexOfLastSensor = currentPage * sensoresPorPagina;
    const indexOfFirstSensor = indexOfLastSensor - sensoresPorPagina;
    const currentSensores = filteredSensores.slice(indexOfFirstSensor, indexOfLastSensor);
    const totalPages = Math.ceil(filteredSensores.length / sensoresPorPagina);

    const handleExportToExcel = () => {
        // Create a workbook
        const wb = XLSX.utils.book_new();
    
        // Create an array for the headers and data to be exported
        const headers = ["ID", "Nombre", "Tipo", "Ubicación", "Fecha de Instalación"];
        const data = filteredSensores.map(sensor => [
            sensor.id,
            sensor.nombre,
            sensor.tipo,
            sensor.ubicacion,
            new Date(sensor.fecha_instalacion).toLocaleDateString(),
        ]);
    
        // Combine headers and data into a worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sensores");
    
        // Export the workbook as an Excel file
        XLSX.writeFile(wb, "sensores.xlsx");
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
                                Administrar Sensores
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
                        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Lista de Sensores</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <TextField
                        label="Buscar por Nombre"
                        variant="outlined"
                        value={searchQueryName}
                        onChange={(e) => setSearchQueryName(e.target.value)}
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
                        label="Buscar por Tipo"
                        variant="outlined"
                        value={searchQueryType}
                        onChange={(e) => setSearchQueryType(e.target.value)}
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
    onClick={handleExportToExcel}
    sx={{
        mt: 2,
        backgroundColor: '#1ABC9C',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            backgroundColor: '#34495E',
        },
    }}
>
    Exportar a Excel
</Button>

                {/* Botón de Subir Excel */}
                <UploadExcel
                    onUploadSuccess={fetchSensores}
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        '& .MuiButton-root': {
                            backgroundColor: '#2C3E50', // Un tono gris oscuro
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#34495E', // Un gris más oscuro al hacer hover
                            },
                        },
                    }}
                >
                    <CloudUpload sx={{ mr: 1 }} /> Subir Excel
                </UploadExcel>

                {/* Tabla sin scroll forzado pero con altura mínima */}
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
                    <Table sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', color: '#fff' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Nombre</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Tipo</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Ubicación</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Fecha de Instalación</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {currentSensores.map((sensor) => (
                                <TableRow key={sensor.id}>
                                    <TableCell sx={{ color: 'black' }}>{sensor.id}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{sensor.nombre}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{sensor.tipo}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{sensor.ubicacion}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{new Date(sensor.fecha_instalacion).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <IconButton onClick={() => navigate(`/editSensores/${sensor.id}`)}>
                                                <Edit sx={{ color: '#fff' }} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(sensor.id)}>
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
                        mt: 4, 
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
                    to="/nuevoSensores"
                    sx={{
                        mt: 4,
                        backgroundColor: '#042425',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                            backgroundColor: '#34495E',
                        },
                    }}
                >
                    Nuevo Sensor
                </Button>
                <SensorCharts sensores={sensores} />
            </Box>
        </Box>
    );
};

export default SensorList;