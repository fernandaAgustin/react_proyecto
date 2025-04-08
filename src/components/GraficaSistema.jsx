import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';  // Importamos el componente Line de Chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

// Registramos los componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const GraficaSistema = () => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [lightData, setLightData] = useState([]);
    const [soilHumidityData, setSoilHumidityData] = useState([]);
    const [waterSensorData, setWaterSensorData] = useState([]);

    // Función para obtener los datos de las API
    const fetchData = async () => {
        try {
            const temperatureResponse = await axios.get('http://localhost:3000/api/temperature');
            const lightResponse = await axios.get('http://localhost:3000/api/light');
            const soilHumidityResponse = await axios.get('http://localhost:3000/api/soil-humidity');
            const waterSensorResponse = await axios.get('http://localhost:3000/api/water-sensor');

            setTemperatureData(prevData => [...prevData, temperatureResponse.data[0]]);
            setLightData(prevData => [...prevData, lightResponse.data[0]]);
            setSoilHumidityData(prevData => [...prevData, soilHumidityResponse.data[0]]);
            setWaterSensorData(prevData => [...prevData, waterSensorResponse.data[0]]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Usamos useEffect para que los datos se actualicen cada 10 segundos
    useEffect(() => {
        fetchData();  // Cargar los datos inicialmente
        const interval = setInterval(fetchData, 10000);  // Actualizar cada 10 segundos

        return () => clearInterval(interval);  // Limpiar el intervalo cuando se desmonte el componente
    }, []);

    // Funciones para generar los datos de las gráficas
    const generateChartData = (data, label, valueKey) => {
        return {
            labels: data.map((_, index) => index + 1),  // Etiquetas de los datos (números de índice)
            datasets: [
                {
                    label: label,
                    data: data.map(item => item[valueKey]),  // Extraemos los valores de los datos
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1,
                },
            ],
        };
    };

    return (
        <div>
            <h1>Últimos Datos del Sistema</h1>

            <div>
                <h2>Temperatura</h2>
                {temperatureData.length > 0 ? (
                    <div>
                        <p>Temperatura: {temperatureData[temperatureData.length - 1].temperature} °C</p>
                        <p>Estado del motor: {temperatureData[temperatureData.length - 1].fan_status}</p>
                        <Line data={generateChartData(temperatureData, 'Temperatura', 'temperature')} />
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>

            <div>
                <h2>Luz</h2>
                {lightData.length > 0 ? (
                    <div>
                        <p>Nivel de luz: {lightData[lightData.length - 1].light_level}, Estado del LED: {lightData[lightData.length - 1].led_status}</p>
                        <Line data={generateChartData(lightData, 'Luz', 'light_level')} />
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>

            <div>
                <h2>Humedad del Suelo</h2>
                {soilHumidityData.length > 0 ? (
                    <div>
                        <p>Humedad del suelo: {soilHumidityData[soilHumidityData.length - 1].humidity}, Estado de la bomba: {soilHumidityData[soilHumidityData.length - 1].pump_status}</p>
                        <Line data={generateChartData(soilHumidityData, 'Humedad del Suelo', 'humidity')} />
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>

            <div>
                <h2>Sensor de Agua</h2>
                {waterSensorData.length > 0 ? (
                    <div>
                        <p>Estado del agua: {waterSensorData[waterSensorData.length - 1].water_status}, Estado del servo: {waterSensorData[waterSensorData.length - 1].servo_status}</p>
                        <Line data={generateChartData(waterSensorData, 'Sensor de Agua', 'water_status')} />
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>
        </div>
    );
};

export default GraficaSistema;
