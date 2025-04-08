import React, { useState, useEffect } from 'react';
import { FaWater } from 'react-icons/fa'; // Icono de agua

function Bomba4() {
    const [bomba4Status, setBomba4Status] = useState('');
    const [showAlertBomba4, setShowAlertBomba4] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:3000/api/humUsuario')
                .then(response => response.json())
                .then(data => {
                    const lastRecord = data[0]; // Último registro (más reciente)
                    const bomba4 = lastRecord.estado_bomba4;

                    setBomba4Status(bomba4 === 'encendido' ? 'encendido' : 'apagado');
                    setShowAlertBomba4(bomba4 === 'encendido');
                })
                .catch(error => console.error('Error al obtener datos:', error));
        };

        const intervalId = setInterval(fetchData, 5000);
        fetchData(); // Llamada inicial

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bomba-status-box">
            <div className={`status-box ${bomba4Status === 'encendido' ? 'bg-danger' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center`}>
                <FaWater size={25} color="white" />
                <span className="ml-3 text-white">Bomba 4: {bomba4Status}</span>
            </div>
            {showAlertBomba4 && (
                <div className="alert alert-danger mt-3">
                    ¡La Bomba 4 está ENCENDIDA!
                </div>
            )}
        </div>
    );
}

export default Bomba4;
