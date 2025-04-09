import React, { useState, useEffect } from 'react';
import { FaFan } from 'react-icons/fa'; // Icono de ventilador

function Ventilador1() {
    const [ventilador1Status, setVentilador1Status] = useState('');
    const [showAlertVentilador1, setShowAlertVentilador1] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            fetch('https://18.191.201.190/api/temUsuario') // Ruta de tu API
                .then(response => response.json())
                .then(data => {
                    const lastRecord = data[0];

                    const ventilador1 = lastRecord.estado_ventilador1;
                    setVentilador1Status(ventilador1 === 'encendido' ? 'encendido' : 'apagado');
                    setShowAlertVentilador1(ventilador1 === 'encendido');
                })
                .catch(error => console.error('Error al obtener datos:', error));
        };

        // Llamamos a fetchData cada 5 segundos
        const intervalId = setInterval(fetchData, 5000);

        // Llamamos inicialmente a fetchData para cargar el estado al inicio
        fetchData();

        // Limpiamos el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="ventilador1-status-box">
            <div className={`status-box ${ventilador1Status === 'encendido' ? 'bg-danger' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center`}>
                <FaFan size={25} color="white" />
                <span className="ml-3 text-white">Ventilador A: {ventilador1Status}</span>
            </div>
            {showAlertVentilador1 && (
                <div className="alert alert-danger mt-3">
                    ¡El Ventilador de la zona A está ENCENDIDO!
                </div>
            )}
        </div>
    );
}

export default Ventilador1;
