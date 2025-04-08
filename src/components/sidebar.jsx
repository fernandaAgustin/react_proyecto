import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Avatar, Typography, Box, Toolbar } from '@mui/material';
import { People, Speed, Opacity, ToggleOn, BarChart, Logout, Edit, Person, Email, Wc } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ usuario, handleLogout }) => {
    const menuItems = {
        Usuario: [
            { text: "Mi Perfil", icon: <Person />, link: "/perfil" },
            { text: "Editar Perfil", icon: <Edit />, link: `/editUsuarios/${usuario.id}` },
        ],
        Administrador: [
            { text: "Dashboard", icon: <People />, link: "/dashboard" },
            { text: "Administrar Usuarios", icon: <People />, link: "/usuarios" },
            { text: "Administrar Sensores", icon: <Speed />, link: "/sensores" },
            { text: "Administrar Riego", icon: <Opacity />, link: "/riego" },
            { text: "Administrar Válvulas", icon: <ToggleOn />, link: "/valvula" },
            { text: "Ver estadísticas", icon: <BarChart />, link: "/estadisticas" },
        ],
        Sistema: [
            { text: "Supervisión de Sensores", icon: <Speed />, link: "/sensores" },
            { text: "Control de Riego", icon: <Opacity />, link: "/riego" },
            { text: "Control de Válvulas", icon: <ToggleOn />, link: "/valvula" },
            { text: "Reportes", icon: <BarChart />, link: "/reportes" },
        ]
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#212121',
                    color: '#fff',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', color: '#fff', p: 2 }}>
                <List>
                    <ListItem sx={{ justifyContent: 'center' }}>
                        <Avatar src={`http://localhost:3000/uploads/${usuario.foto}`} alt={usuario.nombre} sx={{ width: 80, height: 80 }} />
                    </ListItem>
                    <ListItem sx={{ justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>{usuario.nombre}</Typography>
                    </ListItem>
                    {menuItems[usuario.rol]?.map((item, index) => (
                        <ListItemButton key={index} component={Link} to={item.link} sx={{ color: '#fff' }}>
                            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                    <ListItemButton onClick={handleLogout} sx={{ color: '#fff' }}>
                        <ListItemIcon><Logout sx={{ color: '#fff' }} /></ListItemIcon>
                        <ListItemText primary="Salir" />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;