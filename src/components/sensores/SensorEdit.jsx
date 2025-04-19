import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Grid,
    Zoom,
    IconButton,
    InputAdornment,
    Box
} from '@mui/material';
import {
    Person,
    Category,
    LocationOn,
    CalendarToday,
    ArrowBack
} from '@mui/icons-material';

const SensorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [fechaInstalacion, setFechaInstalacion] = useState('');

    const obtenerSensor = async () => {
        try {
            const response = await axios.get(`https://18.191.201.190/api/sensores/${id}`);
            const sensor = response.data;
            setNombre(sensor.nombre);
            setTipo(sensor.tipo);
            setUbicacion(sensor.ubicacion);

            if (sensor.fecha_instalacion) {
                const fecha = new Date(sensor.fecha_instalacion).toISOString().split('T')[0];
                setFechaInstalacion(fecha);
            } else {
                setFechaInstalacion('');
            }
        } catch (error) {
            console.error('Error al obtener el sensor:', error);
        }
    };

    const actualizarSensor = async (e) => {
        e.preventDefault();
        const datosActualizados = {
            nombre,
            tipo,
            ubicacion,
            fecha_instalacion: fechaInstalacion || null,
        };

        try {
            await axios.put(`https://18.191.201.190/api/sensores/${id}`, datosActualizados);
            alert('Sensor actualizado con éxito');
            navigate('/sensores');
        } catch (error) {
            console.error('Error al actualizar el sensor:', error);
        }
    };

    const handleRegresar = () => {
        navigate('/sensores');
    };

    useEffect(() => {
        obtenerSensor();
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url("https://i.pinimg.com/736x/52/50/3c/52503cc457fc84a29c5414fc34d4ba2c.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Zoom in={true} timeout={1000}>
                <Container
                    maxWidth="sm"
                    sx={{
                        paddingTop: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.61)',
                        borderRadius: 2,
                        boxShadow: 3,
                        padding: 3,
                    }}
                >
                    <IconButton
                        onClick={handleRegresar}
                        sx={{
                            color: 'white',
                            backgroundColor: 'rgba(220, 33, 33, 0.5)',
                            borderRadius: '50%',
                            marginBottom: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(42, 4, 4, 0.7)',
                            },
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <h2>Editar Sensor</h2>
                    <form onSubmit={actualizarSensor}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Tipo"
                                    variant="outlined"
                                    fullWidth
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Category />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Ubicación"
                                    variant="outlined"
                                    fullWidth
                                    value={ubicacion}
                                    onChange={(e) => setUbicacion(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Fecha Instalación"
                                    variant="outlined"
                                    fullWidth
                                    type="date"
                                    value={fechaInstalacion}
                                    onChange={(e) => setFechaInstalacion(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" fullWidth type="submit">
                                    Actualizar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Zoom>
        </Box>
    );
};

export default SensorEdit;
