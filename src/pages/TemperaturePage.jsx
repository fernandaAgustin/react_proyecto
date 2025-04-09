import React from 'react';
import TemperatureList from '../components/TemperatureList';
import Ventilador1 from '../components/Ventilador1';
import Ventilador2 from '../components/Ventilador2';

function TemperaturePage() {
    return (
        <div className="App" style={{
            backgroundImage: 'url(https://i.pinimg.com/736x/01/7f/7c/017f7c711c5945e3217b2af2b5f84bfb.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            padding: '20px',
            color: 'white'
        }}>
            <div>
                <TemperatureList />
                <Ventilador1 />
                <Ventilador2 />
            </div>
        </div>
    );
}

export default TemperaturePage;
