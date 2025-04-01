// AdminSistema.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para la navegación de las rutas

const AdminSistema = () => {
    return (
        <div>
            <h1>Panel de Administración</h1>
            <div className="botones">
                <Link to="/temperatura">
                    <button>registros de temperatura</button>
                </Link>
                <Link to="/graficaU">
                    <button>Ir a Página 2</button>
                </Link>
                <Link to="/pagina3">
                    <button>Ir a Página 3</button>
                </Link>
                <Link to="/pagina4">
                    <button>Ir a Página 4</button>
                </Link>
                <Link to="/pagina5">
                    <button>Ir a Página 5</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminSistema;
