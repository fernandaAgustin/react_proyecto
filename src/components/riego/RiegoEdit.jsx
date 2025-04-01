import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Grid, Alert, Zoom, InputAdornment } from '@mui/material';
import { ArrowBack, WaterDrop, AccessTime, CalendarToday } from '@mui/icons-material';

const RiegoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [valvulaId, setValvulaId] = useState('');
    const [cantidadAgua, setCantidadAgua] = useState('');
    const [duracion, setDuracion] = useState('');
    const [fechaRiego, setFechaRiego] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const obtenerRiego = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/riegos/${id}`);
            const riego = response.data;
            // Convertir fecha al formato YYYY-MM-DD
            const fechaFormateada = riego.fecha_riego.split('T')[0];

            setValvulaId(riego.valvula_id);
            setCantidadAgua(riego.cantidad_agua);
            setDuracion(riego.duracion);
            setFechaRiego(fechaFormateada);
        } catch (error) {
            setError('Error al obtener el riego');
        }
    };

    const actualizarRiego = async (e) => {
        e.preventDefault();
        const datosActualizados = {
            valvula_id: valvulaId,
            cantidad_agua: cantidadAgua,
            duracion: duracion,
            fecha_riego: fechaRiego
        };

        try {
            await axios.put(`http://localhost:3000/api/riegos/${id}`, datosActualizados);
            setSuccessMessage('Riego actualizado con éxito');
            setTimeout(() => navigate('/riego'), 2000);
        } catch (error) {
            setError('Error al actualizar el riego');
        }
    };

    const cancelarFormulario = () => {
        navigate('/riego');
    };

    useEffect(() => {
        obtenerRiego();
    }, []);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                backgroundImage: "url('https://example.com/your-background-image.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 1,
                "::before": {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 2,
                },
            }}
        >
            <Zoom in={true} timeout={1000}>
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 3,
                        width: { xs: '100%', sm: '80%', md: '60%' },
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: 8,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: '#0F2F24' }}>
                        Editar Riego
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                    <form onSubmit={actualizarRiego}>
                        <Box display="grid" gridTemplateColumns="1fr" gap={2} sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Válvula ID"
                                value={valvulaId}
                                onChange={(e) => setValvulaId(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ArrowBack />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Cantidad de Agua (L)"
                                type="number"
                                value={cantidadAgua}
                                onChange={(e) => setCantidadAgua(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WaterDrop />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Duración (min)"
                                type="number"
                                value={duracion}
                                onChange={(e) => setDuracion(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTime />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Fecha de Riego"
                                type="date"
                                value={fechaRiego}
                                onChange={(e) => setFechaRiego(e.target.value)}
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
                                        '&:hover': { backgroundColor: '#44556f' },
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
                                    onClick={cancelarFormulario}
                                    sx={{
                                        '&:hover': { backgroundColor: '#f1f1f1' },
                                    }}
                                >
                                    Regresar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Zoom>
        </Box>
    );
};

export default RiegoEdit;
