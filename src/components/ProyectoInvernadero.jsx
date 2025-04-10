import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import '@fontsource/raleway';

const GreenCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: '16px',
    boxShadow: 'none',
    border: '1px solid #c8e6c9',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.2)',
    },
    backgroundColor: '#f9fefb',
}));

const GreenButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '30px',
    fontWeight: '500',
    fontSize: '1rem',
    boxShadow: '0px 4px 10px rgba(76, 175, 80, 0.3)',
    fontFamily: 'Raleway',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: '#388E3C',
        transform: 'scale(1.04)'
    }
}));

const ProyectoInvernadero = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: { xs: 2, md: 6 }, backgroundColor: '#f1f8e9', minHeight: '100vh', fontFamily: 'Raleway' }}>
            <Typography variant="h3" gutterBottom textAlign="center" sx={{ color: '#2e7d32', fontWeight: '700' }}>
                Invernadero Inteligente 🌱
            </Typography>

            <Typography variant="h6" textAlign="center" mb={5} color="text.secondary" maxWidth="md" mx="auto">
                Automatizamos el riego y monitoreo de cultivos con sensores IoT, energía solar y sistemas de recolección de agua de lluvia.
            </Typography>

            <Grid container spacing={4}>
                {[{
                    title: '🌡️ Sensores Inteligentes',
                    image: 'https://i.pinimg.com/736x/b0/a0/a5/b0a0a506ca35919ca678c93625ec98ea.jpg',
                    text: 'Temperatura y humedad en tiempo real, activando el riego automáticamente para cuidar tus plantas.'
                }, {
                    title: '☀️ Energía Solar',
                    image: 'https://i.pinimg.com/736x/d9/b0/83/d9b0838c0ac6114b77f10401127f8c72.jpg',
                    text: 'Autonomía energética con paneles solares, sin depender de electricidad externa.'
                }, {
                    title: '💧 Recolección de Agua',
                    image: 'https://i.pinimg.com/736x/b8/a3/79/b8a37985105e70064183c02f72550676.jpg',
                    text: 'Aprovecha el agua de lluvia y reduce el consumo del agua potable.'
                }, {
                    title: '📱 App IoT',
                    image: 'https://i.pinimg.com/736x/a4/e4/70/a4e4702967cbacd4e21ff3be8496146d.jpg',
                    text: 'Gestiona el sistema desde tu smartphone: Revisa datos.'
                }].map((item, i) => (
                    <Grid item xs={12} md={6} key={i}>
                        <GreenCard>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.image}
                                alt={item.title}
                                sx={{ borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#388E3C', fontWeight: '600', mb: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.text}
                                </Typography>
                            </CardContent>
                        </GreenCard>
                    </Grid>
                ))}
            </Grid>

            <Box textAlign="center" mt={6}>
                <GreenButton onClick={() => navigate('/')}>
                    ⬅ Regresar
                </GreenButton>
            </Box>
        </Box>
    );
};

export default ProyectoInvernadero;
