import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material"; // Importamos el ícono de flecha
import backgroundImage from "../img/ejemp.jpg";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { correo, codigo } = location.state || {};

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/reset-password", {
                correo,
                codigo,
                nuevaPassword: newPassword
            });

            if (response.data.success) {
                setSuccess("Contraseña restablecida con éxito. Redirigiendo...");
                setTimeout(() => navigate("/"), 3000);
            } else {
                setError("El código es inválido o ha expirado.");
            }
        } catch (error) {
            setError("Error al restablecer la contraseña.");
        }
    };

    const handleCancel = () => {
        navigate("/"); // Redirige a la página principal
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", // Centramos el contenido verticalmente
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                padding: 2,
                color: "black",
                transition: "transform 0.3s ease-in-out", // Agrega una transición suave al cargar el formulario
                "&:hover": {
                    transform: "scale(1.05)", // Aplicamos un zoom suave al pasar el cursor por encima
                },
            }}
        >
            <Container maxWidth="xs">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 4,
                        backgroundColor: "rgba(149, 144, 144, 0.6)",
                        borderRadius: "10px",
                        padding: 4, // Aumentamos el padding para un espaciado más generoso
                        width: "100%", // Asegura que el contenido ocupe el 100% del contenedor
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Añadimos sombra para darle profundidad
                    }}
                >
                    {/* Botón de Regresar */}
                    <Button
                        sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            zIndex: 10,
                            color: "white",
                        }}
                        onClick={() => navigate("/")} // Redirige a la página principal
                    >
                        <ArrowBack />
                    </Button>

                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Restablecer Contraseña
                    </Typography>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    {success && <Typography color="success" sx={{ mt: 2 }}>{success}</Typography>}

                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <TextField
                            label="Nueva Contraseña"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Confirmar Contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Restablecer
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default ResetPassword;
