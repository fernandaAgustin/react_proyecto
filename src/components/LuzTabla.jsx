import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FaSignOutAlt, FaDownload } from 'react-icons/fa'; // Importamos los iconos
import Pagination from '@mui/material/Pagination'; // Importa el componente de paginación de MUI

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function LuzTabla() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Nivel de Luz',
                data: [],
                borderColor: 'rgba(255, 204, 0, 1)',
                fill: false,
                borderWidth: 3,
            },
            {
                label: 'Estado del LED',
                data: [],
                borderColor: 'rgba(0, 255, 0, 1)',
                fill: false,
                borderWidth: 3,
                borderDash: [5, 5],
                yAxisID: 'y1',
            }
        ]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [luzFilter, setLuzFilter] = useState('');
    const [estadoLedFilter, setEstadoLedFilter] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            updateChartData(data);
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://18.191.201.190/api/luzSistema');
            const newData = await response.json();
            setData(newData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const updateChartData = (data) => {
        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const luzData = data.map(row => row.luz);
        const ledStatusData = data.map(row => (row.estado_led.toLowerCase() === 'encendido' ? 1 : 0));

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Nivel de Luz',
                    data: luzData,
                    borderColor: 'rgba(255, 204, 0, 1)',
                    fill: false,
                    borderWidth: 3,
                },
                {
                    label: 'Estado del LED',
                    data: ledStatusData,
                    borderColor: 'rgba(0, 255, 0, 1)',
                    fill: false,
                    borderWidth: 3,
                    borderDash: [5, 5],
                    yAxisID: 'y1',
                }
            ]
        });
    };

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.length ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : data.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(filteredData.length ? filteredData.length : data.length / itemsPerPage);

    const handleFilter = () => {
        let filtered = data;

        if (luzFilter) {
            filtered = filtered.filter(item => item.luz === parseFloat(luzFilter));
        }

        if (estadoLedFilter) {
            filtered = filtered.filter(item => item.estado_led.toLowerCase() === estadoLedFilter.toLowerCase());
        }

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData.length ? filteredData : data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos Luz');
        XLSX.writeFile(wb, 'datos_luz.xlsx');
    };

    return (
        <div className="App" style={{ 
            backgroundImage: 'url(https://i.pinimg.com/736x/01/7f/7c/017f7c711c5945e3217b2af2b5f84bfb.jpg)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            minHeight: '100vh',
            padding: '20px',
            color: 'white' 
        }}>
        <div className="App">
            <div className="d-flex justify-content-between mb-4">
                {/* Botón de Salir con ícono */}
                <Link to="/perfil" className="btn btn-danger d-flex align-items-center">
                    <FaSignOutAlt className="me-2" />
                    Dashboard
                </Link>
            </div>

            <h1 className="text-center mb-4">Gráficas de Luz</h1>

            <div className="row mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                    <div style={{ width: '80%' }}>
                        <h3>Gráfico de Luz y Estado del LED</h3>
                        <Line data={chartData} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                                y1: {
                                    beginAtZero: true,
                                    position: 'right',
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Nivel de Luz"
                            value={luzFilter}
                            onChange={(e) => setLuzFilter(e.target.value)}
                        />
                        <select
                            className="form-control"
                            value={estadoLedFilter}
                            onChange={(e) => setEstadoLedFilter(e.target.value)}
                        >
                            <option value="">Estado del Luces</option>
                            <option value="encendido">Encendido</option>
                            <option value="apagado">Apagado</option>
                        </select>
                        <button className="btn btn-primary" onClick={handleFilter}>Filtrar</button>
                    </div>
                </div>
            </div>
            {/* Botón de Descargar Excel con ícono */}
            <button className="btn btn-success d-flex align-items-center" onClick={handleExport}>
                <FaDownload className="me-2" />
                Descargar Excel
            </button>
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center">Datos de Luz</h2>
                    <table className="table table-bordered table-striped text-center">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Luz</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Estado del LED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.luz}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.estado_led.toLowerCase()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pagination-container d-flex justify-content-center my-4">
                <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "white", // Cambia el color de las letras a blanco
                        }
                    }}
                />
            </div>
        </div>
        </div>
    );
}

export default LuzTabla;
