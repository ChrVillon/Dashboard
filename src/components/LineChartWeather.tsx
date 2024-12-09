import { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';


interface WeatherData {
    temperatureData: number[];
    humidityData: number[];
    timeLabels: string[];
}

export default function LineChartWeather() {
    const [weatherData, setWeatherData] = useState<WeatherData>({
        temperatureData: [],
        humidityData: [],
        timeLabels: []
    });

    useEffect(() => {
        let request = async () => {
            let API_KEY = "f51d9809326a75824f6f3149fedae141"
            let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
            let savedTextXML = await response.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(savedTextXML, "application/xml");

            let timeLabels: string[] = [];
            let temperatureData: number[] = [];
            let humidityData: number[] = [];

            const forecastItems = xmlDoc.getElementsByTagName("time");

            for (let i = 0; i < forecastItems.length; i++) {
                const timeItem = forecastItems[i];
                const time = timeItem.getAttribute("from");
                if (time) timeLabels.push(time);

                const temperature = timeItem.getElementsByTagName("temperature")[0]?.getAttribute("value");
                if (temperature) temperatureData.push(parseFloat(temperature) - 273.15);

                const humidity = timeItem.getElementsByTagName("humidity")[0]?.getAttribute("value");
                if (humidity) humidityData.push(parseFloat(humidity));
            }

            setWeatherData({ timeLabels, temperatureData, humidityData });
        }
        request();
    }, [])

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
                series={[
                    { data: weatherData.temperatureData, label: 'Temperatura (°C)' },
                    { data: weatherData.humidityData, label: 'Humedad (%)' },
                ]}
                xAxis={[{ scaleType: 'point', data: weatherData.timeLabels }]}
            />
        </Paper>
    );
}