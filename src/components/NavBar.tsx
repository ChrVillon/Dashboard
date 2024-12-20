// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemText, AppBar, Toolbar, IconButton, Typography, Box, TextField, Menu, MenuItem, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';  // Ícono para el menú
import SearchIcon from '@mui/icons-material/Search';  // Ícono para la búsqueda
import { useTheme } from '@mui/material/styles';
import ClimaIcon from '../assets/clima.png'

interface NavbarProps {
    onCitySearch: (city: string) => void; // Prop para manejar la búsqueda
}

const Navbar: React.FC<NavbarProps> = ({ onCitySearch }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();

    const handleMenu = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Manejar el cambio en la barra de búsqueda
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir recarga de la página
        if (searchQuery.trim()) {
            console.log("Ciudad antes de enviar:", searchQuery);
            onCitySearch(searchQuery.trim()); // Pasar la ciudad al componente padre
            setSearchQuery('');
        }
    };
    return (
        <div>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Ícono y nombre de la página */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={ClimaIcon} alt="Clima Icono" style={{ width: '2rem', height: 'auto', marginRight: '8px' }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Mi Aplicación de Clima
                        </Typography>
                    </Box>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Barra de búsqueda */}
                        <TextField
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Ingrese una Ciudad"
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '4px',
                                marginRight: '16px',
                                width: '500px',
                            }}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ marginRight: '8px' }} />,
                            }}

                        />
                        <Button type="submit" variant="contained" color="secondary">
                            Buscar
                        </Button>
                    </form>

                    {/* Menú */}
                    <Button color="inherit" onClick={handleMenu}>
                        <MenuIcon />
                        Menú
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleMenu}
                PaperProps={{ style: { width: '250px' } }}
            >
                <List>
                    {/* Opciones del Drawer */}
                    <ListItemButton component="a" href="#infoGeo" onClick={handleMenu}>
                        <ListItemText primary="Información Geográfica" />
                    </ListItemButton>
                    <ListItemButton component="a" href="#clima" onClick={handleMenu}>
                        <ListItemText primary="Condición climática actual" />
                    </ListItemButton>
                    <ListItemButton component="a" href="#grafica" onClick={handleMenu}>
                        <ListItemText primary="Variables en el tiempo" />
                    </ListItemButton>
                    <ListItemButton component="a" href="#tabla" onClick={handleMenu}>
                        <ListItemText primary="Historial climático" />
                    </ListItemButton>                    
                </List>
            </Drawer>
        </div>
    );
};

export default Navbar;
