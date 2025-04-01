import { useState, useEffect } from "react";
import UploadExcel from "./UploadExcel";

const UserList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/usuarios");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <UploadExcel onUploadSuccess={fetchUsers} />
            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table table-dark table-striped table-hover align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Sexo</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nombre}</td>
                            <td>{user.correo}</td>
                            <td>{user.rol}</td>
                            <td>{user.fecha_nacimiento}</td>
                            <td>{user.sexo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default UserList;