import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, IconButton } from '@mui/material';
import { ArrowBack, Person as PersonIcon, DeviceHub as DeviceHubIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import { Zoom, Box} from '@mui/material';

const SensorForm = () => {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [fechaInstalacion, setFechaInstalacion] = useState('');

    const crearSensor = async (e) => {
        e.preventDefault();
        const nuevoSensor = {
            nombre,
            tipo,
            ubicacion,
            fecha_instalacion: fechaInstalacion
        };

        try {
            await axios.post('https://18.191.201.190/api/sensores', nuevoSensor);
            alert('Sensor creado con éxito');
            setNombre('');
            setTipo('');
            setUbicacion('');
            setFechaInstalacion('');
        } catch (error) {
            console.error('Error al crear el sensor:', error);
        }
    };

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
        <Zoom in={true} timeout={500}>
            <Container 
                component="main" 
                maxWidth="xs" 
                sx={{ 
                    mt: 8, 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco con opacidad
                    padding: 3, 
                    borderRadius: 2 
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Agregar Sensor
                </Typography>
                <form onSubmit={crearSensor}>
                    <TextField
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            startAdornment: <PersonIcon />
                        }}
                    />
                    <TextField
                        label="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            startAdornment: <DeviceHubIcon />
                        }}
                    />
                    <TextField
                        label="Ubicación"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            startAdornment: <LocationOnIcon />
                        }}
                    />
                    <TextField
                        label="Fecha de Instalación"
                        value={fechaInstalacion}
                        onChange={(e) => setFechaInstalacion(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Guardar
                    </Button>
                </form>
                <IconButton
                    href="/sensores"
                    sx={{
                        mt: 2,
                        color: 'primary.main',
                        position: 'absolute',
                        top: 20,
                        left: 20
                    }}
                >
                    <ArrowBack />
                </IconButton>
            </Container>
        </Zoom>
        </Box>
    );
};

export default SensorForm;
