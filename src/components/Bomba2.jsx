import React, { useState, useEffect } from 'react';
import { FaWater } from 'react-icons/fa'; // Icono de agua

function Bomba2() {
    const [bomba2Status, setBomba2Status] = useState('');
    const [showAlertBomba2, setShowAlertBomba2] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            fetch('https://18.191.201.190/api/humUsuario')
                .then(response => response.json())
                .then(data => {
                    const lastRecord = data[0]; // Primer elemento es el más reciente
                    const bomba2 = lastRecord.estado_bomba2;

                    setBomba2Status(bomba2 === 'encendido' ? 'encendido' : 'apagado');
                    setShowAlertBomba2(bomba2 === 'encendido');
                })
                .catch(error => console.error('Error al obtener datos:', error));
        };

        // Ejecutar inicialmente y cada 5 segundos
        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        // Limpiar intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bomba-status-box">
            <div className={`status-box ${bomba2Status === 'encendido' ? 'bg-danger' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center`}>
                <FaWater size={25} color="white" />
                <span className="ml-3 text-white">Bomba 2: {bomba2Status}</span>
            </div>
            {showAlertBomba2 && (
                <div className="alert alert-danger mt-3">
                    ¡La Bomba 2 está ENCENDIDA!
                </div>
            )}
        </div>
    );
}

export default Bomba2;
