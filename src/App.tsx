import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import IndicatorWeather from './components/IndicatorWeather'
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';

import Navbar from './components/NavBar';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  //const [count, setCount] = useState(0)
  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  let [item, setItems] = useState<Item[]>([])

  let [temperature, setTemperarure] = useState<number[]>([])
  let [humidity, setHumidity] = useState<number[]>([])
  let [feelsLike, setFeelsLike] = useState<number[]>([])
  let [timeLabels, setTimeLables] = useState<string[]>([])
  let [selected, setSelected] = useState<number>(3);

  const [city, setCity] = useState<string>('Guayaquil')

  {/* Hook: useEffect */ }
  useEffect(() => {
    console.log("Ciudad actual:", city);
    if (!city) return;

    let request = async () => {
      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");
      let savedCity = localStorage.getItem("city");

      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();

      if (expiringTime === null || nowTime > parseInt(expiringTime) || savedCity !== city) {
        console.log("Llamando a la API...");
        {/* Request */ }
        let API_KEY = "f51d9809326a75824f6f3149fedae141"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();
        console.log(savedTextXML);  // Verifica que los datos XML estén llegando correctamente


        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay


        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }

      if (savedTextXML) {
        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }

        let dataToIndicators: Indicator[] = new Array<Indicator>();

        let dataToItem: Item[] = new Array<Item>();

        let dataTemperarure: number[] = new Array<number>();
        let dataHumidity: number[] = new Array<number>();
        let dataFeelsLike: number[] = new Array<number>();
        let timeLabels: string[] = new Array<string>();

        {/* 
                 Análisis, extracción y almacenamiento del contenido del XML 
                 en el arreglo de resultados
             */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })


        let times = xml.getElementsByTagName("time")
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
          dataTemperarure.push(parseFloat(temperatureValue) - 273.15)
          dataHumidity.push(parseFloat(value))
          dataFeelsLike.push(parseFloat(feelsLikeValue) - 273.15)
          

        }
        //console.log(dataToIndicators)
        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators)
        setItems(dataToItem.slice(0, 5))
        setTemperarure(dataTemperarure)
        setHumidity(dataHumidity)
        setFeelsLike(dataFeelsLike)
        setTimeLables(timeLabels)
      }
    }

    request();
  }, [owm, city])

  let renderIndicators = () => {

    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 3 }}>
            <IndicatorWeather
              title={indicator["title"]}
              subtitle={indicator["subtitle"]}
              value={indicator["value"]} />
          </Grid>
        )
      )

  }

  return (
    <div>
      <Navbar onCitySearch={(city) => {
    console.log("Ciudad seleccionada:", city);
    setCity(city); // Actualiza la ciudad en el estado del padre
}} />
      <Grid container spacing={5}>

        {/* Indicadores */}
        {/*<Grid size={{ xs: 12, xl: 3 }}><IndicatorWeather title={'Indicador 1'} subtitle={'Unidad 1'} value={'1.23'} /></Grid>
      <Grid size={{ xs: 12, xl: 3 }}><IndicatorWeather title={'Indicador 2'} subtitle={'Unidad 2'} value={'3.12'} /></Grid>
      <Grid size={{ xs: 12, xl: 3 }}><IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"} /></Grid>
      <Grid size={{ xs: 12, xl: 3 }}><IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"} /></Grid>
      </Grid>*/}

        {renderIndicators()}

        {/* Tabla */}
        <Grid size={{ xs: 12, sm: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 9 }}>
              <ControlWeather setSelected={setSelected} />
            </Grid>
            <Grid size={{ xs: 9, sm: 12 }}>
              <TableWeather itemsIn={item} />
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <LineChartWeather
            temperatureData={selected === 0 || selected === 3 ? temperature : []}
            humidityData={selected === 1 || selected === 3 ? humidity : []}
            feelsLikeData={selected === 2 || selected === 3 ? feelsLike : []}
            timeLabels={timeLabels}
            selected={selected} />
        </Grid>
      </Grid>
    </div>
  )
}

export default App
