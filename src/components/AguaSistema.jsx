import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from '@mui/material'; // Importa Pagination de MUI

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function AguaSistema() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [], // X-Axis labels
        datasets: [
            {
                label: 'Agua Detectada',
                data: [], // Datos de agua detectada
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'Posición Servo',
                data: [], // Datos de la posición del servo
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            }
        ]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // Número de elementos por página
    const [notification, setNotification] = useState(''); // Notificación de alerta

    useEffect(() => {
        // Hacer la solicitud GET para obtener los datos de la base de datos
        fetchData();
        const interval = setInterval(() => {
            fetchData(); // Actualizar cada 5 segundos
        }, 5000);

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, []);

    // Obtener los datos de la API
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/agSistema');  // Cambié la URL aquí
            const newData = await response.json();
            setData(newData); // Guardar los datos recibidos
            updateChartData(newData); // Actualizar los datos para los gráficos
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Actualiza los datos para el gráfico
    const updateChartData = (data) => {
        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const aguaData = data.map(row => row.agua_detectada);
        const servoData = data.map(row => row.posicion_servo);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Agua Detectada',
                    data: aguaData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                },
                {
                    label: 'Posición Servo',
                    data: servoData,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                }
            ]
        });
    };

    // Función para cambiar la página de la tabla
    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcular los índices de las filas actuales
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Paginación de la tabla
    const pageCount = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="App">
            <h1 className="text-center mb-4">Gráficas de Agua y Servo</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Gráfico Agua Detectada</h3>
                    <Line data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: 'Agua Detectada',
                                data: chartData.datasets[0].data,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                fill: false,
                            }
                        ]
                    }} />
                </div>
                <div className="col-md-6">
                    <h3>Gráfico Posición Servo</h3>
                    <Line data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: 'Posición Servo',
                                data: chartData.datasets[1].data,
                                borderColor: 'rgba(153, 102, 255, 1)',
                                fill: false,
                            }
                        ]
                    }} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h2>Datos Agua Detectada</h2>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Agua Detectada</th>
                                <th>Posición Servo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.agua_detectada}</td>
                                    <td>{row.posicion_servo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notificación */}
            {notification && <div className="alert alert-info">{notification}</div>}

            {/* Paginación con MUI */}
            <div className="pagination-container d-flex justify-content-center my-4">
                <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    siblingCount={1}
                />
            </div>
        </div>
    );
}

export default AguaSistema;
