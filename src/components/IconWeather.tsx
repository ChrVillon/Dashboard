import React from 'react';
import { Paper, Typography, Box, Grid2 } from '@mui/material';
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind, WiRaindrop, WiFog, WiCloudy } from 'react-icons/wi';

interface IndicatorProps {
    title: string;
    value: string | number;
    lgSize?: number;
    xsSize?: number;
}

const getIconByTitle = (title: string) => {
    switch (title.toLowerCase()) {
        case 'temperatura actual':
        case 'sensación térmica':
            return <WiThermometer size={32} />;
        case 'humedad':
            return <WiHumidity size={32} />;
        case 'condición':
            return <WiCloudy size={32} />;
        case 'presión':
            return <WiBarometer size={32} />;
        case 'viento':
            return <WiStrongWind size={32} />;
        case 'visibilidad':
            return <WiFog size={32} />;
        case 'lluvia':
            return <WiRaindrop size={32} />;
        default:
            return <WiCloudy size={32} />;
    }
};

const IconWeather: React.FC<IndicatorProps> = ({ title, value, lgSize = 12, xsSize = 6 }) => {
    const resolvedIcon = getIconByTitle(title);

    return (
        <Grid2 sx={{ lg: { lgSize }, xs: { xsSize }, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Paper
                elevation={1}
                sx={{
                    py: 2,
 
                    textAlign: 'center',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '200px',
                    width: '100%',
                    flexGrow: 1,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
            >

                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Box sx={{ color: '#3f51b5' }}>
                    {resolvedIcon}
                </Box>
                <Typography variant="h6" sx={{ ml: resolvedIcon ? 1 : 0 }}>{value}</Typography>

            </Paper>
        </Grid2>
    );
};

export default IconWeather;