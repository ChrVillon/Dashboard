// src/components/Navbar.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, TextField, Menu, MenuItem, Button } from '@mui/material';
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
    const theme = useTheme();

    // Manejar la apertura y cierre del menú
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
        }
    };
    return (
        <AppBar position="sticky" sx={{ marginBottom: '20px' }}>
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
                    <Button type="submit" variant="contained" color="primary">
                        Buscar
                    </Button>
                </form>

                {/* Menú */}
                <Button color="inherit" onClick={handleMenuOpen}>
                    <MenuIcon />
                    Menú
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Opción 1</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Opción 2</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Opción 3</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
