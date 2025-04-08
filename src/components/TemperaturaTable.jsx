import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileExcel } from 'react-icons/fa'; // Importar iconos de react-icons
import { Pagination } from '@mui/material'; // Importar la paginación de MUI

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
    const [filterZoneA, setFilterZoneA] = useState({ temp1: '', fanStatus1: '' });
    const [filterZoneB, setFilterZoneB] = useState({ temp2: '', fanStatus2: '' });

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

        if (temp1 > 30 || temp2 > 25) {
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

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtrar los datos según el filtro de zona A y B
    const filteredData = data.filter((row) => {
        const temp1Match = filterZoneA.temp1 ? row.nivel_temperatura1 === parseFloat(filterZoneA.temp1) : true;
        const fanStatus1Match = filterZoneA.fanStatus1 ? row.estado_ventilador1 === filterZoneA.fanStatus1 : true;
        const temp2Match = filterZoneB.temp2 ? row.nivel_temperatura2 === parseFloat(filterZoneB.temp2) : true;
        const fanStatus2Match = filterZoneB.fanStatus2 ? row.estado_ventilador2 === filterZoneB.fanStatus2 : true;

        return temp1Match && fanStatus1Match && temp2Match && fanStatus2Match;
    });

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const exportToExcel = () => {
        const filteredDataForExcel = filteredData.map(row => ({
            'Temperatura 1': row.nivel_temperatura1,
            'Temperatura 2': row.nivel_temperatura2,
            'Estado Ventilador 1': row.estado_ventilador1,
            'Estado Ventilador 2': row.estado_ventilador2
        }));

        const ws = XLSX.utils.json_to_sheet(filteredDataForExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Temperaturas');

        XLSX.writeFile(wb, 'Temperatura.xlsx');
    };

    return (
        <div className="App" style={{ 
            backgroundImage: 'url("https://i.pinimg.com/736x/01/7f/7c/017f7c711c5945e3217b2af2b5f84bfb.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', 
            color: 'white' // Para que el texto se vea bien sobre el fondo
        }}>
            {/* Botón "Ir a Perfil" */}
            <Link to="/perfil" className="mx-2">
                <button className="btn btn-transparent">
                    <FaArrowLeft className="mr-2" /> Dashboard
                </button>
            </Link>
            <h1 className="text-center mb-4">Gráficas de Temperatura</h1>

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

            {/* Formulario para filtros */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Filtrar Datos Zona A</h3>
                    <Form>
                        <Form.Group controlId="filterTemp1">
                            <Form.Label>Temperatura 1</Form.Label>
                            <Form.Control
                                type="number"
                                value={filterZoneA.temp1}
                                onChange={(e) => setFilterZoneA({ ...filterZoneA, temp1: e.target.value })}
                                placeholder="Ingrese temperatura"
                            />
                        </Form.Group>
                        <Form.Group controlId="filterFanStatus1">
                            <Form.Label>Estado Ventilador 1</Form.Label>
                            <Form.Control
                                as="select"
                                value={filterZoneA.fanStatus1}
                                onChange={(e) => setFilterZoneA({ ...filterZoneA, fanStatus1: e.target.value })}
                            >
                                <option value="">Todos</option>
                                <option value="encendido">Encendido</option>
                                <option value="apagado">Apagado</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
                <div className="col-md-6">
                    <h3>Filtrar Datos Zona B</h3>
                    <Form>
                        <Form.Group controlId="filterTemp2">
                            <Form.Label>Temperatura 2</Form.Label>
                            <Form.Control
                                type="number"
                                value={filterZoneB.temp2}
                                onChange={(e) => setFilterZoneB({ ...filterZoneB, temp2: e.target.value })}
                                placeholder="Ingrese temperatura"
                            />
                        </Form.Group>
                        <Form.Group controlId="filterFanStatus2">
                            <Form.Label>Estado Ventilador 2</Form.Label>
                            <Form.Control
                                as="select"
                                value={filterZoneB.fanStatus2}
                                onChange={(e) => setFilterZoneB({ ...filterZoneB, fanStatus2: e.target.value })}
                            >
                                <option value="">Todos</option>
                                <option value="encendido">Encendido</option>
                                <option value="apagado">Apagado</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
            </div>

            {/* Botón "Imprimir Excel" */}
            <button className="btn btn-primary ml-2" onClick={exportToExcel}>
                <FaFileExcel className="mr-2" /> Imprimir Excel
            </button>

            <div className="row">
                {/* Datos Zona A y B */}
                <div className="col-md-6">
                    <h2>Datos Zona A</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white'}}>Temperatura 1</th>
                                    <th style={{backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white'}}>Estado Ventilador 1</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.nivel_temperatura1}</td>
                                        <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' ,color:'white' }}>{row.estado_ventilador1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-6">
                    <h2>Datos Zona B</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white'}}>Temperatura 2</th>
                                    <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)', color:'white' }}>Estado Ventilador 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)', color:'white'}}>{row.nivel_temperatura2}</td>
                                        <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{row.estado_ventilador2}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Paginación con MUI */}
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

            {notification && (
                <div className="alert alert-info mt-4">
                    <strong>Notificación:</strong> {notification}
                </div>
            )}
        </div>
    );
}

export default TemperaturaTable;
