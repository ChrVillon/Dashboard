import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface WeatherRow {
  time: string;
  condition: string;
  windSpeed: string;
  pressure: string;
  visibility: string;
  windSpeedValue: number; 
}

interface WeatherTableProps {
  setAvgWindSpeed: React.Dispatch<React.SetStateAction<number>>; 
}

export default function WeatherTable({ setAvgWindSpeed }: WeatherTableProps) {
  const [rows, setRows] = useState<WeatherRow[]>([]);

  useEffect(() => {
    const data = async () => {
      const API_KEY = 'f51d9809326a75824f6f3149fedae141';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
      );

      const textXML = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textXML, 'application/xml');
      const timeNodes = xmlDoc.getElementsByTagName('time');

      const parsedRows: WeatherRow[] = [];

      let totalWindSpeed = 0;
      let windSpeedCount = 0;

      for (let i = 0; i < timeNodes.length; i++) {
        const timeNode = timeNodes[i];
        const time = timeNode.getAttribute('from') || 'N/A';

        const symbol = timeNode.getElementsByTagName('symbol')[0];
        const condition = symbol?.getAttribute('name') || 'N/A';

        const windSpeedNode = timeNode.getElementsByTagName('windSpeed')[0];
        const windSpeed = windSpeedNode
          ? parseFloat(windSpeedNode.getAttribute('mps') || '0') * 3.6
          : 0;

        const pressureNode = timeNode.getElementsByTagName('pressure')[0];
        const pressure = pressureNode?.getAttribute('value') + ' hPa' || 'N/A';

        const visibilityNode = xmlDoc.getElementsByTagName('visibility')[0];
        const visibility = visibilityNode
          ? `${(parseFloat(visibilityNode.getAttribute('value') || '0') / 1000).toFixed(2)} km`
          : 'N/A';

        parsedRows.push({
          time,
          condition,
          windSpeed: `${windSpeed.toFixed(2)} km/h`,
          pressure,
          visibility,
          windSpeedValue: windSpeed, 
        });

        totalWindSpeed += windSpeed;
        windSpeedCount++;
      }

      setRows(parsedRows.slice(0, 5)); 
      if (windSpeedCount > 0) {
        setAvgWindSpeed(totalWindSpeed / windSpeedCount); 
      }
    };

    data();
  }, [setAvgWindSpeed]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="weather table">
        <TableHead>
          <TableRow>
            <TableCell>Fecha y Hora</TableCell>
            <TableCell>Condición del Clima</TableCell>
            <TableCell align="right">Velocidad del Viento</TableCell>
            <TableCell align="right">Presión Atmosférica</TableCell>
            <TableCell align="right">Visibilidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.condition}</TableCell>
              <TableCell align="right">{row.windSpeed}</TableCell>
              <TableCell align="right">{row.pressure}</TableCell>
              <TableCell align="right">{row.visibility}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
