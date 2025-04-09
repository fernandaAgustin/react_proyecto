import React, { useState, useEffect } from 'react';
import { FaWater } from 'react-icons/fa'; // Icono de agua

function Bomba1() {
    const [bomba1Status, setBomba1Status] = useState('');
    const [showAlertBomba1, setShowAlertBomba1] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            fetch('https://18.191.201.190/api/humUsuario')
                .then(response => response.json())
                .then(data => {
                    // Tomamos el último registro, ya que la API devuelve los 5 últimos
                    const lastRecord = data[0];
                    const bomba1 = lastRecord.estado_bomba1;

                    // Actualizamos el estado de la bomba y la alerta
                    setBomba1Status(bomba1 === 'encendido' ? 'encendido' : 'apagado');
                    setShowAlertBomba1(bomba1 === 'encendido');
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
        <div className="bomba-status-box">
            <div className={`status-box ${bomba1Status === 'encendido' ? 'bg-danger' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center`}>
                <FaWater size={25} color="white" />
                <span className="ml-3 text-white">Bomba 1: {bomba1Status}</span>
            </div>
            {showAlertBomba1 && (
                <div className="alert alert-danger mt-3">
                    ¡La Bomba 1 está ENCENDIDA!
                </div>
            )}
        </div>
    );
}

export default Bomba1;
