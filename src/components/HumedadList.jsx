import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';
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
                    borderColor: 'rgb(61, 112, 81)',
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
                <div className="col-md-6" style={{ backgroundColor: 'rgba(185, 180, 180, 0.74)' , color:'black' }}>
                    <Line data={chartData} />
                </div>
                <div className="col-md-6" style={{ backgroundColor: 'rgba(185, 180, 180, 0.74)' , color:'black' }}>
                    <Line data={distanceData} />
                </div>
            </div>
            <div className="row mb-4">
            <center>
                
                </center>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h3 className="text-center">Tabla de Datos</h3>
                    <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Humedad Zona A</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Humedad Zona B</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Nivel de Agua</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Bomba A</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Bomba Respaldo A</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Bomba B</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Bomba Respaldo B</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.humedad_suelo1}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.humedad_suelo2}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.distancia1}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.estado_bomba1}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.estado_bomba2}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.estado_bomba3}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.estado_bomba4}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
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
