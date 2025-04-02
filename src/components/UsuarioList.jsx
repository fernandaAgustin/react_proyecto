import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, Logout, Add, DeleteForever, BorderColor, Home, ArrowBack, ArrowForward } from '@mui/icons-material';
import UploadExcel from './UploadExcel';
import { CloudUpload } from '@mui/icons-material';
import { CloudDownload } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'; // Importar Recharts
import UserStats from '../components/UserStats';
import * as XLSX from 'xlsx'; // Importa XLSX para crear el archivo Excel
import { saveAs } from 'file-saver'; // Librería para descargar el archivo

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

const UsuarioList = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const usuariosPorPagina = 10;

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
        axios.get("http://localhost:3000/api/usuarios/") 
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/api/usuarios/${id}`)
            .then(() => {
                setUsuarios(usuarios.filter(usuario => usuario.id !== id));
                alert("Usuario eliminado correctamente");
            })
            .catch(error => console.error("Error al eliminar usuario:", error));
    };

    const handleSearchNameChange = (e) => setSearchName(e.target.value);
    const handleSearchRoleChange = (e) => setSearchRole(e.target.value);

    const filteredUsuarios = usuarios.filter(usuario => {
        const matchesName = usuario.nombre.toLowerCase().includes(searchName.toLowerCase());
        const matchesRole = usuario.rol.toLowerCase().includes(searchRole.toLowerCase());
        return matchesName && matchesRole;
    });

    const indexOfLastUser = currentPage * usuariosPorPagina;
    const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
    const currentUsuarios = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsuarios.length / usuariosPorPagina);

    if (!usuario) return <p>Cargando...</p>;

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    // Datos para las gráficas (ejemplo)
    const roleCounts = filteredUsuarios.reduce((acc, usuario) => {
        acc[usuario.rol] = (acc[usuario.rol] || 0) + 1;
        return acc;
    }, {});

    const rolesData = Object.keys(roleCounts).map((role) => ({
        name: role,
        value: roleCounts[role]
    }));

    const genderCounts = filteredUsuarios.reduce((acc, usuario) => {
        acc[usuario.sexo] = (acc[usuario.sexo] || 0) + 1;
        return acc;
    }, {});

    const genderData = Object.keys(genderCounts).map((gender) => ({
        name: gender,
        value: genderCounts[gender]
    }));

    //EXCEL
    const handleExportToExcel = () => {
        // Prepara los datos para exportar (solo los campos que quieras)
        const dataToExport = filteredUsuarios.map(usuario => ({
            'ID': usuario.id,
            'Nombre': usuario.nombre,
            'Correo': usuario.correo,
            'Rol': usuario.rol,
            'Fecha de Nacimiento': new Date(usuario.fecha_nacimiento).toLocaleDateString(),
            'Sexo': usuario.sexo
        }));

        // Crea un libro de Excel
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

        // Exporta el archivo Excel
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelFile], { type: 'application/octet-stream' });
        saveAs(blob, 'usuarios.xlsx'); // Descarga el archivo
    };

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
                        Administrar Usuarios
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
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Lista de Usuarios</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <TextField
                        label="Buscar por Nombre"
                        variant="outlined"
                        value={searchName}
                        onChange={handleSearchNameChange}
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
                        label="Buscar por Rol"
                        variant="outlined"
                        value={searchRole}
                        onChange={handleSearchRoleChange}
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

                <UploadExcel
                    onUploadSuccess={() => axios.get("http://localhost:3000/api/usuarios/").then(response => setUsuarios(response.data))}
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
 {/* Agregar las gráficas */}
 <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
                    {/* Gráfica de roles */}
                    <Box sx={{ width: '45%' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>Distribución de Rol</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={rolesData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
                                    {rolesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>

                    {/* Gráfica de géneros */}
                    <Box sx={{ width: '45%' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>Distribución de Géneros</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} fill="#82ca9d">
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>
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
                            <TableRow sx={{ backgroundColor: 'transparent' }}>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Nombre</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Correo</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Rol</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Fecha de Nacimiento</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Sexo</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242t' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentUsuarios.map(usuario => (
                                <TableRow key={usuario.id} sx={{ backgroundColor: 'transparent' }}>
                                    <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>{usuario.id}</TableCell>
                                    <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>{usuario.nombre}</TableCell>
                                    <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>{usuario.correo}</TableCell>
                                    <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>{usuario.rol}</TableCell>
                                    <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>{new Date(usuario.fecha_nacimiento).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ color: 'black', backgroundColor: 'transparent' }}>{usuario.sexo}</TableCell>
                                    <TableCell sx={{ backgroundColor: 'transparent' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <IconButton color="primary" component={Link} to={`/editUsuarios/${usuario.id}`}>
                                                <BorderColor sx={{ color: 'white' }} />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(usuario.id)}>
                                                <DeleteForever sx={{ color: 'white' }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación con el componente Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        Página {currentPage} de {totalPages}
                    </Typography>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    component={Link}
                    to="/nuevoU"
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
                    Nuevo Usuario
                </Button>
                <Button
                variant="contained"
                color="primary"
                startIcon={<CloudDownload />}
                onClick={handleExportToExcel}
                sx={{ mb: 2 }}
            >
                Exportar a Excel
            </Button>
                <UserStats usuarios={usuarios} />
            </Box>
        </Box>
    );
};

export default UsuarioList;
