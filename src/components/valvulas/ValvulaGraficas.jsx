import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography, Paper, useMediaQuery, useTheme } from "@mui/material";

// Paletas de colores para cada gráfico
const COLORS_ESTADO = ["#14B8A6", "#8DD3C7", "#6A5ACD", "#9400D3", "#FF00FF"];
const COLORS_UBICACION = ["#FF6347", "#FFD700", "#32CD32", "#8A2BE2", "#FF4500"];

const GraficoValvulas = ({ valvulas }) => {
    const [dataEstado, setDataEstado] = useState([]);
    const [dataUbicacion, setDataUbicacion] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (valvulas.length > 0) {
            // Agrupar por estado
            const estados = valvulas.reduce((acc, valvula) => {
                acc[valvula.estado] = (acc[valvula.estado] || 0) + 1;
                return acc;
            }, {});
            setDataEstado(
                Object.keys(estados).map((key, index) => ({
                    name: key,
                    value: estados[key],
                    color: COLORS_ESTADO[index % COLORS_ESTADO.length],
                }))
            );

            // Agrupar por ubicación
            const ubicaciones = valvulas.reduce((acc, valvula) => {
                acc[valvula.ubicacion] = (acc[valvula.ubicacion] || 0) + 1;
                return acc;
            }, {});
            setDataUbicacion(
                Object.keys(ubicaciones).map((key, index) => ({
                    name: key,
                    value: ubicaciones[key],
                    color: COLORS_UBICACION[index % COLORS_UBICACION.length],
                }))
            );
        }
    }, [valvulas]);

    if (dataEstado.length === 0 || dataUbicacion.length === 0) return <p>Cargando gráficos...</p>;

    return (
        <Box sx={{ p: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 4,
                    flexWrap: 'wrap',
                }}
            >
                {/* Gráfico de Estado */}
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 5,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                        },
                        color: 'white',
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight:500 ,color: "black" }}>
                        Válvulas por Estado
                    </Typography>
                    <PieChart width={250} height={250}>
                        <Pie
                            data={dataEstado}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            paddingAngle={5}
                            startAngle={-45}
                            endAngle={225}
                            cornerRadius={5}
                        >
                            {dataEstado.map((entry, index) => (
                                <Cell key={`cell-estado-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Paper>

                {/* Gráfico de Ubicación */}
                <Paper
                    sx={{
                        p: 2,
                        borderRadius: 5,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                        },
                        color: 'white',
                    }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 ,color: "black" }}>
                        Válvulas por Ubicación
                    </Typography>
                    <PieChart width={250} height={250}>
                        <Pie
                            data={dataUbicacion}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            paddingAngle={5}
                            startAngle={-45}
                            endAngle={225}
                            cornerRadius={5}
                        >
                            {dataUbicacion.map((entry, index) => (
                                <Cell key={`cell-ubicacion-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Paper>
            </Box>
        </Box>
    );
};

export default GraficoValvulas;
