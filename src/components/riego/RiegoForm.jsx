import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography, Grid, Alert, Zoom, InputAdornment } from '@mui/material';
import { ArrowBack, WaterDrop, AccessTime, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RiegoForm = () => {
    const navigate = useNavigate();
    const [valvulaId, setValvulaId] = useState('');
    const [cantidadAgua, setCantidadAgua] = useState('');
    const [duracion, setDuracion] = useState('');
    const [fechaRiego, setFechaRiego] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const crearRiego = async (e) => {
        e.preventDefault();
        const nuevoRiego = {
            valvula_id: valvulaId,
            cantidad_agua: cantidadAgua,
            duracion: duracion,
            fecha_riego: fechaRiego
        };

        try {
            await axios.post('http://localhost:3000/api/riegos', nuevoRiego);
            setSuccessMessage('Riego creado con éxito');
            setTimeout(() => navigate('/riego'), 2000);
            setValvulaId('');
            setCantidadAgua('');
            setDuracion('');
            setFechaRiego('');
        } catch (error) {
            setError('Error al crear el riego');
        }
    };

    const cancelarFormulario = () => {
        navigate('/riego');
    };

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
                        Crear Riego
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                    <form onSubmit={crearRiego}>
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
                                    Crear
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

export default RiegoForm;
