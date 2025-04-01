import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ImportarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setUsuarios(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        try {
            await axios.post('http://localhost:3000/api/usuarios/importar', usuarios);
            alert('Usuarios importados con éxito');
        } catch (error) {
            console.error('Error al importar usuarios:', error);
            alert('Hubo un problema al importar los usuarios.');
        }
    };

    return (
        <div>
            <h2>Importar Usuarios desde Excel</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleImport}>Importar Usuarios</button>
            <ul>
                {usuarios.map((usuario, index) => (
                    <li key={index}>
                        {usuario.nombre} - {usuario.correo} - {usuario.rol} - {usuario.password} - {usuario.rol} -{usuario.fecha_nacimiento} -{usuario.sexo} 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ImportarUsuarios;