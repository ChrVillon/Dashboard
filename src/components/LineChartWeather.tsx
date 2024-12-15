import { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';


interface WeatherData {
    temperatureData: number[];
    feelsLikeData: number[];
    humidityData: number[];
    timeLabels: string[];
    selected: number;
}

interface SeriesData {
    data: number[];
    label: string;
}

export default function LineChartWeather({ temperatureData, humidityData, feelsLikeData, timeLabels, selected }: WeatherData) {

    const defaultColors = [
        '#FF5733', // Temperatura (rojo)
        '#33B5FF', // Humedad (azul)
        '#FFC300', // Sensación térmica (amarillo)
    ];

    const series = [
        { data: temperatureData, label: 'Temperatura (°C)', color: defaultColors[0] },
        { data: humidityData, label: 'Humedad (%)', color: defaultColors[1] },
        { data: feelsLikeData, label: 'Sensación térmica (°C)', color: defaultColors[2] },
    ];

    const filteredSeries = selected === 3
        ? series // Mostrar todas las series
        : series.filter((_, index) => index === selected);

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
            <LineChart
                width={400}
                height={250}
                series={filteredSeries}
                xAxis={[{ scaleType: 'point', data: timeLabels }]}
            />
        </Paper>
    );
}