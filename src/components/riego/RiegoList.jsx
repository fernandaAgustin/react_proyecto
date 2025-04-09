import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UploadExcel from './UploadExcel';
import { AppBar, Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Paper, IconButton } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, BarChart, Logout, Edit, Delete, Add, CloudUpload, Home } from '@mui/icons-material';
import * as XLSX from 'xlsx'; // Importa XLSX para crear el archivo Excel

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
            const response = await axios.get('https://18.191.201.190/api/riegos');
            setRiegos(response.data);
        } catch (error) {
            console.error('Error al obtener los riegos:', error);
        }
    };

    const eliminarRiego = async (id) => {
        try {
            await axios.delete(`https://18.191.201.190/api/riegos/${id}`);
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
            <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#333' }}>
                <Typography variant="h6" sx={{ color: '#fff', padding: '10px' }}>
                    Administrar Riego
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
                    <Table sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)", color: 'black', borderCollapse: 'collapse' }}>
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
                                    <TableCell sx={{ color: 'white' }}>{riego.id}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{riego.valvula_id}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{riego.cantidad_agua}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{riego.duracion}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{new Date(riego.fecha_riego).toLocaleDateString()}</TableCell>
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
            </Box>
        </Box>
    );
};

export default RiegoList;
