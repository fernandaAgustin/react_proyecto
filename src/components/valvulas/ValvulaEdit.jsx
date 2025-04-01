import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid, Alert, Zoom, InputAdornment } from '@mui/material';
import { Build, LocationOn, CheckCircle, CalendarToday } from '@mui/icons-material';

const ValvulaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [estado, setEstado] = useState('');
    const [fechaInstalacion, setFechaInstalacion] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const obtenerValvula = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/valvulas/${id}`);
            const valvula = response.data;
            setNombre(valvula.nombre);
            setUbicacion(valvula.ubicacion);
            setEstado(valvula.estado);

            if (valvula.fecha_instalacion) {
                const fecha = new Date(valvula.fecha_instalacion).toISOString().split('T')[0];
                setFechaInstalacion(fecha);
            }
        } catch (error) {
            setError('Error al obtener la válvula.');
        }
    };

    const actualizarValvula = async (e) => {
        e.preventDefault();
        const datosActualizados = {
            nombre,
            ubicacion,
            estado,
            fecha_instalacion: fechaInstalacion || null,
        };

        try {
            await axios.put(`http://localhost:3000/api/valvulas/${id}`, datosActualizados);
            setSuccessMessage('Válvula actualizada con éxito');
            setTimeout(() => navigate('/valvula'), 2000);
        } catch (error) {
            setError('Error al actualizar la válvula.');
        }
    };

    const cancelarEdicion = () => {
        navigate('/valvula');
    };

    useEffect(() => {
        obtenerValvula();
    }, [id]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url('https://example.com/your-background-image.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                padding: 1,
                "::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    zIndex: 2,
                },
            }}
        >
            <Zoom in={true} timeout={1000}>
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 3,
                        width: { xs: "100%", sm: "80%", md: "60%" },
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: 3,
                        borderRadius: 3,
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#0F2F24" }}>
                        Editar Válvula
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                    <form onSubmit={actualizarValvula}>
                        <Box display="grid" gridTemplateColumns="1fr" gap={2} sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Build />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Ubicación"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Estado"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CheckCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Fecha de Instalación"
                                type="date"
                                value={fechaInstalacion}
                                onChange={(e) => setFechaInstalacion(e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        "&:hover": { backgroundColor: "#44556f" },
                                    }}
                                >
                                    Actualizar
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={cancelarEdicion}
                                    sx={{
                                        "&:hover": { backgroundColor: "#44556f" },
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Zoom>
        </Box>
    );
};

export default ValvulaEdit;
