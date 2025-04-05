import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap'; // Paginación de Bootstrap

function AguaList() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // Número de elementos por página
    const [notification, setNotification] = useState(''); // Notificación de alerta

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

    return (
        <div className="App">
            <h1 className="text-center mb-4">Estado de Agua y Servo</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h3>Último Estado de Agua Detectada</h3>
                    <div className="alert alert-info text-center">
                        {lastRow ? getAguaLabel(lastRow.agua_detectada) : 'Cargando...'}
                    </div>
                </div>
                <div className="col-md-6">
                    <h3>Último Estado de Posición del Servo</h3>
                    <div className="alert alert-info text-center">
                        {lastRow ? getServoLabel(lastRow.posicion_servo) : 'Cargando...'}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <h2>Datos Agua Detectada</h2>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Agua Detectada</th>
                                <th>Posición Servo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{getAguaLabel(row.agua_detectada)}</td>
                                    <td>{getServoLabel(row.posicion_servo)}</td>
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
