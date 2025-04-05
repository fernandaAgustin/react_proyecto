import React from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Importamos el gráfico de barras también
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // Registramos el BarElement para el gráfico de barras
    Title,
    Tooltip,
    Legend
);

const RiegoGrafico = ({ riegos }) => {
    // Preparamos los datos para el gráfico de líneas (cantidad de agua y duración)
    const dataLine = {
        labels: riegos.map(riego => new Date(riego.fecha_riego).toLocaleDateString()), // Las fechas en el eje X
        datasets: [
            {
                label: 'Cantidad de Agua (L)',
                data: riegos.map(riego => riego.cantidad_agua), // Datos de la cantidad de agua
                borderColor: 'rgb(35, 81, 16)',
                backgroundColor: 'rgba(10, 23, 7, 0.2)',
                fill: true,
                tension: 0.4, // Hacer la línea más suave
            },
            {
                label: 'Duración (min)',
                data: riegos.map(riego => riego.duracion), // Datos de la duración
                borderColor: 'rgb(11, 47, 53)',
                backgroundColor: 'rgba(27, 24, 46, 0.16)',
                fill: true,
                tension: 0.4, // Hacer la línea más suave
            },
        ],
    };

    // Preparamos los datos para el gráfico de barras (por válvula)
    const dataBar = {
        labels: [...new Set(riegos.map(riego => riego.valvula_id))], // IDs únicos de válvulas
        datasets: [
            {
                label: 'Cantidad Total de Agua por Válvula (L)',
                data: [...new Set(riegos.map(riego => riego.valvula_id))].map(valvulaId =>
                    riegos
                        .filter(riego => riego.valvula_id === valvulaId) // Filtramos los riegos por ID de válvula
                        .reduce((acc, curr) => acc + curr.cantidad_agua, 0) // Sumamos la cantidad de agua
                ),
                backgroundColor: 'rgba(53, 86, 108, 0.77)',
                borderColor: 'rgb(4, 7, 9)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Box sx={{ padding: 3, }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            </Typography>
            
            {/* Contenedor responsivo con flexbox */}
            <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Ajusta las columnas automáticamente
                gap: 16, // Aumentamos la separación entre los gráficos
                justifyItems: 'center', // Centra los gráficos
            }}>
                {/* Gráfico de Líneas */}
                <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'transparent' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, color: '#333' }}>
                        Cantidad de Agua y Duración
                    </Typography>
                    <Line data={dataLine} options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolución de Riego',
                                font: {
                                    size: 18,
                                },
                            },
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
                        },
                    }} />
                </Paper>

                {/* Gráfico de Barras */}
                <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'transparent' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, color: '#333' }}>
                    Cantidad de Agua por Válvula
                    </Typography>
                    <Bar data={dataBar} options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Total de Agua por Válvula',
                                font: {
                                    size: 18,
                                },
                            },
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
                        },
                    }} />
                </Paper>
            </Box>
        </Box>
    );
};

export default RiegoGrafico;
