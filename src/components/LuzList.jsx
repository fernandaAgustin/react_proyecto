import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap'; // Paginación de Bootstrap
import { FaLightbulb } from 'react-icons/fa'; // Icono de luz de react-icons
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

function LuzList() {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [], // X-Axis labels
        datasets: [
            {
                label: 'Luz',
                data: [], 
                borderColor: 'rgba(255, 204, 0, 1)', 
                fill: false,
                borderWidth: 4, 
            }
        ]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); 
    const [notification, setNotification] = useState(''); 
    const [ledStatus, setLedStatus] = useState(''); 
    const navigate = useNavigate();

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
            const response = await fetch('https://18.191.201.190/api/luzUsuario');
            const newData = await response.json();
            setData(newData); // Guardar los datos recibidos
            updateChartData(newData); // Actualizar los datos para los gráficos
            checkLedStatus(newData); // Comprobar el estado del LED
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Actualiza los datos para el gráfico
    const updateChartData = (data) => {
        const labels = data.map((row, index) => `Entrada ${index + 1}`);
        const luzData = data.map(row => row.luz);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Luz',
                    data: luzData,
                    borderColor: 'rgba(255, 204, 0, 1)', // Línea amarilla
                    fill: false,
                    borderWidth: 3,
                }
            ]
        });
    };

    // Verificar el estado del LED y mostrar alerta si está encendido
    const checkLedStatus = (data) => {
        const ledData = data.map(row => row.estado_led);
        const ledOn = ledData.some(status => status === 'Encendido');
        
        if (ledOn) {
            setLedStatus('encendido');
            setNotification('¡Alerta! El LED está Encendido.');
        } else {
            setLedStatus('apagado');
            setNotification('');
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
            <h1 className="text-center mb-4">Gráficas de Luz</h1>
            <div className="d-flex justify-content-between mb-4" style={{ marginBottom: '35px' }}>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/perfil')}>
                    <i className="fas fa-arrow-left me-2"></i> Regreso
                </button>
                <button className="btn btn-outline-info" onClick={() => navigate('/tablaluz')}>
                    <i className="fas fa-history me-2"></i> Historial
                </button>
                </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Estadísticos de Luces</h3>
                    <Line data={{
                        labels: chartData.labels,
                        datasets: [
                            {
                                label: 'Luz',
                                data: chartData.datasets[0].data,
                                borderColor: 'rgba(255, 204, 0, 1)', // Línea amarilla
                                fill: false,
                                borderWidth: 3,
                            }
                        ]
                    }} />
                </div>
                <div className="col-md-5">
                    <h3>Estado del LUCES</h3>
                    {/* Recuadro con icono y transiciones */}
                    <div 
                        className={`led-status-box ${ledStatus === 'encendido' ? 'bg-warning' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center shadow-lg`}
                        style={{ transition: 'background-color 0.5s, transform 0.3s' }}
                    >
                        <FaLightbulb size={25} color="white" />
                        <span className="ml-3 text-white">{ledStatus}</span>
                    </div>
                    {/* Muestra un mensaje adicional cuando el LED esté encendido */}
                    {ledStatus === 'encendido' && (
                        <div className="alert alert-danger mt-3" style={{ transition: 'opacity 0.5s' }}>
                            ¡El LED está ENCENDIDO!
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <h3 className="text-center">Datos de Luz </h3>
                    <table className="table table-bordered table-striped text-center">
                        <thead>
                            <tr>
                                <th>Luz</th>
                                <th>Estado del LED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.luz}</td>
                                    <td>{row.estado_led}</td>
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

export default LuzList;
