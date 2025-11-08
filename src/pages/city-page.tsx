import { API_KEY } from '@/apifunctions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, Compass, Droplets, Gauge, Star, Sunrise, Sunset, Wind } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export default function CityPage({favorites, addFavorite, removeFavorite}) {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const lat = parseFloat(searchParams.get("lat"));
    const lon = parseFloat(searchParams.get("lon"));
    const coordinates = {
        lat, lon
    }


    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [forecastLoading, setForecastLoading] = useState(false);
    const [weatherData, setWeatherData] = useState({})
    const [forecast, setForecast] = useState(null);

    const temp = weatherData?.main?.temp ?? 0;
    const feels_like = weatherData?.main?.feels_like;
    const temp_min = weatherData?.main?.temp_min;
    const temp_max = weatherData?.main?.temp_max;
    const humidity = weatherData?.main?.humidity
    const speed = weatherData?.wind?.speed
    const pressure = weatherData?.main?.pressure
    const weather = weatherData?.weather?.[0]
    const sys = weatherData?.sys;
    const wind = weatherData?.wind;
    const country = weatherData?.sys?.country

    const isFavorite = favorites?.some((city) => city.lon === coordinates.lon && city.lat === coordinates.lat)

    function handleFavorite() {
      const newFavorite = {
        name: weatherData.name,
        lat, 
        lon, 
        country
      }
      if (isFavorite) {
        removeFavorite(lat, lon)
      } else {
        addFavorite(newFavorite)
      }
    }

    console.log(isFavorite)

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

    console.log(weatherData)

     const formatTemp = (temp) => {
    // if (!temp) return 
    return Math.round(temp)
  }

    async function fetchWeather() {
        try {
            // console.log("Hello")
            setWeatherLoading(true)
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`);
            const data = await res.json()
            // console.log(data)
            setWeatherData(data)
            setWeatherLoading(false)
            // console.log(weatherData)
        } catch (error) {
            console.log(error)
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

    useEffect(() => {
        fetchWeather()
        fetchForecast()
    }, [])
    
    // if (!weatherData || !forecast) return <p>Please wait while we fetch data</p>
   

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityname}, {country}
        </h1>
        <div className="flex gap-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="icon"
            onClick={handleFavorite}
            className={isFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
                <Star
                    className={`h-4 w-4`}
                />
            </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Current Weather */}
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="space-y-2">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold tracking-tight">
                        {/* {locationName?.name} */}
                        </h2>
                        {/* {locationName?.state && (
                        <span className="text-muted-foreground">
                            , {locationName.state}
                        </span>
                        )} */}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {/* {country} */}
                    </p>
                    </div>

                    <div className="flex items-center gap-2">
                    <p className="text-7xl font-bold tracking-tighter">
                        {formatTemp(temp)}
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                        Feels like {formatTemp(feels_like)}
                        </p>
                        <div className="flex gap-2 text-sm font-medium">
                        <span className="flex items-center gap-1 text-blue-500">
                            <ArrowDown className="h-3 w-3" />
                            {formatTemp(temp_min)}
                        </span>
                        <span className="flex items-center gap-1 text-red-500">
                            <ArrowUp className="h-3 w-3" />
                            {formatTemp(temp_max)}
                        </span>
                        </div>
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <div className="space-y-0.5">
                        <p className="text-sm font-medium">Humidity</p>
                        <p className="text-sm text-muted-foreground">{humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-500" />
                        <div className="space-y-0.5">
                        <p className="text-sm font-medium">Wind Speed</p>
                        <p className="text-sm text-muted-foreground">{speed} m/s</p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
                    <img
                        src="./overcast-clouds.png"
                        // alt={currentWeather.description}
                        className="h-full w-full object-contain"
                    />
                    <div className="absolute bottom-0 text-center">
                        <p className="text-sm font-medium capitalize">
                        {weather?.description}
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </CardContent>
        </Card>
        {/* Hourly Temp */}
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Today's Temperature</CardTitle>
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 items-start">
            
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
  )
}
