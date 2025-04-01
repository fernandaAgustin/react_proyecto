import React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { Box, Typography } from '@mui/material';

// Registra los componentes necesarios para las gráficas de Chart.js
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
);

const COLORS = ["#FF6F61", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0"];

const Dashboard = ({ sensores, riegos, valvulas, usuarios }) => {
    // Gráfico de Sensores por Tipo y Zona
    const countByType = sensores.reduce((acc, sensor) => {
        acc[sensor.tipo] = (acc[sensor.tipo] || 0) + 1;
        return acc;
    }, {});

    const countByZone = sensores.reduce((acc, sensor) => {
        acc[sensor.ubicacion] = (acc[sensor.ubicacion] || 0) + 1;
        return acc;
    }, {});

    const typeData = {
        labels: Object.keys(countByType),
        datasets: [{
            data: Object.values(countByType),
            backgroundColor: COLORS,
        }],
    };

    const zoneData = {
        labels: Object.keys(countByZone),
        datasets: [{
            data: Object.values(countByZone),
            backgroundColor: COLORS,
        }],
    };

    // Gráfico de Riego (Líneas y Barras)
    const dataLine = {
        labels: riegos.map(riego => new Date(riego.fecha_riego).toLocaleDateString()),
        datasets: [
            {
                label: 'Cantidad de Agua (L)',
                data: riegos.map(riego => riego.cantidad_agua),
                borderColor: 'rgb(35, 81, 16)',
                backgroundColor: 'rgba(10, 23, 7, 0.2)',
                fill: true,
            },
            {
                label: 'Duración (min)',
                data: riegos.map(riego => riego.duracion),
                borderColor: 'rgb(11, 47, 53)',
                backgroundColor: 'rgba(27, 24, 46, 0.16)',
                fill: true,
            },
        ],
    };

    const dataBar = {
        labels: [...new Set(riegos.map(riego => riego.valvula_id))],
        datasets: [
            {
                label: 'Cantidad Total de Agua por Válvula (L)',
                data: [...new Set(riegos.map(riego => riego.valvula_id))].map(valvulaId =>
                    riegos.filter(riego => riego.valvula_id === valvulaId)
                        .reduce((acc, curr) => acc + curr.cantidad_agua, 0)
                ),
                backgroundColor: 'rgba(53, 86, 108, 0.77)',
                borderColor: 'rgb(4, 7, 9)',
                borderWidth: 1,
            },
        ],
    };

    // Gráfico de Válvulas por Estado y Ubicación
    const estados = valvulas.reduce((acc, valvula) => {
        acc[valvula.estado] = (acc[valvula.estado] || 0) + 1;
        return acc;
    }, {});
    const ubicaciones = valvulas.reduce((acc, valvula) => {
        acc[valvula.ubicacion] = (acc[valvula.ubicacion] || 0) + 1;
        return acc;
    }, {});

    const dataEstado = Object.keys(estados).map((key, index) => ({
        name: key,
        value: estados[key],
        color: COLORS[index % COLORS.length],
    }));

    const dataUbicacion = Object.keys(ubicaciones).map((key, index) => ({
        name: key,
        value: ubicaciones[key],
        color: COLORS[index % COLORS.length],
    }));

    // Gráfico de Usuarios por Sexo, Rol, y Tipo de Usuario
    const sexData = usuarios.reduce((acc, user) => {
        acc[user.sexo] = (acc[user.sexo] || 0) + 1;
        return acc;
    }, {});
    const sexDataArray = Object.keys(sexData).map((key) => ({
        name: key,
        value: sexData[key],
    }));

    const roleData = usuarios.reduce((acc, user) => {
        acc[user.rol] = (acc[user.rol] || 0) + 1;
        return acc;
    }, {});
    const roleDataArray = Object.keys(roleData).map((key) => ({
        name: key,
        value: roleData[key],
    }));

    const userTypeData = usuarios.reduce((acc, user) => {
        acc[user.tipo] = (acc[user.tipo] || 0) + 1;
        return acc;
    }, {});
    const userTypeDataArray = Object.keys(userTypeData).map((key) => ({
        name: key,
        value: userTypeData[key],
    }));

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {/* Gráfico de Sensores */}
            <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="h6">Distribución de Sensores por Tipo</Typography>
                <Doughnut data={typeData} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
                <Typography variant="h6">Distribución de Sensores por Zona</Typography>
                <Bar data={zoneData} options={{
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: { x: { beginAtZero: true } },
                }} />
            </Box>

            {/* Gráfico de Riego */}
            <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="h6">Gráfico de Riegos (Líneas y Barras)</Typography>
                <Line data={dataLine} />
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
                <Typography variant="h6">Gráfico de Barras por Válvula</Typography>
                <Bar data={dataBar} />
            </Box>

            {/* Gráficos de Válvulas */}
            <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="h6">Gráfico de Válvulas por Estado</Typography>
                <PieChart width={300} height={300}>
                    <Pie data={dataEstado} dataKey="value" cx={150} cy={150} innerRadius={30} outerRadius={100}>
                        {dataEstado.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <RechartsTooltip />
                    <RechartsLegend />
                </PieChart>
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
                <Typography variant="h6">Gráfico de Válvulas por Ubicación</Typography>
                <PieChart width={300} height={300}>
                    <Pie data={dataUbicacion} dataKey="value" cx={150} cy={150} innerRadius={30} outerRadius={100}>
                        {dataUbicacion.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <RechartsTooltip />
                    <RechartsLegend />
                </PieChart>
            </Box>

            {/* Gráficos de Usuarios */}
            <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="h6">Distribución de Usuarios por Sexo</Typography>
                <PieChart width={300} height={300}>
                    <Pie data={sexDataArray} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                        {sexDataArray.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip />
                    <RechartsLegend />
                </PieChart>
            </Box>
            <Box sx={{ gridColumn: 'span 1' }}>
                <Typography variant="h6">Distribución de Usuarios por Rol</Typography>
                <BarChart data={roleDataArray} width={300} height={200}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill={COLORS[0]} />
                </BarChart>
            </Box>
        </Box>
    );
};

export default Dashboard;
