import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, AppBar, Toolbar, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField, Button } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, Logout, Add, DeleteForever, BorderColor, CloudUpload, CloudDownload } from '@mui/icons-material';
import UploadExcel from './UploadExcel';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'; // Importar Recharts
import * as XLSX from 'xlsx'; // Importa XLSX para crear el archivo Excel
import { saveAs } from 'file-saver'; // Librería para descargar el archivo

const ListaUsuario = () => {
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
            <AppBar position="fixed" sx={{ width: `100%`, backgroundColor: '#333' }}>
                <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', backgroundColor: '#042425' }}>
                    Administrar Usuarios
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
                                color: 'white',  // Asegura que el texto ingresado sea blanco
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Color de fondo del borde
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',  // Color de la etiqueta
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'green',  // Cambia el borde a verde cuando el campo está en hover
                                borderRadius: '1px',
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',  // Asegura que el texto ingresado sea blanco, en caso de que no se haya aplicado correctamente
                            }
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
                            color: 'white',
                            '& .MuiInputBase-root': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'green',
                                borderRadius:'1px',
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

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudDownload />}
                    onClick={handleExportToExcel}
                    sx={{ mb: 2 }}
                >
                    Exportar a Excel
                </Button>

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
                    <Table sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)", color: 'black', borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'transparent' }}>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>ID</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Nombre</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Correo</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Rol</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Fecha de Nacimiento</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Sexo</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#04242' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentUsuarios.map(usuario => (
                                <TableRow key={usuario.id} sx={{ backgroundColor: 'transparent' }}>
                                    <TableCell sx={{ color: 'white', backgroundColor: 'transparent' }}>{usuario.id}</TableCell>
                                    <TableCell sx={{ color: 'white', backgroundColor: 'transparent' }}>{usuario.nombre}</TableCell>
                                    <TableCell sx={{ color: 'white', backgroundColor: 'transparent' }}>{usuario.correo}</TableCell>
                                    <TableCell sx={{ color: 'white', backgroundColor: 'transparent' }}>{usuario.rol}</TableCell>
                                    <TableCell sx={{ color: 'white', backgroundColor: 'transparent' }}>{new Date(usuario.fecha_nacimiento).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ color: 'white', backgroundColor: 'transparent' }}>{usuario.sexo}</TableCell>
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

                {/* Paginación */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 , color:'white'}}>
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

                {/* Botones */}
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
            </Box>
        </Box>
    );
};

export default ListaUsuario;
