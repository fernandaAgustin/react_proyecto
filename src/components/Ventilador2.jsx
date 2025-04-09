import React, { useState, useEffect } from 'react';
import { FaFan } from 'react-icons/fa'; // Icono de ventilador

function Ventilador2() {
    const [ventilador2Status, setVentilador2Status] = useState('');
    const [showAlertVentilador2, setShowAlertVentilador2] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            fetch('https://18.191.201.190/api/temUsuario') // Ruta de tu API
                .then(response => response.json())
                .then(data => {
                    const lastRecord = data[0];

                    const ventilador2 = lastRecord.estado_ventilador2;
                    setVentilador2Status(ventilador2 === 'encendido' ? 'encendido' : 'apagado');
                    setShowAlertVentilador2(ventilador2 === 'encendido');
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
        <div className="ventilador2-status-box">
            <div className={`status-box ${ventilador2Status === 'encendido' ? 'bg-danger' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center`}>
                <FaFan size={25} color="white" />
                <span className="ml-3 text-white">Ventilador B: {ventilador2Status}</span>
            </div>
            {showAlertVentilador2 && (
                <div className="alert alert-danger mt-3">
                    ¡El Ventilador de la zona B está ENCENDIDO!
                </div>
            )}
        </div>
    );
}

export default Ventilador2;
