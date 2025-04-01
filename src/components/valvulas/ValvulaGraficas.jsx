import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = ["#14B8A6", "#8DD3C7", "#6A5ACD", "#9400D3", "#FF00FF"];

const GraficoValvulas = ({ valvulas }) => {
    const [dataEstado, setDataEstado] = useState([]);
    const [dataUbicacion, setDataUbicacion] = useState([]);

    useEffect(() => {
        if (valvulas.length > 0) {
            // Procesar datos por estado
            const estados = valvulas.reduce((acc, valvula) => {
                acc[valvula.estado] = (acc[valvula.estado] || 0) + 1;
                return acc;
            }, {});

            setDataEstado(Object.keys(estados).map((key, index) => ({
                name: key,
                value: estados[key],
                color: COLORS[index % COLORS.length]
            })));

            // Procesar datos por ubicación
            const ubicaciones = valvulas.reduce((acc, valvula) => {
                acc[valvula.ubicacion] = (acc[valvula.ubicacion] || 0) + 1;
                return acc;
            }, {});

            setDataUbicacion(Object.keys(ubicaciones).map((key, index) => ({
                name: key,
                value: ubicaciones[key],
                color: COLORS[index % COLORS.length]
            })));
        }
    }, [valvulas]);

    if (dataEstado.length === 0 || dataUbicacion.length === 0) return <p>Cargando gráficos...</p>;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{
                backgroundColor: "rgba(221, 234, 230, 0.44)",  // Color verde
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '50px',
                '&:hover': {
                    backgroundColor: "rgba(221, 234, 230, 0.44)",  // Color al pasar el mouse
                },
            }}
            color="black"
        >
            {/* Gráfico de Estado */}
            <Typography variant="h6" sx={{color:"black"}} gutterBottom>Gráfico de Válvulas por Estado</Typography>
            <PieChart width={300} height={300}>
                <Pie
                    data={dataEstado}
                    dataKey="value"
                    cx={150}
                    cy={150}
                    innerRadius={30}
                    outerRadius={100}
                    startAngle={-45}
                    endAngle={225}
                    paddingAngle={5}
                    cornerRadius={5}
                >
                    {dataEstado.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>

            {/* Gráfico de Ubicación */}
            <Typography variant="h6" sx={{color:"black"}} gutterBottom>Gráfico de Válvulas por Ubicación</Typography>
            <PieChart width={300} height={300}>
                <Pie
                    data={dataUbicacion}
                    dataKey="value"
                    cx={150}
                    cy={150}
                    innerRadius={30}
                    outerRadius={100}
                    startAngle={-45}
                    endAngle={225}
                    paddingAngle={5}
                    cornerRadius={5}
                >
                    {dataUbicacion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </Box>
    );
};

export default GraficoValvulas;
