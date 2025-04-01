import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';  // Paginación de Bootstrap

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function TemperatureList() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [], // X-Axis labels
        datasets: [
            {
                label: 'Temperatura 1',
                data: [], // Datos de temperatura 1
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'Temperatura 2',
                data: [], // Datos de temperatura 2
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            }
        ]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);  // Número de elementos por página
    const [fanStatus, setFanStatus] = useState('Apagado');  // Estado del ventilador
    const [notification, setNotification] = useState('');

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
            const response = await fetch('http://localhost:3000/api/agUsuario');
            const newData = await response.json();
            setData(newData); // Guardar los datos recibidos
            updateChartData(newData); // Actualizar los datos para los gráficos
            checkFanStatus(newData); // Verificar el estado del ventilador
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Actualiza los datos para el gráfico
    const updateChartData = (data) => {
        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const temp1Data = data.map(row => row.nivel_temperatura1);
        const temp2Data = data.map(row => row.nivel_temperatura2);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Temperatura 1',
                    data: temp1Data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                },
                {
                    label: 'Temperatura 2',
                    data: temp2Data,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                }
            ]
        });
    };

    // Verificar el estado del ventilador basado en la temperatura
    const checkFanStatus = (data) => {
        const temp1 = data[data.length - 1]?.nivel_temperatura1;
        const temp2 = data[data.length - 1]?.nivel_temperatura2;

        // Condición para encender el ventilador
        if (temp1 > 30 || temp2 > 30) {
            if (fanStatus !== 'Encendido') {
                setFanStatus('Encendido');
                setNotification('¡Alerta! El ventilador se ha encendido debido a la temperatura alta.');
                alert('¡Alerta! El ventilador se ha encendido debido a la temperatura alta.');
            }
        } else {
            if (fanStatus !== 'Apagado') {
                setFanStatus('Apagado');
                setNotification('El ventilador está apagado, temperatura dentro de rango.');
                alert('El ventilador está apagado, temperatura dentro de rango.');
            }
        }
    };

    // Función para cambiar la página de la tabla
    const handlePageChange = (pageNumber) => {
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
            <h1 className="text-center mb-4">Gráficas de Sensores</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Gráfico Zona A</h3>
                    <Line data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: 'Temperatura 1',
                                data: chartData.datasets[0].data,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                fill: false,
                            }
                        ]
                    }} />
                </div>
                <div className="col-md-6">
                    <h3>Gráfico Zona B</h3>
                    <Line data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: 'Temperatura 2',
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
                    <h2>Datos Zona A</h2>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Temperatura</th>
                                <th>Estado del Ventilador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.nivel_temperatura1}</td>
                                    <td>{row.estado_ventilador1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-md-6">
                    <h2>Datos Zona B</h2>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Temperatura</th>
                                <th>Estado del Ventilador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.nivel_temperatura2}</td>
                                    <td>{row.estado_ventilador2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notificación */}
            {notification && <div className="alert alert-info">{notification}</div>}

            {/* Paginación Mejorada */}
            <div className="pagination-container d-flex justify-content-center my-4">
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(pageCount)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount} />
                </Pagination>
            </div>
        </div>
    );
}

export default TemperatureList;
