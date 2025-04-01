import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Grid, Alert, Zoom, InputAdornment, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Person, Email, Lock, PersonAdd, CalendarToday, Male, Female, AccountCircle } from "@mui/icons-material";

const NewUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        rol: "Usuario",
        foto: null,
        fecha_nacimiento: "",
        sexo: "Masculino",
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
        navigate(-1); // Regresa a la página anterior
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
            setFormData({
                nombre: "",
                correo: "",
                password: "",
                rol: "Usuario",
                foto: null,
                fecha_nacimiento: "",
                sexo: "Masculino",
            });
        } catch (error) {
            setError(error.response ? error.response.data.error : "Error al registrar usuario");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url('https://example.com/your-background-image.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
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
                        width: { xs: "100%", sm: "80%", md: "60%" },
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        padding: 3,
                        borderRadius: 3,
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#0F2F24" }}>
                        Registro de Usuario
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Box display="grid" gridTemplateColumns="1fr" gap={2} sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                name="nombre"
                                required
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
                                value={formData.correo}
                                onChange={handleChange}
                                name="correo"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                name="password"
                                required
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
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                name="fecha_nacimiento"
                                required
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <input
                                type="file"
                                name="foto"
                                onChange={handleFileChange}
                                required
                                style={{ display: "none" }}
                                id="foto"
                            />
                            <label htmlFor="foto">
                                <Button variant="contained" component="span" fullWidth>
                                    Subir Foto
                                </Button>
                            </label>
                            <FormControl fullWidth required>
                                <InputLabel>Sexo</InputLabel>
                                <Select
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleChange}
                                    startAdornment={<Male />}
                                    label="Sexo"
                                >
                                    <MenuItem value="Masculino">Masculino</MenuItem>
                                    <MenuItem value="Femenino">Femenino</MenuItem>
                                    <MenuItem value="Otro">Otro</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth required>
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    startAdornment={<AccountCircle />}
                                    label="Rol"
                                >
                                    <MenuItem value="Administrador">Administrador</MenuItem>
                                    <MenuItem value="Usuario">Usuario</MenuItem>
                                    <MenuItem value="Sistema">Sistema</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={6}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        "&:hover": { backgroundColor: "#44556f" },
                                    }}
                                >
                                    Registrar
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={handleCancel}
                                    sx={{
                                        "&:hover": { backgroundColor: "#f1f1f1" },
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Zoom>
        </Box>
    );
};

export default NewUsuario;
