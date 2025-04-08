// src/components/UserStats.js
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';

// Colores personalizados
const COLORS = ['#00E4FF', '#36A2EB', '#FF00FF', '#FF6347', '#32CD32', '#FFD700'];

const UserStats = ({ usuarios }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (!usuarios || usuarios.length === 0) {
        return <Typography color="white">Cargando estadísticas...</Typography>;
    }

    // Función para agrupar datos
    const groupBy = (data, key) =>
        Object.entries(data.reduce((acc, item) => {
            acc[item[key]] = (acc[item[key]] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value }));

    const sexData = groupBy(usuarios, "sexo");
    const roleData = groupBy(usuarios, "rol");

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                padding: 2,
            }}
        >
            {/* Roles - Barras */}
            <Paper
                elevation={6}
                sx={{
                    width: isSmallScreen ? '100%' : '45%',
                    minWidth: 300,
                    padding: 3,
                    borderRadius: '20px',
                    background: 'linear-gradient(to bottom right, rgba(0,228,255,0.1), rgba(54,162,235,0.1))',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                }}
            >
                <Typography gutterBottom textAlign="center" sx={{color: "black"}}>
                    Distribución por Rol
                </Typography>
                <Box sx={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={roleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip formatter={(value) => `${value} usuario(s)`} />
                            <Legend iconType="circle" />
                            <Bar dataKey="value" fill="#00E4FF" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* Género - Pastel */}
            <Paper
                elevation={6}
                sx={{
                    width: isSmallScreen ? '100%' : '45%',
                    minWidth: 300,
                    padding: 3,
                    borderRadius: '20px',
                    background: 'linear-gradient(to bottom right, rgba(255,0,255,0.1), rgba(50,205,50,0.1))',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                }}
            >
                <Typography  gutterBottom textAlign="center" sx={{color: "black"}}> 
                    Distribución por Género
                </Typography>
                <Box sx={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={sexData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            >
                                {sexData.map((entry, index) => (
                                    <Cell key={`sex-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} usuario(s)`, name]} />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserStats;
