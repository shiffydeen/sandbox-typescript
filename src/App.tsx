import { ArrowDown, ArrowUp, Droplet, Droplets, RefreshCcw, Search, Sun, Wind, X } from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { useEffect, useState } from "react"
import { API_KEY } from "./apifunctions"


function App() {

  // const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [forecastLoading, setForecastLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState({})
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null)


  const temp = weatherData?.main?.temp ?? 0;
  // console.log(temp)
  const feels_like = weatherData?.main?.feels_like;
  const temp_min = weatherData?.main?.temp_min;
  const temp_max = weatherData?.main?.temp_max;
  const humidity = weatherData?.main?.humidity
  const speed = weatherData?.wind?.speed
  const weather = weatherData?.weather?.[0]

  
  const formatTemp = (temp) => {
    // if (!temp) return 
    return Math.round(temp)
  }
  

  async function fetchWeather() {
    try {
      setWeatherLoading(true)
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`);
      const data = await res.json()
      console.log(data)
      setWeatherData(data)
      setWeatherLoading(false)
      console.log(weatherData)
    } catch (error) {
      
    }
  }

  async function fetchForecast() {
    try {
      setForecastLoading(true)
      const res = await fetch(`https://pro.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`);
      const data = await res.json();
      setForecast(data)
      setForecastLoading(false)
    } catch (error) {
      
    }
    
  }

  function getCoordinates() {
    setIsLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        const coordinates = {
          lon: position.coords.longitude,
          lat: position.coords.latitude,
        }
        setCoordinates(coordinates)
        setIsLocationLoading(false)
      }
    )
  }

  async function getLocationName() {
    try {
      const res = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`);
      const data = await res.json();
      console.log(data[0]);
      setLocationInfo(data[0]);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getCoordinates()
  }, [])

  useEffect(() => {
    if(!coordinates) return
    fetchForecast()
    fetchWeather()
  }, [coordinates])

  useEffect(() => {
    if (!coordinates) return
    getLocationName();
  }, [coordinates])


  if (isLocationLoading) return <p>Please wait while we get your location</p>

 

  return (
    <div className=" bg-gradient-to-br from-background to-muted">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
          <div className="container flex justify-between items-center mx-auto h-16 px-4">
            <img src="./logo2.png" alt="" className="h-14"/>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                className="relative justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
                <Search />
                Search cities...
              </Button>
              <div className="flex items-center cursor-pointer">
                <Sun />
                <span className="sr-only">Toggle theme</span>
              </div>
            </div>
          </div>
      </header>
      <main className="min-h-screen container mx-auto px-4 py-8">
        <div className="space-y-4">
          <h1 className="font-bold text-xl tracking-tighter">Favorites</h1>
          <div className="flex gap-4">
            <div className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
            role="button">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0  hover:text-destructive-foreground group-hover:opacity-100"
              >
                <X className="h-4 w-4"/>
              </Button>
                <div>
                  <img src="" alt="" />
                  <div>
                    <p className="font-medium">Abu</p>
                    <p className="text-xs text-muted-foreground">JP</p>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-bold">11°</p>
                  <p className="text-xs capitalize text-muted-foreground">Clear Sky</p>
                </div>
              
            </div>
            <div className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
            role="button">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0  hover:text-destructive-foreground group-hover:opacity-100"
              >
                <X className="h-4 w-4"/>
              </Button>
                <div>
                  <img src="" alt="" />
                  <div>
                    <p className="font-medium">Abu</p>
                    <p className="text-xs text-muted-foreground">JP</p>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-bold">11°</p>
                  <p className="text-xs capitalize text-muted-foreground">Clear Sky</p>
                </div>
              
            </div>
          </div>
          <div className="flex justify-between">
            <h1 className="tracking-tighter font-bold text-xl">My Location</h1>
            <Button
              variant="outline"
              size="icon"

            >
              <RefreshCcw className="h-4 w-4"/>
            </Button>
          </div>
        {/* My Location */}
          <div className="grid gap-6">
            {/* first row */}
            <div className="flex flex-col lg:flex-row gap-4">
              <Card>
                <CardContent className="p-6">
                  {
                    weatherLoading ? (
                      <p>Please wait, the weather data is loading.</p>
                    ) : (
                      <>
                        <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <h2 className="tracking-tight font-bold text-2xl">{locationInfo?.name}</h2>
                            <span className="text-muted-foreground">, {locationInfo?.state}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{locationInfo?.country}</p>
                        </div>
                        <div className="flex">
                          <div className="flex items-center gap-2">
                              <p className="text-7xl font-bold tracking-tighter">{formatTemp(temp)}°</p>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Feels like {formatTemp(feels_like)}°</p>
                                <div className="flex gap-2 text-sm font-medium">
                                  <span className="flex items-center gap-1 text-blue-500">
                                    <ArrowUp className="h-3 w-3"/>
                                    {formatTemp(temp)}°
                                  </span>
                                  <span className="flex items-center gap-1 text-red-500">
                                    <ArrowDown className="h-3 w-3"/>
                                    {formatTemp(temp_min)}°
                                  </span>
                                </div>
                              </div>
                          </div>
                          <div></div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500"/>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">Humidity</p>
                              <p className="text-muted-foreground text-sm">{humidity}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-blue-500"/>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">Wind Speed</p>
                              <p className="text-muted-foreground text-sm">{speed}%</p>
                            </div>
                          </div>
                          <div></div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="relative flex items-center justify-center">

                          <img src="./overcast-clouds.png" alt="" className="w-full h-full"/>
                          <p className="absolute bottom-0 capitalize font-medium">Overcast Clouds</p>
                        </div>
                      </div>
                        </div>
                      </>
                    )
                  } 
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>
                    Today's Temperature
                  </CardTitle>
                  <CardContent>
                    {forecastLoading ? (
                      <p>Please wait, the weather data is loading.</p>
                    ) : (
                      <p>Data</p>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
            {/* second row */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <Card>
                  <CardHeader>
                    <CardTitle>Weather Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {
                      weatherLoading ? (
                        <p>Please wait, the weather data is loading.</p>
                      ) : (
                        <>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div className="p-4 flex border rounded-lg gap-3">
                                <div></div>
                                <div>
                                  <p>Sunrise</p>
                                  <p>6:33AM</p>
                                </div>
                            </div>
                            <div className="p-4 flex border rounded-lg gap-3">
                                <div></div>
                                <div>
                                  <p>Sunrise</p>
                                  <p>6:33AM</p>
                                </div>
                            </div>
                            <div className="p-4 flex border rounded-lg gap-3">
                                <div></div>
                                <div>
                                  <p>Sunrise</p>
                                  <p>6:33AM</p>
                                </div>
                            </div>
                            <div className="p-4 flex border rounded-lg gap-3">
                                <div></div>
                                <div>
                                  <p>Sunrise</p>
                                  <p>6:33AM</p>
                                </div>
                            </div>
                      
                          </div>
                        </>
                      )
                    }
                    
                  </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  {forecastLoading ? (
                    <p>Please wait, the forecast data is loading.</p>
                  ) : (
                    <>
                       <div className="grid gap-4">
                    <div className="grid grid-cols-3 items-center border p-4 rounded-lg gap-4">
                      <div>
                        <p className="font-medium">Fri, Oct 31</p>
                        <p className="text-muted-foreground text-sm">Overcast Clouds</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <span className="flex text-blue-500 items-center">
                          <ArrowUp className="h-4 w-4 mr-1"/>
                          26°
                        </span>
                        <span className="flex text-red-500 items-center">
                          <ArrowDown className="h-4 w-4 mr-1"/>
                          29°
                        </span>
                      </div>
                      <div className="flex justify-end gap-4">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            81%
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            3.62m/s
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center border p-4 rounded-lg gap-4">
                      <div>
                        <p className="font-medium">Fri, Oct 31</p>
                        <p className="text-muted-foreground text-sm">Overcast Clouds</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <span className="flex text-blue-500 items-center">
                          <ArrowUp className="h-4 w-4 mr-1"/>
                          26°
                        </span>
                        <span className="flex text-red-500 items-center">
                          <ArrowDown className="h-4 w-4 mr-1"/>
                          29°
                        </span>
                      </div>
                      <div className="flex justify-end gap-4">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            81%
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            3.62m/s
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center border p-4 rounded-lg gap-4">
                      <div>
                        <p className="font-medium">Fri, Oct 31</p>
                        <p className="text-muted-foreground text-sm">Overcast Clouds</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <span className="flex text-blue-500 items-center">
                          <ArrowUp className="h-4 w-4 mr-1"/>
                          26°
                        </span>
                        <span className="flex text-red-500 items-center">
                          <ArrowDown className="h-4 w-4 mr-1"/>
                          29°
                        </span>
                      </div>
                      <div className="flex justify-end gap-4">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            81%
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            3.62m/s
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center border p-4 rounded-lg gap-4">
                      <div>
                        <p className="font-medium">Fri, Oct 31</p>
                        <p className="text-muted-foreground text-sm">Overcast Clouds</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        <span className="flex text-blue-500 items-center">
                          <ArrowUp className="h-4 w-4 mr-1"/>
                          26°
                        </span>
                        <span className="flex text-red-500 items-center">
                          <ArrowDown className="h-4 w-4 mr-1"/>
                          29°
                        </span>
                      </div>
                      <div className="flex justify-end gap-4">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            81%
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="w-4 h-4 mr-1 text-blue-500"/>
                          <span className="text-sm">
                            3.62m/s
                          </span>
                        </span>
                      </div>
                    </div>
                        </div>
                    </>
                  )}
                 
                </CardContent>

              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-12 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto text-center text-gray-200">
          <p>Made with 💗 by Sheriff</p>
        </div>
      </footer>
    </div>
  )
}

export default App
