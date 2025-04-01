import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Alert, Box, Typography, Zoom, InputAdornment } from "@mui/material";
import { PersonAdd, Lock, Email, Person, CalendarToday, VisibilityOff } from "@mui/icons-material";
import backgroundImage from "../img/ejemp.jpg";

const FormularioRegistro = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "", correo: "", password: "", rol: "Usuario", foto: null, fecha_nacimiento: "", sexo: "Masculino"
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setFormData((prevState) => ({ ...prevState, foto: e.target.files[0] }));
    };

    const handleCancel = () => {
        navigate("/");
    };

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre || !formData.correo || !formData.password || !formData.fecha_nacimiento || !formData.sexo || !formData.foto || !formData.rol) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!isPasswordValid(formData.password)) {
            setError("La contraseña debe tener al menos 10 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.");
            return;
        }

        setError("");
        setSuccessMessage("");

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));

        try {
            const response = await axios.post("http://localhost:3000/api/usuarios", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage(response.data.message);
            setFormData({ nombre: "", correo: "", password: "", rol: "Usuario", foto: null, fecha_nacimiento: "", sexo: "Masculino" });
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setError(error.response ? error.response.data.error : "Error al registrar usuario");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh" // Asegura que ocupe toda la altura
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                padding: 1,
                "::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    zIndex: 2,
                },
            }}
        >
            <Zoom in={true} timeout={1000}>
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 3,
                        width: { xs: "100%", sm: "80%", md: "60%" }, // Ajuste el tamaño del formulario en diferentes pantallas
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: 3,
                        borderRadius: 3,
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#0F2F24" }}>
                        Registro
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                    <form onSubmit={handleSubmit}>
                        {/* Contenedor de formulario en grid */}
                        <Box
                            display="grid"
                            gridTemplateColumns="1fr 1fr" // 2 columnas
                            gap={2} // Espaciado entre los elementos
                            sx={{ marginBottom: 2 }}
                        >
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Correo"
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box
                            display="grid"
                            gridTemplateColumns="1fr 1fr" // 2 columnas
                            gap={2} // Espaciado entre los elementos
                            sx={{ marginBottom: 2 }}
                        >
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Fecha de Nacimiento"
                                type="date"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Typography variant="body1">Sexo</Typography>
                            <select
                                name="sexo"
                                value={formData.sexo}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-2"
                                style={{ width: "100%", padding: "10px", fontSize: "16px" }} // Asegura que ocupe todo el ancho
                            >
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Typography variant="body1">Rol</Typography>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-2"
                                style={{ width: "100%", padding: "10px", fontSize: "16px" }} // Asegura que ocupe todo el ancho
                            >
                                <option value="Administrador">Administrador</option>
                                <option value="Usuario">Usuario</option>
                                <option value="Sistema">Sistema</option>
                            </select>
                        </Box>

                        <input
                            type="file"
                            name="foto"
                            onChange={handleFileChange}
                            style={{ marginBottom: "1rem", width: "100%" }}
                        />

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    "&:hover": { backgroundColor: "#44556f" },
                                }}
                            >
                                Registrarse
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancel}
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    "&:hover": { backgroundColor: "#44556f" },
                                }}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Zoom>
        </Box>
    );
};

export default FormularioRegistro;
