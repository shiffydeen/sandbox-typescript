import { ArrowDown, ArrowUp, Compass, Droplet, Droplets, Gauge, RefreshCcw, Search, Sun, Sunrise, Sunset, Wind, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useEffect, useState } from "react"
import { API_KEY } from "../apifunctions"
import { format } from "date-fns";
import { useNavigate } from "react-router-dom"

function Dashboard({favorites, removeFavorite}) {

  // const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [forecastLoading, setForecastLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [weatherData, setWeatherData] = useState({})
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null)

  const navigate= useNavigate()


  const temp = weatherData?.main?.temp ?? 0;
  // console.log(temp)
  const feels_like = weatherData?.main?.feels_like;
  const temp_min = weatherData?.main?.temp_min;
  const temp_max = weatherData?.main?.temp_max;
  const humidity = weatherData?.main?.humidity
  const speed = weatherData?.wind?.speed
  const pressure = weatherData?.main?.pressure
  const weather = weatherData?.weather?.[0]
  const sys = weatherData?.sys;
  const wind = weatherData?.wind;

  const weatherDetails = [
    {
      title: "Sunrise",
      value: sys?.sunrise,
      icon: Sunrise,
      color: "text-orange-500"
    },
    {
      title: "Sunset",
      value: sys?.sunset,
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Wind Direction",
      value: wind?.deg,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: pressure,
      icon: Gauge,
      color: "text-purple-500",
    },
  ]

  
  const formatTemp = (temp) => {
    // if (!temp) return 
    return Math.round(temp)
  }

  const dailyForecasts = forecast?.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {})

  const nextDays = Object.values(dailyForecasts || {}).slice(1, 6);

 
  function handleClick(city) {
    navigate(`/city/${city.name}?lat=${city.lat}&lon=${city.lon}`)
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
      console.log(data)
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
     getLocationName();
  }, [coordinates])


  if (isLocationLoading) return <p>Please wait while we get your location</p>

 

  return (
    <>
        <div className="space-y-4">
          {favorites.length > 0 && (
            <>
          <h1 className="font-bold text-xl tracking-tighter">Favorites</h1>
            <div className="flex gap-4">
              {
                favorites.map((city) => (
                    <div 
                      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
                      role="button"
                      onClick={() => handleClick(city)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-6 w-6 rounded-full p-0  hover:text-destructive-foreground group-hover:opacity-100"
                          onClick={() => removeFavorite(city.lat, city.lon)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      <div>
                        <img src="" alt="" />
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-xs text-muted-foreground">JP</p>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-xl font-bold">11°</p>
                        <p className="text-xs capitalize text-muted-foreground">Clear Sky</p>
                      </div>
                    </div>
                ))
              }
            </div>
              </>
          )}
          
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
                            {
                              weatherDetails.map((detail) => (
                                <div className="p-4 flex items-center border rounded-lg gap-3">
                                  <detail.icon className={`h-5 w-5 ${detail.color}`}/>
                                  <div>
                                    <p className="text-sm font-medium leading-none">{detail.title}</p>
                                    <p className="text-muted-foreground text-sm">{detail.value}</p>
                                  </div>
                                </div>
                              ))
                            }
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
                    {
                      nextDays.map((detail) => (
                          <div className="grid grid-cols-3 items-center border p-4 rounded-lg gap-4">
                            <div>
                              <p className="font-medium">{detail.date}</p>
                              <p className="text-muted-foreground text-sm">{detail.weather.description}</p>
                            </div>
                            <div className="flex justify-center gap-4">
                              <span className="flex text-blue-500 items-center">
                                <ArrowUp className="h-4 w-4 mr-1"/>
                                {detail.temp_max}°
                              </span>
                              <span className="flex text-red-500 items-center">
                                <ArrowDown className="h-4 w-4 mr-1"/>
                                {detail.temp_min}°
                              </span>
                            </div>
                            <div className="flex justify-end gap-4">
                              <span className="flex items-center gap-1">
                                <Droplets className="w-4 h-4 mr-1 text-blue-500"/>
                                <span className="text-sm">
                                  {detail.humidity}%
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Wind className="w-4 h-4 mr-1 text-blue-500"/>
                                <span className="text-sm">
                                  {detail.wind}m/s
                                </span>
                              </span>
                            </div>
                          </div>
                      ))
                    }
                    </div>
                      
                    </>
                  )}
                 
                </CardContent>

              </Card>
            </div>
          </div>
        </div>
      
    </>
  )
}

export default Dashboard
