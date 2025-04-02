import React from 'react';
import { TextField, Box } from '@mui/material';

const SearchBox = ({ searchName, searchRole, onSearchNameChange, onSearchRoleChange }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <TextField
                label="Buscar por Nombre"
                variant="outlined"
                value={searchName}
                onChange={onSearchNameChange}
                sx={{
                    mr: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '300px',
                    borderRadius: '10px',
                    '& .MuiInputBase-root': {
                        color: 'grey',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    '& .MuiInputLabel-root': {
                        color: '#B0BEC5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                    },
                }}
            />

            <TextField
                label="Buscar por Rol"
                variant="outlined"
                value={searchRole}
                onChange={onSearchRoleChange}
                sx={{
                    mr: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '300px',
                    borderRadius: '10px',
                    '& .MuiInputBase-root': {
                        color: 'grey',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    '& .MuiInputLabel-root': {
                        color: '#B0BEC5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1ABC9C',
                    },
                }}
            />
        </Box>
    );
};

export default SearchBox;
