import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function SistemaHumedad() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [distanceData, setDistanceData] = useState({ labels: [], datasets: [] });
    const [pumpStatus, setPumpStatus] = useState({ pump1: 'apagada', pump2: 'apagada' });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const [filters, setFilters] = useState({
        humedad_suelo1: '',
        humedad_suelo2: '',
        distancia1: '',
        estado_bomba1: '',
        estado_bomba2: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/humSistema');
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
        const labels = data.map((_, index) => `Entrada ${index + 1}`);
        const humidity1Data = data.map(row => row.humedad_suelo1);
        const humidity2Data = data.map(row => row.humedad_suelo2);

        setChartData({
            labels,
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
        const labels = data.map((_, index) => `Entrada ${index + 1}`);
        const distanceDataArr = data.map(row => row.distancia1);

        setDistanceData({
            labels,
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
        setPumpStatus({
            pump1: lastData.estado_bomba1 === 'encendido' ? 'encendido' : 'apagado',
            pump2: lastData.estado_bomba2 === 'encendido' ? 'encendido' : 'apagado',
        });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
        setCurrentPage(1);
    };

    const filteredData = data.filter(row =>
        (filters.humedad_suelo1 === '' || row.humedad_suelo1.toString() === filters.humedad_suelo1) &&
        (filters.humedad_suelo2 === '' || row.humedad_suelo2.toString() === filters.humedad_suelo2) &&
        (filters.distancia1 === '' || row.distancia1.toString() === filters.distancia1) &&
        (filters.estado_bomba1 === '' || row.estado_bomba1 === filters.estado_bomba1) &&
        (filters.estado_bomba2 === '' || row.estado_bomba2 === filters.estado_bomba2)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DatosFiltrados");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'datos_filtrados.xlsx');
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
        <div className="App container mt-4">
            <h1 className="text-center mb-4">CONTROL DE SUELO</h1>

            <div className="d-flex justify-content-between mb-4">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/perfil')}>
                    <i className="fas fa-arrow-left me-2"></i> Dashboard
                </button>
            </div>

            <center><h3>Datos Estadísticos</h3></center>
            <div className="row mb-4">
                <div className="col-md-6">
                    <Line data={chartData} />
                </div>
                <div className="col-md-6">
                    <Line data={distanceData} />
                </div>
            </div>

            <div className="row mb-3">
                {["humedad_suelo1", "humedad_suelo2", "distancia1", "estado_bomba1", "estado_bomba2"].map((field, idx) => (
                    <div className="col-md-2 mb-2" key={idx}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={field.replaceAll('_', ' ')}
                            name={field}
                            value={filters[field]}
                            onChange={handleFilterChange}
                        />
                    </div>
                ))}
            </div>

            <div className="text-end mb-3">
                <button className="btn btn-success" onClick={exportToExcel}>
                    <i className="fas fa-file-excel me-2"></i> Exportar a Excel
                </button>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <h3 className="text-center">Tabla de Datos</h3>
                    <table className="table table-bordered table-striped text-center">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Humedad Suelo 1</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Humedad Suelo 2</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Distancia 1</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Estado Bomba 1</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Estado Bomba 2</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {pageCount > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Stack spacing={2}>
                        <Pagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: "white", // Cambia el color de las letras a blanco
                                }
                            }}
                        />
                    </Stack>
                </div>
            )}
        </div>
        </div>
    );
}

export default SistemaHumedad;
