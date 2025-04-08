import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap'; // Paginación de Bootstrap
import { Line, Bar } from 'react-chartjs-2'; // Importar componentes de gráficos de Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AguaList() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // Número de elementos por página
    const [notification, setNotification] = useState(''); // Notificación de alerta
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
            const response = await fetch('http://localhost:3000/api/agUsuario');
            const newData = await response.json();
            setData(newData); // Guardar los datos recibidos
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Función para convertir los valores de agua a su representación
    const getAguaLabel = (agua) => agua === 1 ? 'HAY AGUA' : 'NO HAY AGUA';

    // Función para convertir los valores de posición del servo a su representación
    const getServoLabel = (posicion) => {
        if (posicion === 0) return 'CERRADO';
        if (posicion === 90) return 'ABIERTO';
        return 'Posición desconocida';
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

    // Obtener los últimos valores de agua y posición servo
    const lastRow = data[data.length - 1];

    // Datos para el gráfico de agua
    const aguaData = data.map(row => getAguaLabel(row.agua_detectada));
    const aguaLabels = data.map((_, index) => `Registro ${index + 1}`);

    // Datos para el gráfico de posición del servo
    const servoData = data.map(row => row.posicion_servo);
    const servoLabels = data.map((_, index) => `Registro ${index + 1}`);

    // Opciones para el gráfico de agua (gráfico de barras)
    const aguaChartData = {
        labels: aguaLabels,
        datasets: [
            {
                label: 'Estado de Agua Detectada',
                data: aguaData.map(status => status === 'HAY AGUA' ? 1 : 0), // 1 para HAY AGUA, 0 para NO HAY AGUA
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Opciones para el gráfico de servo (gráfico de líneas)
    const servoChartData = {
        labels: servoLabels,
        datasets: [
            {
                label: 'Posición del Servo',
                data: servoData,
                fill: false,
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div 
            className="App" 
            style={{
                backgroundImage: 'url("https://i.pinimg.com/736x/01/7f/7c/017f7c711c5945e3217b2af2b5f84bfb.jpg")', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                minHeight: '100vh',
                color: 'white'
            }}
        >
            <div className="d-flex justify-content-between mb-4" style={{ marginBottom: '35px' }}>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/perfil')}>
                    <i className="fas fa-arrow-left me-2"></i> Regreso
                </button>
                <button className="btn btn-outline-info" onClick={() => navigate('/aguasis')}>
                    <i className="fas fa-history me-2"></i> Historial
                </button>
            </div>
            <h1 className="text-center mb-4">Estado de Agua y Servo</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Último Estado de Agua Detectada</h3>
                    <div className="alert alert-info text-center" style={{ backgroundColor: 'rgba(0, 123, 255, 0.6)' }}>
                        {lastRow ? getAguaLabel(lastRow.agua_detectada) : 'Cargando...'}
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>Último Estado de Posición del Servo</h3>
                    <div className="alert alert-info text-center" style={{ backgroundColor: 'rgba(0, 123, 255, 0.6)' }}>
                        {lastRow ? getServoLabel(lastRow.posicion_servo) : 'Cargando...'}
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Gráfico de Estado de Agua</h2>
                    <Bar data={aguaChartData} options={{ responsive: true }} />
                </div>
                <div className="col-md-6">
                    <h2>Gráfico de Posición del Servo</h2>
                    <Line data={servoChartData} options={{ responsive: true }} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h2>Datos Agua Detectada</h2>
                    <table className="table table-bordered table-striped" style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)', color: 'white' }}>
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Agua Detectada</th>
                                <th style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>Posición Servo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{getAguaLabel(row.agua_detectada)}</td>
                                    <td style={{ backgroundColor: 'rgba(102, 100, 100, 0.45)' , color:'white' }}>{getServoLabel(row.posicion_servo)}</td>
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

export default AguaList;
