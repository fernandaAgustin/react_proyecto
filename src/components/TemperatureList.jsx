import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap'; // Paginación de Bootstrap
import { FaFan } from 'react-icons/fa'; // Ícono de ventilador de react-icons
import { useNavigate } from 'react-router-dom';

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
        labels: [], 
        datasets: [
            {
                label: 'Temperatura 1',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)', // Línea roja
                fill: false,
                borderWidth: 4,
            },
            {
                label: 'Temperatura 2',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)', // Línea azul
                fill: false,
                borderWidth: 4,
            }
        ]
    });
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [fanStatus, setFanStatus] = useState({
        temp1: 'apagado',
        temp2: 'apagado',
    });
    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://18.191.201.190/api/temusuario');
            const newData = await response.json();
            setData(newData);
            updateChartData(newData);
            checkFanStatus(newData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

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
                    borderColor: 'rgba(255, 99, 132, 1)', // Línea roja
                    fill: false,
                    borderWidth: 4,
                },
                {
                    label: 'Temperatura 2',
                    data: temp2Data,
                    borderColor: 'rgba(54, 162, 235, 1)', // Línea azul
                    fill: false,
                    borderWidth: 4,
                }
            ]
        });
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    return (
        <div>
            <h1 className="text-center mb-4" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color:'black' }}>Temperatura</h1>
            <div className="row mb-4">
                <div className="d-flex justify-content-between mb-4" style={{ marginBottom: '35px' }}>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/perfil')}>
                        <i className="fas fa-arrow-left me-2"></i> Regreso
                    </button>
                    <button className="btn btn-outline-info" onClick={() => navigate('/tablatem')}>
                        <i className="fas fa-history me-2"></i> Historial
                    </button>
                </div>
                <div className="col-md-6"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.56)', // Fondo blanco con transparencia
                    border: '1px solid rgba(255, 255, 255, 0.5)', // Borde transparente
                    opacity: 0.9, // Opacidad de la tabla para mayor transparencia
                }}
                >
                    <h3>Datos Estadísticos</h3>
                    <Line data={{
                        labels: chartData.labels,
                        datasets: chartData.datasets
                    }} />
                </div>
            
            </div>
<div className="row">
    <div className="col-md-12">
        <h3 className="text-center">Datos</h3>
        <table
            className="table table-bordered table-striped text-center"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // Fondo blanco con transparencia
                border: '1px solid rgba(255, 255, 255, 0.5)', // Borde transparente
                opacity: 0.9, // Opacidad de la tabla para mayor transparencia
            }}
        >
            <thead>
                <tr>
                    <th style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>Temperatura 1</th>
                    <th style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>Temperatura 2</th>
                    <th style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>Estado del Ventilador 1</th>
                    <th style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>Estado del Ventilador 2</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((row, index) => (
                    <tr key={index}>
                        <td style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>{row.nivel_temperatura1}</td>
                        <td style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>{row.nivel_temperatura2}</td>
                        <td style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>{row.estado_ventilador1}</td>
                        <td style={{ backgroundColor: 'rgba(49, 48, 48, 0.12)' }}>{row.estado_ventilador2}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

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
