// RiegoGrafico.jsx
import React from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Importamos el gráfico de barras también
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
            },
            {
                label: 'Duración (min)',
                data: riegos.map(riego => riego.duracion), // Datos de la duración
                borderColor: 'rgb(11, 47, 53)',
                backgroundColor: 'rgba(27, 24, 46, 0.16)',
                fill: true,
            },
        ],
    };

    // Preparamos los datos para el gráfico de barras (por válvula)
    // Creamos un objeto que cuente la cantidad total de agua por cada válvula
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
        <div>
            <h3>Gráfico de Riegos (Líneas y Barras)</h3>
            <div>
                <h4>Gráfico de Líneas</h4>
                <Line data={dataLine} />
            </div>
            <div>
                <h4>Gráfico de Barras (por Válvula)</h4>
                <Bar data={dataBar} />
            </div>
        </div>
    );
};

export default RiegoGrafico;
