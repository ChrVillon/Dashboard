{/* Hooks */ }
import { useState, useRef } from 'react';

{/* Componentes MUI */ }
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
/*import Select from '@mui/material/Select';*/

{/* Interfaz SelectChangeEvent */ }
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ControlWeatherProps {
    setSelected: (selected: number) => void;
}


export default function ControlWeather({setSelected}: ControlWeatherProps) {

    {/* Constante de referencia a un elemento HTML */ }
    const descriptionRef = useRef<HTMLDivElement>(null);
 
    {/**setSelect es una funcion que cambia el estado (solo esa funcion puede cambiar el estado) */}

    {/* Arreglo de objetos */ }
    let items = [
        { "name": "Temperatura", "description": "Nivel de temperatura en el ambiente expresadda en grados Celsius." },
        { "name": "Humedad", "description": "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje." },
        { "name": "Sensacion térmica", "description": "Nivel de como percibimos la temperatura considerando otros factores, expresado en grados Celsius." },
        { "name": "Todas las variables", "description": "Muestra todos los datos de temperatura, humedad y precipitación." }
    ]

    {/* Arreglo de elementos JSX */ }
    let options = items.map((item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem>)

    {/* Manejador de eventos */ }
    const handleChange = (event: SelectChangeEvent) => {

        let idx = parseInt(event.target.value)
        setSelected(idx);

        {/* Modificación de la referencia descriptionRef */ }
        if (descriptionRef.current !== null) {
            descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
        }

    };

    {/* JSX */ }
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* <Typography mb={2} component="h3" variant="h6" color="primary">
                {
                    (selected >= 0) ? items[selected]["description"] : ""
                }
            </Typography>*/}

            <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />


            <Box sx={{ minWidth: 120 }}>

                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Variables</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        label="Variables"
                        defaultValue='-1'
                        onChange={handleChange}
                    >
                        <MenuItem key="-1" value="-1" disabled>Seleccione una variable</MenuItem>

                        {options}

                    </Select>
                </FormControl>

            </Box>


        </Paper>


    )
}