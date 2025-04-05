import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';
import { FaGasPump } from 'react-icons/fa'; // Import the pump icon
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

function HumedadList() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Humedad Zona "A"',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)', // Línea verde
                fill: false,
                borderWidth: 4,
            },
            {
                label: 'Humedad Zona "B"',
                data: [],
                borderColor: 'rgba(153, 102, 255, 1)', // Línea morada
                fill: false,
                borderWidth: 4,
            }
        ]
    });

    const [distanceData, setDistanceData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Nivel de Agua',
                data: [],
                borderColor: 'rgb(98, 200, 137)', 
                fill: false,
                borderWidth: 4,
            }
        ]
    });

    const [pumpStatus, setPumpStatus] = useState({
        pump1: 'apagada',
        pump2: 'apagada',
    });

    const [showAlertTemp1, setShowAlertTemp1] = useState(false); // For pump 1 alert
    const [showAlertTemp2, setShowAlertTemp2] = useState(false); // For pump 2 alert

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://18.191.201.190/api/humUsuario');
            const newData = await response.json();
            setData(newData);
            updateChartData(newData);
            updateDistanceData(newData);
            checkPumpStatus(newData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const updateChartData = (data) => {
        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const humidity1Data = data.map(row => row.humedad_suelo1);
        const humidity2Data = data.map(row => row.humedad_suelo2);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Humedad Zona "A"',
                    data: humidity1Data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    borderWidth: 4,
                },
                {
                    label: 'Humedad Zona "B"',
                    data: humidity2Data,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                    borderWidth: 4,
                }
            ]
        });
    };

    const updateDistanceData = (data) => {
        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const distanceDataArr = data.map(row => row.distancia1);

        setDistanceData({
            labels: labels,
            datasets: [
                {
                    label: 'Nivel de Agua',
                    data: distanceDataArr,
                    borderColor: 'rgb(98, 200, 137)',
                    fill: false,
                    borderWidth: 4,
                }
            ]
        });
    };

    const checkPumpStatus = (data) => {
        const lastData = data[data.length - 1];
        const newPumpStatus = {
            pump1: lastData.estado_bomba1 === 'encendido' ? 'encendido' : 'apagado',
            pump2: lastData.estado_bomba2 === 'encendido' ? 'encendido' : 'apagado',
        };
        setPumpStatus(newPumpStatus);

        // Handle alert visibility
        setShowAlertTemp1(lastData.estado_bomba1 === 'encendido');
        setShowAlertTemp2(lastData.estado_bomba2 === 'encendido');
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
            <h1 className="text-center mb-4">CONTROL DE SUELO</h1>
            <div className="row mb-4">
                <div className="d-flex justify-content-between mb-4" style={{ marginBottom: '40px' }}>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/perfil')}>
                    <i className="fas fa-arrow-left me-2"></i> Regreso
                </button>
                <button className="btn btn-outline-info" onClick={() => navigate('/shumedad')}>
                    <i className="fas fa-history me-2"></i> Historial
                </button>
                </div>
                <center><h3>Datos Estadísticos</h3></center>
                <div className="col-md-6">
                    <Line data={chartData} />
                </div>
                <div className="col-md-6">
                    <Line data={distanceData} />
                </div>
            </div>

            {showAlertTemp1 && (
                <center>
                <div className="alert alert-info mt-3" style={{ transition: 'opacity 0.5s' }}>
                    ¡BOMBA ENCENDIDA!
                </div>
                </center>
            )}
            {showAlertTemp2 && (
                <center>
                <div className="alert alert-info mt-3" style={{ transition: 'opacity 0.5s' }}>
                    ¡BOMBA DE EMERGENCIA ENCENDIDA!
                </div>
                </center>
            )}
            <div className="row mb-4">
            <center>
                <div className="col-md-5">
                    <div className={`bomba-status-box ${pumpStatus.pump1 === 'encendido' ? 'bg-primary' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center shadow-lg`}>
                        <FaGasPump size={15} color="white" /> {/* Updated icon */}
                        <span className="ml-3 text-white">{`BOMBA: ${pumpStatus.pump1}`}</span>
                    </div>
                    <div className={`bomba-status-box ${pumpStatus.pump2 === 'encendido' ? 'bg-primary' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center shadow-lg mt-3`}>
                        <FaGasPump size={15} color="white" /> {/* Updated icon */}
                        <span className="ml-3 text-white">{`BOMBA DE EMERGENCIA: ${pumpStatus.pump2}`}</span>
                    </div>
                </div>
                </center>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h3 className="text-center">Tabla de Datos</h3>
                    <table className="table table-bordered table-striped text-center">
                        <thead>
                            <tr>
                                <th>Humedad Suelo 1</th>
                                <th>Humedad Suelo 2</th>
                                <th>Distancia 1</th>
                                <th>Estado Bomba 1</th>
                                <th>Estado Bomba 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.humedad_suelo1}</td>
                                    <td>{row.humedad_suelo2}</td>
                                    <td>{row.distancia1}</td>
                                    <td>{row.estado_bomba1}</td>
                                    <td>{row.estado_bomba2}</td>
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

export default HumedadList;
