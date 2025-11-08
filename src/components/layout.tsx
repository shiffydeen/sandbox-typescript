import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Clock, Search, Star, Sun, XCircle } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { API_KEY } from '@/apifunctions';
import { Link, useNavigate } from 'react-router-dom';


export default function Layout({children, favorites, history, addHistory, clearHistory}) {

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [locations, setLocations] = useState(null)
  const navigate = useNavigate();

  async function fetchCities() {
    console.log("hello")
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    const data = await res.json();
    setLocations(data)
    console.log(data)
  }

  function handleSelect(cityData) {
    // console.log(cityData)
    const [lat, lon, name, country] = cityData.split("|")
    // console.log({
    //   lat, lon, name, country
    // })

    const recent = {
      name, lat, lon, country
    }
    addHistory(recent)
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
    setIsSearchOpen(false);
  }

  useEffect(() => {
    if (query.length < 3) return
    fetchCities()
  }, [query])

  return (
    <div className=" bg-gradient-to-br from-background to-muted">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
          <div className="container flex justify-between items-center mx-auto h-16 px-4">
            <Link to="/">
              <img src="./logo2.png" alt="" className="h-14"/>
            </Link>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                className="relative justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setIsSearchOpen(true)}>
                <Search />
                Search cities...
              </Button>

              <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <Command>
                  <CommandInput placeholder="Search cities..." value={query} onValueChange={setQuery}/>
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {
                      favorites.length > 0 && (
                        <>
                          <CommandGroup heading="Favourites">
                            {favorites.map((favorite) => (
                              <CommandItem>
                                <Star className='w-4 h-4 text-yellow-500'/>
                                <span>{favorite.name}</span>
                                {favorite.state && (
                                  <span>, {location.state}</span>
                                )}
                                <span>, {favorite.country}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )
                    }
                    
                  { 
                  history.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <div className='flex justify-between'>
                          <p className='text-xs text-muted-foreground'>Recent Searches</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}

                            >
                            <XCircle className='w-4 h-4'/>
                            Clear
                          </Button>
                        </div>
                        {history.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                            onSelect={handleSelect}
                          >
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{item.name}</span>
                            {item.state && (
                              <span className="text-sm text-muted-foreground">
                                , {item.state}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground">
                              , {item.country}
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {/* {format(item.searchedAt, "MMM d, h:mm a")} */}
                            </span>
                          </CommandItem>
                  ))}

                      </CommandGroup>
                    </>)
                  }

                    {locations && locations?.length > 0 && (
                      <CommandGroup heading="Suggestions">
                      {locations?.map((location) => (
                        <CommandItem 
                          value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                          onSelect={handleSelect}>
                          <Search />
                          <span>{location.name}</span>
                          {location.state && (
                            <span>{location.state}</span>
                          )}
                          <span>{location.country}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>)}

                    
                    
                    
                  
                  </CommandList>
                </Command>     
              </CommandDialog>

              <div className="flex items-center cursor-pointer">
                <Sun />
                <span className="sr-only">Toggle theme</span>
              </div>
            </div>
          </div>
      </header>
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t py-12 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto text-center text-gray-200">
          <p>Made with 💗 by Sheriff</p>
        </div>
      </footer>
    </div>
  )
}
