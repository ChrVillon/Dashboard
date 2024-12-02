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

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  //const [count, setCount] = useState(0)
  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])

  let [item, setItems] = useState<Item[]>([])

  {/* Hook: useEffect */ }
  useEffect(() => {
    let request = async () => {

      {/* Request */ }
      let API_KEY = "f51d9809326a75824f6f3149fedae141"
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
      let savedTextXML = await response.text();

      {/* XML Parser */ }
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      {/* Arreglo para agregar los resultados */ }

      let dataToIndicators: Indicator[] = new Array<Indicator>();

      let dataToItem: Item[] = new Array<Item>();

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


      let time = xml.getElementsByTagName("time")[1]
      let from = time.getAttribute("from") || ""
      let to = time.getAttribute("to") || ""

      let precipitation = xml.getElementsByTagName("precipitation")[1]
      let probability = precipitation.getAttribute("probability") || ""
      
      let humidity = xml.getElementsByTagName("humidity")[1]
      let value = humidity.getAttribute("value") || ""

      let clouds = xml.getElementsByTagName("clouds")[1]
      let all = clouds.getAttribute("all") || ""

      dataToItem.push({"dateStart": from, "dateEnd": to, "precipitation": probability, "humidity": value, "clouds": all})

      //console.log(dataToIndicators)
      {/* Modificación de la variable de estado mediante la función de actualización */ }
      setIndicators(dataToIndicators)

      setItems(dataToItem)
    }

    request();
  }, [])

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
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 9, sm: 12 }}>
            <TableWeather itemsIn={item}/>
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <LineChartWeather />
      </Grid>
    </Grid>

  )
}

export default App
