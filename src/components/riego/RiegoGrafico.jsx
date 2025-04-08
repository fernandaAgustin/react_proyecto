import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const RiegoGrafico = ({ riegos }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const dataLine = {
        labels: riegos.map(riego => new Date(riego.fecha_riego).toLocaleDateString()),
        datasets: [
            {
                label: 'Agua (L)',
                data: riegos.map(riego => riego.cantidad_agua),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Duración (min)',
                data: riegos.map(riego => riego.duracion),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const valvulasUnicas = [...new Set(riegos.map(r => r.valvula_id))];
    const dataBar = {
        labels: valvulasUnicas,
        datasets: [
            {
                label: 'Total Agua por Válvula (L)',
                data: valvulasUnicas.map(id =>
                    riegos.filter(r => r.valvula_id === id).reduce((acc, cur) => acc + cur.cantidad_agua, 0)
                ),
                backgroundColor: 'rgba(129, 199, 132, 0.7)',
                borderColor: '#388E3C',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // ✅ Esto permite que las gráficas se adapten
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#ddd',
                    font: { size: 13 },
                },
            },
            title: { display: false },
        },
        scales: {
            x: {
                ticks: { color: '#aaa' },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
            y: {
                ticks: { color: '#aaa' },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
        },
    };

    return (
        <Box sx={{ px: 2, py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                }}
            >
                {/* Evolución del Riego */}
                <Paper
                    sx={{
                        flex: 1,
                        minWidth: 300,
                        maxWidth: '100%',
                        p: 3,
                        borderRadius: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        height: 350, // altura fija para la gráfica
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                        },
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Evolución del Riego
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                        <Line data={dataLine} options={chartOptions} />
                    </Box>
                </Paper>

                {/* Agua por válvula */}
                <Paper
                    sx={{
                        flex: 1,
                        minWidth: 300,
                        maxWidth: '100%',
                        p: 3,
                        borderRadius: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        height: 350,
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                        },
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Agua Total por Válvula
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                        <Bar data={dataBar} options={chartOptions} />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default RiegoGrafico;
