import React from 'react';
import HumedadList from '../components/HumedadList';
import Bomba1 from '../components/bomba1';
import Bomba2 from '../components/Bomba2';
import Bomba3 from '../components/Bomba3';
import Bomba4 from '../components/Bomba4';

function HumedadPage() {
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
        
            <HumedadList/>
            <Bomba1 />
            <Bomba2 />
            <Bomba3 />
            <Bomba4 />
        </div>
        </div>
    );
}

export default HumedadPage;
