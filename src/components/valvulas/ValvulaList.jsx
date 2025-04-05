import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, AppBar, Toolbar, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField, Button } from "@mui/material";
import { Speed, Opacity, ToggleOn, BarChart, Logout, Add, Edit, Delete, CloudUpload, Home, CloudDownload } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import UploadExcel from "./UploadExcel";
import ValvulaGraficas from "./ValvulaGraficas";
import { saveAs } from 'file-saver'; // Librería para descargar el archivo
import * as XLSX from 'xlsx'; // Importa XLSX para crear el archivo Excel

const drawerWidth = 240;

const ValvulaList = () => {
    const [valvulas, setValvulas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const valvulasPorPagina = 10; // Cambiado a 10 como en ListaUsuario
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [searchQueryName, setSearchQueryName] = useState(""); // Estado para búsqueda por nombre
    const [searchQueryStatus, setSearchQueryStatus] = useState(""); // Estado para búsqueda por estado

    const fetchValvulas = async () => {
        try {
            const response = await axios.get("https://18.191.201.190/api/valvulas/");
            setValvulas(response.data);
        } catch (error) {
            console.error("Error al obtener válvulas:", error);
        }
    };

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

    useEffect(() => {
        fetchValvulas();
    }, []);

    // Filtrar las válvulas en base a los parámetros de búsqueda
    const filteredValvulas = valvulas.filter(valvula =>
        valvula.nombre.toLowerCase().includes(searchQueryName.toLowerCase()) &&
        valvula.estado.toLowerCase().includes(searchQueryStatus.toLowerCase())
    );

    const indexOfLastVal = currentPage * valvulasPorPagina;
    const indexOfFirstVal = indexOfLastVal - valvulasPorPagina;
    const currentValvulas = filteredValvulas.slice(indexOfFirstVal, indexOfLastVal);
    const totalPages = Math.ceil(filteredValvulas.length / valvulasPorPagina);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://18.191.201.190/api/valvulas/${id}`);
            setValvulas(valvulas.filter(valvula => valvula.id !== id));
            alert("Válvula eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar la válvula:", error);
        }
    };

    const redirigirEdicion = (id) => {
        navigate(`/editar-valvula/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    const handleExportToExcel = () => {
        const dataToExport = filteredValvulas.map(valvula => ({
            'ID': valvula.id,
            'Nombre': valvula.nombre,
            'Estado': valvula.estado,
            'Fecha de Instalación': new Date(valvula.fecha_instalacion).toLocaleDateString(),
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Válvulas');
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelFile], { type: 'application/octet-stream' });
        saveAs(blob, 'valvulas.xlsx');
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
            <AppBar position="fixed" sx={{ width: `100%`, backgroundColor: '#333' }}>
                <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', backgroundColor: '#042425' }}>
                    Administrar Valvulas
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
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Lista de Valvulas</Typography>

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
                        label="Buscar por Estado"
                        variant="outlined"
                        value={searchQueryStatus}
                        onChange={(e) => setSearchQueryStatus(e.target.value)}
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
                    startIcon={<CloudDownload />}
                    onClick={handleExportToExcel}
                    sx={{ mb: 2 }}
                >
                    Exportar a Excel
                </Button>

                {/* Botón de Subir Excel con el mismo estilo que en ListaUsuario */}
                <UploadExcel
                    onUploadSuccess={fetchValvulas}
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

                {/* Tabla sin scroll con estilo oscuro */}
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
                                <TableCell sx={{ color: '#fff' }}>Ubicación</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Estado</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Fecha de Instalación</TableCell>
                                <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentValvulas.map((valvula) => (
                                <TableRow key={valvula.id}>
                                    <TableCell sx={{ color: 'black' }}>{valvula.id}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{valvula.nombre}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{valvula.ubicacion}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{valvula.estado}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{new Date(valvula.fecha_instalacion).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <IconButton color="primary" onClick={() => redirigirEdicion(valvula.id)}>
                                                <Edit sx={{ color: '#fff' }} />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(valvula.id)}>
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
                    to="/nuevaVal"
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
                    Nueva Válvula
                </Button>
            </Box>
        </Box>
    );
};

export default ValvulaList;
