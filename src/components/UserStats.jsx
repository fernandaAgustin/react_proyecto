// src/components/UserStats.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const UserStats = ({ usuarios }) => {
    // Datos para el gráfico de pastel (Distribución por Sexo)
    const sexData = usuarios.reduce((acc, user) => {
        acc[user.sexo] = (acc[user.sexo] || 0) + 1;
        return acc;
    }, {});

    const sexDataArray = Object.keys(sexData).map((key) => ({
        name: key,
        value: sexData[key],
    }));

    // Datos para el gráfico de barras (Distribución por Rol)
    const roleData = usuarios.reduce((acc, user) => {
        acc[user.rol] = (acc[user.rol] || 0) + 1;
        return acc;
    }, {});

    const roleDataArray = Object.keys(roleData).map((key) => ({
        name: key,
        value: roleData[key],
    }));

    // Datos para el gráfico de pastel (Distribución por Tipo de Usuario)
    const userTypeData = usuarios.reduce((acc, user) => {
        acc[user.tipo] = (acc[user.tipo] || 0) + 1;
        return acc;
    }, {});

    const userTypeDataArray = Object.keys(userTypeData).map((key) => ({
        name: key,
        value: userTypeData[key],
    }));

    // Colores personalizados
    const COLORS = ['#00E4FF', '#36A2EB', '#FF00FF'];

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', color: '#fff', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ width: '45%', marginBottom: '20px' }}>
                <h2>Distribución por Rol</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={roleDataArray}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip formatter={(value) => `${value} usuarios`} />
                        <Legend iconType="circle" />
                        <Bar dataKey="value" fill="#00E4FF" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div style={{ width: '45%', marginBottom: '20px' }}>
                <h2>Distribución por Sexo</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={sexDataArray}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={5}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
                        >
                            {sexDataArray.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} (${((value / usuarios.length) * 100).toFixed(2)}%)`, name]} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserStats;