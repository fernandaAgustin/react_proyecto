import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Grid, Typography, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material"; // Importamos el ícono de flecha
import backgroundImage from "../img/ejemp.jpg";

const FormularioLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo: "", password: "" });
    const [error, setError] = useState("");
    const [isBlocked, setIsBlocked] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [codeError, setCodeError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [blockTime, setBlockTime] = useState(null);

    useEffect(() => {
        const lastBlockTime = localStorage.getItem("blockTime");
        if (lastBlockTime) {
            const blockDuration = Date.now() - parseInt(lastBlockTime);
            if (blockDuration < 180000) {
                setIsBlocked(true);
                setBlockTime(180000 - blockDuration); // Calculate remaining block time
            } else {
                localStorage.removeItem("blockTime");
                setIsBlocked(false);
                setFailedAttempts(0);
            }
        }
    }, []);

    useEffect(() => {
        if (blockTime !== null && blockTime > 0) {
            const timer = setInterval(() => {
                setBlockTime((prevTime) => {
                    if (prevTime <= 0) {
                        setIsBlocked(false);
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1000;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [blockTime]);

    const handleChange = (e) => {
        if (showReset) {
            setResetEmail(e.target.value);
        } else {
            setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.correo || !formData.password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (isBlocked) {
            setError("Has alcanzado el número máximo de intentos. Intenta nuevamente en 3 minutos.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/login", formData);
            if (response.data.success) {
                localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                setFailedAttempts(0); // Reset failed attempts on successful login
                navigate("/perfil");
            } else {
                setFailedAttempts((prevAttempts) => {
                    const newAttempts = prevAttempts + 1;
                    if (newAttempts >= 3) {
                        setIsBlocked(true);
                        localStorage.setItem("blockTime", Date.now().toString());
                    }
                    return newAttempts;
                });
                setError("Correo o contraseña incorrectos.");
            }
        } catch (error) {
            setError("Error al conectar con el servidor.");
        }
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post("http://localhost:3000/api/send-reset-code", { correo: resetEmail });
            setShowCodeInput(true);
        } catch (error) {
            setError("Error al enviar el código de recuperación.");
        }
    };

    const handleVerifyCode = async () => {
        setIsVerifying(true);

        try {
            const response = await axios.post("http://localhost:3000/api/verify-reset-code", {
                correo: resetEmail,
                codigo: resetCode,
            });

            if (response.data.success) {
                navigate("/reset-password", { state: { correo: resetEmail, codigo: resetCode } });
            } else {
                setCodeError("El código ingresado es incorrecto o ha expirado.");
            }
        } catch (error) {
            setCodeError(error.response?.data?.message || "Error al verificar el código.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCancelReset = () => {
        setShowReset(false);
        setResetEmail("");
        setResetCode("");
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
                        onClick={() => navigate("/")}
                    >
                        <ArrowBack />
                        SALIR
                    </Button>

                    <Typography variant="h5" sx={{ mb: 3 }}>
                        {showReset ? "Recuperar Contraseña" : "Iniciar Sesión"}
                    </Typography>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                    {!showReset ? (
                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <TextField
                                label="Correo"
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                disabled={isBlocked}
                            />
                            <TextField
                                label="Contraseña"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                disabled={isBlocked}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={isBlocked}
                            >
                                Iniciar Sesión
                            </Button>
                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs>
                                    <Button onClick={() => setShowReset(true)} color="primary" fullWidth>
                                        ¿Olvidaste tu contraseña?
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={() => navigate("/register")} color="secondary" fullWidth>
                                        ¿No tienes una cuenta? Regístrate aquí
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    ) : !showCodeInput ? (
                        <div>
                            <TextField
                                label="Correo"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" fullWidth onClick={handleForgotPassword}>
                                Enviar Código
                            </Button>
                            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleCancelReset}>
                                Cancelar
                            </Button>
                        </div>
                    ) : (
                        <div>
                            {codeError && <Typography color="error">{codeError}</Typography>}
                            <TextField
                                label="Código de recuperación"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleVerifyCode}
                                disabled={isVerifying}
                            >
                                {isVerifying ? "Verificando..." : "Verificar Código"}
                            </Button>
                            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleCancelReset}>
                                Cancelar
                            </Button>
                        </div>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default FormularioLogin;
