import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UploadExcel from "./UploadExcel";
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, BarChart, Logout, Add, Delete, Edit, CloudUpload, Home } from '@mui/icons-material';
import { saveAs } from 'file-saver'; // Librería para descargar el archivo
import * as XLSX from 'xlsx'; // Importa XLSX para crear el archivo Excel

const drawerWidth = 240;

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
            const response = await axios.get("https://18.191.201.190/api/sensores");
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
            <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#333' }}>
                
                    <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', backgroundColor: '#042425' }}>
                        Administrar Sensores
                        <Button
                            component={Link}
                            to="/perfil"
                            sx={{
                                mt: 1, // Added margin-top for better spacing
                                backgroundColor: 'black',
                                color: '#fff',
                                padding: '3px 6px', // Increased padding for better button size
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '&:hover': {
                                    backgroundColor: 'red',
                                },
                            }}
                        > Dashboard
                        </Button>
                    </Typography>
            </AppBar>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    maxHeight: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    backgroundImage: 'url("https://i.pinimg.com/736x/2d/36/85/2d3685a4ecd4912b675aad67d09930c6.jpg")',
                    backgroundSize: 'cover',  // Asegura que la imagen cubra toda el área
                    backgroundPosition: 'center',  // Centra la imagen en el contenedor
                    backgroundRepeat: 'no-repeat',  // Previene que la imagen se repita
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

                <UploadExcel
                    onUploadSuccess={fetchSensores}
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
                        <TableBody>
                            {currentSensores.map((sensor) => (
                                <TableRow key={sensor.id}>
                                    <TableCell sx={{ color: '#fff' }}>{sensor.id}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{sensor.nombre}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{sensor.tipo}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{sensor.ubicacion}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{new Date(sensor.fecha_instalacion).toLocaleDateString()}</TableCell>
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
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#2C3E50',
                        color: '#fff',
                        borderRadius: '8px',
                        '& .MuiPaginationItem-root': {
                            backgroundColor: '#34495E',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '10px 20px',
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
            </Box>
        </Box>
    );
};

export default SensorList;
