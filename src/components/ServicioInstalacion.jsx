import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    backgroundColor: '#f1f8e9',
    border: '1px solid #c8e6c9',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: 'none',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 10px 24px rgba(76, 175, 80, 0.25)',
    },
}));

const BackButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(6),
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: '30px',
    padding: '12px 28px',
    fontFamily: 'Raleway',
    fontWeight: 600,
    fontSize: '1rem',
    textTransform: 'none',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: '#2e7d32',
        transform: 'scale(1.06)'
    }
}));

const ServicioInstalacion = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: { xs: 3, md: 8 }, backgroundColor: '#f9fefb', minHeight: '100vh', fontFamily: 'Raleway' }}>
            <Typography variant="h3" textAlign="center" sx={{ color: '#2e7d32', fontWeight: '700', mb: 2 }}>
                Servicios de Instalación 🌿
            </Typography>

            <Typography variant="h6" textAlign="center" color="text.secondary" maxWidth="md" mx="auto" mb={5}>
                Nos aseguramos de que tu sistema funcione perfectamente desde el primer día, con asesoramiento y soporte profesional en cada etapa.
            </Typography>

            <Grid container spacing={4} alignItems="stretch">
                <Grid item xs={12} md={6}>
                    <StyledCard>
                        <CardMedia
                            component="img"
                            height="280"
                            image="https://i.pinimg.com/736x/e9/0b/ad/e90bad766e7eb2cfef5f0d2f958066a3.jpg"
                            alt="Instalación de sistema de riego"
                            sx={{ borderRadius: '20px 20px 0 0', objectFit: 'cover' }}
                        />
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#388E3C', fontWeight: '600', mb: 1 }}>
                                Instalación Profesional
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Nuestro equipo técnico instala sensores de humedad, válvulas eléctricas, sistemas de control automático y cableado necesario de forma eficiente y limpia.
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#388E3C', fontWeight: '600', mb: 1 }}>
                                ¿Qué incluye nuestro servicio?
                            </Typography>
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">✅ Asesoramiento personalizado para tu cultivo.</Typography>
                                <Typography variant="body2" color="text.secondary">✅ Instalación de hardware y configuración IoT.</Typography>
                                <Typography variant="body2" color="text.secondary">✅ Pruebas de funcionamiento y calibración.</Typography>
                                <Typography variant="body2" color="text.secondary">✅ Capacitación básica para el usuario final.</Typography>
                            </Stack>
                        </CardContent>
                        <CardMedia
                            component="img"
                            height="220"
                            image="https://i.pinimg.com/736x/a5/78/78/a57878b4046b5bac01ea71c3f3a3d96c.jpg"
                            alt="Técnico instalando sensores"
                            sx={{ borderRadius: '0 0 20px 20px', objectFit: 'cover' }}
                        />
                    </StyledCard>
                </Grid>
            </Grid>

            <Divider sx={{ my: 6, borderColor: '#a5d6a7' }} />

            <Typography variant="h5" textAlign="center" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                Garantía de funcionamiento ✔️
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" maxWidth="md" mx="auto" mt={1}>
                Todos nuestros sistemas cuentan con garantía y seguimiento remoto opcional, asegurando eficiencia y durabilidad.
            </Typography>

            <Box textAlign="center">
                <BackButton onClick={() => navigate('/perfil')}>
                    ⬅ Regresar
                </BackButton>
            </Box>
        </Box>
    );
};

export default ServicioInstalacion;
