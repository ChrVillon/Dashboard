import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather'
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';
import Navbar from './components/NavBar';
import IconWeather from './components/IconWeather';
import { Paper, Typography } from '@mui/material';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  let [indicators, setIndicators] = useState<Indicator[]>([]);
  let [item, setItems] = useState<Item[]>([]);

  let [temperature, setTemperature] = useState<number[]>([]);
  let [humidity, setHumidity] = useState<number[]>([]);
  let [feelsLike, setFeelsLike] = useState<number[]>([]);
  let [timeLabels, setTimeLabels] = useState<string[]>([]);
  let [selected, setSelected] = useState<number>(3);

  let [currentTemperature, setCurrentTemperature] = useState<number>();
  let [currentHumidity, setCurrentHumidity] = useState<number>();
  let [currentFeelsLike, setCurrentFeelsLike] = useState<number>();
  let [currentVisibility, setCurrentVisibility] = useState<number>();
  let [currentWind, setCurrentWind] = useState<number>();
  let [lastUpdate, setLastUpdate] = useState<string>();

  const [city, setCity] = useState<string>('Guayaquil');

  // Función reutilizable para manejar la API y el almacenamiento local
  const fetchAndStoreData = async (url: string, key: string) => {
    let nowTime = new Date().getTime();
    let expiringTime = parseInt(localStorage.getItem(`${key}_expiringTime`) || '0');
    const storedCity = localStorage.getItem("city");

    if (storedCity?.toLowerCase() !== city.toLowerCase()) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_expiringTime`);
      localStorage.removeItem("city");
    }

    if (nowTime > expiringTime || localStorage.getItem(city)?.toLowerCase() !== city.toLowerCase().trim()) {
      try {
        console.log(`Llamando a la API para: ${key}`);
        const response = await fetch(url);
        const data = await response.text();

        let hours = 0.01; // Cambiar este valor según el TTL deseado
        let delay = hours * 3600000;

        localStorage.setItem(key, data);
        localStorage.setItem(`${key}_expiringTime`, (nowTime + delay).toString());
        localStorage.setItem("city", city.trim());

        return data;
      } catch (error) {
        console.error(`Error al obtener datos para ${key}:`, error);
      }
    } else {
      return localStorage.getItem(key) || "";
    }
  };

  const parseXMLData = (xmlString: string) => {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, "application/xml");
  };

  useEffect(() => {
    const fetchData = async () => {
      const API_KEY = "f51d9809326a75824f6f3149fedae141";
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=xml&appid=${API_KEY}`;
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=xml&appid=${API_KEY}`;

      const forecastXML = await fetchAndStoreData(forecastURL, "forecast");
      const weatherXML = await fetchAndStoreData(weatherURL, "weather");

      if (forecastXML) {
        const xml = parseXMLData(forecastXML);

        let dataToIndicators: Indicator[] = [];
        let dataToItem: Item[] = [];
        let dataTemperature: number[] = [];
        let dataHumidity: number[] = [];
        let dataFeelsLike: number[] = [];
        let timeLabels: string[] = [];

        const name = xml.getElementsByTagName("name")[0]?.innerHTML || "";
        dataToIndicators.push({ title: "Location", subtitle: "City", value: name });

        const location = xml.getElementsByTagName("location")[1];
        if (location) {
          dataToIndicators.push({ title: "Location", subtitle: "Latitude", value: location.getAttribute("latitude") || "" });
          dataToIndicators.push({ title: "Location", subtitle: "Longitude", value: location.getAttribute("longitude") || "" });
          dataToIndicators.push({ title: "Location", subtitle: "Altitude", value: location.getAttribute("altitude") || "" });
        }

        const times = xml.getElementsByTagName("time");
        for (let i = 0; i < times.length; i++) {
          let time = times[i]
          let from = time.getAttribute("from") || ""
          let to = time.getAttribute("to") || ""

          let precipitation = time.getElementsByTagName("precipitation")[0]
          let probability = parseFloat(precipitation.getAttribute("probability") || "")
          let probabilityValue = (probability * 100).toFixed(0).toString()

          let humidity = time.getElementsByTagName("humidity")[0]
          let value = humidity.getAttribute("value") || ""

          let clouds = time.getElementsByTagName("clouds")[0]
          let all = clouds.getAttribute("all") || ""

          let windSpeed = time.getElementsByTagName("windSpeed")[0]
          let windSpeedValue = windSpeed.getAttribute("mps") || ""

          let temperature = time.getElementsByTagName("temperature")[0]
          let temperatureValue = temperature.getAttribute("value") || ""

          let feelsLike = time.getElementsByTagName("feels_like")[0]
          let feelsLikeValue = feelsLike.getAttribute("value") || ""
          dataToItem.push({ "dateStart": from, "dateEnd": to, "precipitation": probabilityValue, "windSpeed": windSpeedValue, "clouds": all })

          timeLabels.push(from)
          dataTemperature.push(parseFloat(temperatureValue) - 273.15)
          dataHumidity.push(parseFloat(value))
          dataFeelsLike.push(parseFloat(feelsLikeValue) - 273.15)

        }

        setIndicators(dataToIndicators);
        setItems(dataToItem.slice(0, 5));
        setTemperature(dataTemperature);
        setHumidity(dataHumidity);
        setFeelsLike(dataFeelsLike);
        setTimeLabels(timeLabels);
      }

      if (weatherXML) {
        const xml = parseXMLData(weatherXML);

        const temperature = parseFloat(xml.getElementsByTagName("temperature")[0]?.getAttribute("value") || "") - 273.15;
        const humidity = parseFloat(xml.getElementsByTagName("humidity")[0]?.getAttribute("value") || "");
        const wind = parseFloat(xml.getElementsByTagName("wind")[0]?.getElementsByTagName("speed")[0]?.getAttribute("value") || "");
        const feelsLike = parseFloat(xml.getElementsByTagName("feels_like")[0]?.getAttribute("value") || "") - 273.15;
        const visibility = parseFloat(xml.getElementsByTagName("visibility")[0]?.getAttribute("value") || "");
        const lastUpdate = xml.getElementsByTagName("precipitation")[0]?.getAttribute("mode") || "";

        setCurrentTemperature(temperature);
        setCurrentHumidity(humidity);
        setCurrentVisibility(visibility);
        setCurrentFeelsLike(feelsLike);
        setCurrentWind(wind);
        setLastUpdate(lastUpdate);
      }
    };

    fetchData();
  }, [city]);

  const renderIndicators = () =>
    indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, sm: 3 }}>
        <IndicatorWeather
          title={indicator.title}
          subtitle={indicator.subtitle}
          value={indicator.value}
        />
      </Grid>
    ));

  return (
    <div>
      <Navbar
        onCitySearch={(city) => {
          console.log("Ciudad seleccionada:", city);
          setCity(city);
        }}
      />
      <Typography id='infoGeo' component={'h2'} variant='h4' marginTop={12}>Informacion geográfica de {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}</Typography>
      <Grid container spacing={4} marginTop={3} marginX={10} justifyContent={'center'}>
        {renderIndicators()}
        <Grid id='clima' sx={{ xs: 12 }} display={'flex'} flexDirection={'column'} justifyContent='center'>
          <Typography component={'h2'} variant='h4' marginBottom={2}>Condiciones climáticas actuales</Typography>
          <Paper elevation={3} sx={{ borderRadius: 2, alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Grid container spacing={4} direction="row" alignItems="strech" sx={{ p: 4, width: '100%' }} justifyContent={'center'}>
              <IconWeather title="Temperatura actual" value={`${currentTemperature?.toFixed(2)} °C`} />
              <IconWeather title="Sensación térmica" value={`${currentFeelsLike?.toFixed(2)} °C`} />
              <IconWeather title='Visibilidad' value={`${currentVisibility?.toFixed(2)} m`} />
              <IconWeather title='Humedad' value={`${currentHumidity?.toFixed(2)}%`} />
              <IconWeather title='Viento' value={`${currentWind?.toFixed(2)} m/s`} />
              <IconWeather title='Lluvia' value={`${lastUpdate}`} />
            </Grid>
          </Paper>
        </Grid>
        <Grid id='grafica' size={{ xs: 12, sm: 15 }}>
          <Typography component={'h2'} variant='h4' mb={2}>Gráfica de variables en el tiempo</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }} sx={{display: 'flex', flexDirection: 'column'}}>
              <ControlWeather setSelected={setSelected} />
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <LineChartWeather
                temperatureData={selected === 0 || selected === 3 ? temperature : []}
                humidityData={selected === 1 || selected === 3 ? humidity : []}
                feelsLikeData={selected === 2 || selected === 3 ? feelsLike : []}
                timeLabels={timeLabels}
                selected={selected}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid id='tabla' marginBottom={2} size={{ xs: 12, sm: 12 }}>
        <Typography component={'h2'} variant='h4' mb={2}>Historial climático</Typography>
          <TableWeather itemsIn={item} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
