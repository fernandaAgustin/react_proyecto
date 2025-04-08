import { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { CloudUpload, AttachFile } from '@mui/icons-material';

const UploadExcel = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); // Guardamos el archivo en el estado
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Por favor, selecciona un archivo");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("http://localhost:3000/api/excel-sensores", {
                method: "POST",
                body: formData,
            });
    
            const result = await response.json();
            alert(result.message);
            onUploadSuccess(); 
            setFile(null); // Limpiamos el archivo después de subirlo
        } catch (error) {
            console.error("Error:", error);
            alert("Error al subir el archivo");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}  
                id="file-upload"
            />
            <label htmlFor="file-upload">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<AttachFile />}
                    sx={{
                        backgroundColor: "rgba(221, 234, 230, 0.44)",  
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '50px',
                        '&:hover': {
                            backgroundColor: '#16A085',  
                        },
                    }}
                >
                    <Typography variant="button" sx={{ fontWeight: 'bold' }}>Selecciona Archivo</Typography>
                </Button>
            </label>

            {/* Mostrar el nombre del archivo seleccionado */}
            {file && (
                <Box sx={{ marginTop: '10px' }}>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                        Archivo seleccionado: {file.name}
                    </Typography>
                </Box>
            )}

            {/* Botón para subir el archivo */}
            <label>
            <Button
                variant="contained"
                component="span"
                onClick={handleUpload}
                startIcon={<CloudUpload />}
                sx={{
                    backgroundColor: '#1f4c35',  
                        color: '#fff',
                        padding: '12px 30px',
                        borderRadius: '50px',
                        '&:hover': {
                            backgroundColor: '#16A085', 
                    },
                    display: file ? 'inline-block' : 'none', 
                }}
            >
                Subir Excel
            </Button>
            </label>
        </div>
    );
};

export default UploadExcel;
