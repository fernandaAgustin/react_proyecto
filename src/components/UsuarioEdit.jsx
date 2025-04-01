import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, CircularProgress, InputAdornment } from "@mui/material";
import { AccountCircle, Email, Lock, Cake, Male, Female, Person } from "@mui/icons-material";
import { Fade } from '@mui/material';

const UsuarioEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        rol: "Usuario",
        fecha_nacimiento: "",
        sexo: "Masculino",
        foto: null,
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:3000/api/usuarios/${id}`)
            .then((response) => {
                const userData = response.data;

                if (userData.fecha_nacimiento) {
                    userData.fecha_nacimiento = new Date(userData.fecha_nacimiento)
                        .toISOString()
                        .split("T")[0];
                }

                setFormData({
                    nombre: userData.nombre,
                    correo: userData.correo,
                    password: "",
                    rol: userData.rol,
                    fecha_nacimiento: userData.fecha_nacimiento,
                    sexo: userData.sexo,
                    foto: userData.foto,
                });
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.correo || !formData.fecha_nacimiento || !formData.sexo || !formData.rol) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (formData.password && !isPasswordValid(formData.password)) {
            setError("La contraseña debe tener al menos 10 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.");
            return;
        }

        setError("");
        setSuccessMessage("");

        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "foto") {
                formDataToSend.append(key, value);
            }
        });

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:3000/api/usuarios/${id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage(response.data.message);
            navigate(-1);
        } catch (error) {
            setError(error.response ? error.response.data.error : "Error al actualizar usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Fade in={true} timeout={1000}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        width: '100%',
                        maxWidth: 400,
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Usuario</h2>
                    {error && <Box sx={{ backgroundColor: '#f8d7da', color: '#721c24', padding: 2, marginBottom: 2, borderRadius: 1 }}>{error}</Box>}
                    {successMessage && <Box sx={{ backgroundColor: '#d4edda', color: '#155724', padding: 2, marginBottom: 2, borderRadius: 1 }}>{successMessage}</Box>}

                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                        }}
                    />

                    <TextField
                        label="Correo"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Email /></InputAdornment>,
                        }}
                    />

                    <TextField
                        label="Contraseña (dejar vacía para no cambiar)"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                        }}
                    />

                    <TextField
                        label="Fecha de Nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Cake /></InputAdornment>,
                        }}
                    />

                    <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                        <InputLabel>Sexo</InputLabel>
                        <Select
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleChange}
                        >
                            <MenuItem value="Masculino"><Male /> Masculino</MenuItem>
                            <MenuItem value="Femenino"><Female /> Femenino</MenuItem>
                            <MenuItem value="Otro"><Person /> Otro</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                        >
                            <MenuItem value="Administrador">Administrador</MenuItem>
                            <MenuItem value="Usuario">Usuario</MenuItem>
                            <MenuItem value="Sistema">Sistema</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Actualizar'}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default UsuarioEdit;
