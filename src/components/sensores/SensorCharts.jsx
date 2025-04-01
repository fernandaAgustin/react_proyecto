import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SensorCharts = ({ sensores }) => {
    // Contar los sensores por tipo
    const countByType = sensores.reduce((acc, sensor) => {
        acc[sensor.tipo] = (acc[sensor.tipo] || 0) + 1;
        return acc;
    }, {});

    // Contar los sensores por zona
    const countByZone = sensores.reduce((acc, sensor) => {
        acc[sensor.ubicacion] = (acc[sensor.ubicacion] || 0) + 1;
        return acc;
    }, {});

    // Datos para la gráfica de tipos
    const typeData = {
        labels: Object.keys(countByType),
        datasets: [{
            data: Object.values(countByType),
            backgroundColor: ['#FF6F61', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'],
        }],
    };

    // Datos para la gráfica de zonas
    const zoneData = {
        labels: Object.keys(countByZone),
        datasets: [{
            data: Object.values(countByZone),
            backgroundColor: ['#FF6F61', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'],
        }],
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
            <div style={{ width: '45%' }}>
                <h3>Distribución de Sensores por Tipo</h3>
                <Doughnut data={typeData} />
            </div>
            <div style={{ width: '45%' }}>
                <h3>Distribución de Sensores por Zona</h3>
                <Bar data={zoneData} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                    },
                }} />
            </div>
        </div>
    );
};

export default SensorCharts;
