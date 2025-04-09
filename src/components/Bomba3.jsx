import React, { useState, useEffect } from 'react';
import { FaWater } from 'react-icons/fa'; // Icono de agua

function Bomba3() {
    const [bomba3Status, setBomba3Status] = useState('');
    const [showAlertBomba3, setShowAlertBomba3] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            fetch('https://18.191.201.190/api/humUsuario')
                .then(response => response.json())
                .then(data => {
                    const lastRecord = data[0]; // Tomamos el registro más reciente
                    const bomba3 = lastRecord.estado_bomba3;

                    setBomba3Status(bomba3 === 'encendido' ? 'encendido' : 'apagado');
                    setShowAlertBomba3(bomba3 === 'encendido');
                })
                .catch(error => console.error('Error al obtener datos:', error));
        };

        const intervalId = setInterval(fetchData, 5000);
        fetchData(); // Llamada inicial

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bomba-status-box">
            <div className={`status-box ${bomba3Status === 'encendido' ? 'bg-danger' : 'bg-secondary'} p-3 rounded d-flex align-items-center justify-content-center`}>
                <FaWater size={25} color="white" />
                <span className="ml-3 text-white">Bomba 3: {bomba3Status}</span>
            </div>
            {showAlertBomba3 && (
                <div className="alert alert-danger mt-3">
                    ¡La Bomba 3 está ENCENDIDA!
                </div>
            )}
        </div>
    );
}

export default Bomba3;
