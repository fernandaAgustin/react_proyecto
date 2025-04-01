import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Zoom, IconButton, InputAdornment } from '@mui/material';
import { Person, Category, LocationOn, CalendarToday, ArrowBack } from '@mui/icons-material';

const SensorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [fechaInstalacion, setFechaInstalacion] = useState('');

    const obtenerSensor = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/sensores/${id}`);
            const sensor = response.data;
            setNombre(sensor.nombre);
            setTipo(sensor.tipo);
            setUbicacion(sensor.ubicacion);

            // Verifica si la fecha existe y conviértela al formato adecuado
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
            await axios.put(`http://localhost:3000/api/sensores/${id}`, datosActualizados);
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
        <Zoom in={true} timeout={1000}>
            <Container
                maxWidth="sm"
                sx={{
                    paddingTop: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco con transparencia
                    borderRadius: 2, // Redondear los bordes
                    boxShadow: 3, // Añadir una sombra
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
    );
};

export default SensorEdit;
