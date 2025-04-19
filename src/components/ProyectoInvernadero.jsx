import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import '@fontsource/raleway';

// Iconos de Material UI
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Tarjeta personalizada con glassmorphism + color
const ColoredCard = styled(Card)(({ bgcolor }) => ({
    backdropFilter: 'blur(10px)',
    backgroundColor: bgcolor || 'rgba(255, 255, 255, 0.41)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease-in-out',
    color: '#1b1b1b',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
    },
}));

const BackgroundVideo = styled('video')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
    opacity: 0.25,
});

const Overlay = styled(Box)({
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '80px 24px',
    fontFamily: 'Raleway',
});

const ProyectoInvernadero = () => {
    const features = [
        {
            title: 'Sensores Inteligentes',
            text: 'Detectan temperatura y humedad en tiempo real. Gracias a estos sensores, el riego se activa automáticamente, asegurando que tus cultivos estén siempre en condiciones óptimas.',
            icon: <ThermostatIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
            bgcolor: 'rgba(232, 245, 233, 0.9)',
        },
        {
            title: 'Energía Solar',
            text: 'El sistema se alimenta de energía solar, permitiendo total autonomía sin necesidad de conexión eléctrica convencional. Una solución ecológica y económica.',
            icon: <WbSunnyIcon sx={{ fontSize: 40, color: '#fbc02d' }} />,
            bgcolor: 'rgba(255, 249, 196, 0.9)',
        },
        {
            title: 'Recolección de Agua',
            text: 'Captura el agua de lluvia, la filtra y la reutiliza para el riego. Reduce el consumo de agua potable y maximiza la eficiencia hídrica del sistema.',
            icon: <OpacityIcon sx={{ fontSize: 40, color: '#0288d1' }} />,
            bgcolor: 'rgba(227, 242, 253, 0.9)',
        },
        {
            title: 'App de Control IoT',
            text: 'Administra tu invernadero desde cualquier parte del mundo. Monitorea estadísticas, recibe alertas y ajusta parámetros desde tu smartphone.',
            icon: <SmartphoneIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
            bgcolor: 'rgba(241, 243, 244, 0.9)',
        },
    ];

    return (
        <Box sx={{ position: 'relative' }}>
            <BackgroundVideo
                src="https://videocdn.cdnpk.net/videos/d62a9ca9-03d2-417f-9108-2857a4641b28/horizontal/previews/clear/large.mp4?token=exp=1745099036~hmac=f9e092e825c88ca131437fd4eda80394085a10d47d12108c4d4d1cbb1715f4b2"
                autoPlay
                muted
                loop
                playsInline
            />

            <Overlay>
                {/* Botón de regreso */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 4,
                        color: '#1b5e20',
                        fontWeight: 600,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderRadius: '8px',
                        px: 2,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                    }}
                    onClick={() => window.history.back()}
                >
                    Regresar
                </Button>

                <Container maxWidth="md">
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            color: '#1b5e20',
                            mb: 3,
                            textShadow: '1px 1px 3px rgba(150, 147, 147, 0.1)',
                        }}
                    >
                        Invernadero Inteligente 🌱
                    </Typography>

                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
                    >
                        Tecnología verde que automatiza, ahorra y protege. Diseñado para agricultores modernos, entusiastas del cultivo urbano y proyectos escolares sustentables.
                    </Typography>

                    <Grid container spacing={4}>
                        {features.map((item, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <ColoredCard bgcolor={item.bgcolor}>
                                    <Box mb={2}>{item.icon}</Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        {item.text}
                                    </Typography>
                                </ColoredCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Overlay>
        </Box>
    );
};

export default ProyectoInvernadero;
