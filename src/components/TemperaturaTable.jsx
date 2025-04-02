import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function TemperaturaTable() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Temperatura 1',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'Temperatura 2',
                data: [],
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            }
        ]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [fanStatus, setFanStatus] = useState('Apagado');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData(); // Actualizar cada 5 segundos
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/temSistema');
            if (!response.ok) {
                throw new Error('No se pudo obtener los datos de la API');
            }
            const newData = await response.json();
            console.log(newData); // Verifica los datos recibidos
            setData(newData);
            updateChartData(newData);
            checkFanStatus(newData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setNotification('Error al obtener los datos. Intente nuevamente.');
        }
    };

    const updateChartData = (data) => {
        if (!data || data.length === 0) {
            console.error('No se recibieron datos válidos');
            return;
        }

        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const temp1Data = data.map(row => row.nivel_temperatura1 || 0);
        const temp2Data = data.map(row => row.nivel_temperatura2 || 0);

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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="App">
            <h1 className="text-center mb-4">Gráficas de Temperatura y Ventilador</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Gráfico Temperatura 1</h3>
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
                    <h3>Gráfico Temperatura 2</h3>
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
                                <th>Temperatura 1</th>
                                <th>Estado Ventilador 1</th>
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
                                <th>Temperatura 2</th>
                                <th>Estado Ventilador 2</th>
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

            {notification && <div className="alert alert-info">{notification}</div>}

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

export default TemperaturaTable;
