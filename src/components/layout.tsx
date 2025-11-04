import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Search, Sun } from 'lucide-react'
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
import { useNavigate } from 'react-router-dom';


export default function Layout({children}) {

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
            <img src="./logo2.png" alt="" className="h-14"/>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                className="relative justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setIsSearchOpen(true)}>
                <Search />
                Search cities...
              </Button>

              <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <CommandInput placeholder="Search cities..." value={query} onValueChange={setQuery}/>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
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
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Recent Searches">
                    <CommandItem>Profile</CommandItem>
                    <CommandItem>Billing</CommandItem>
                    <CommandItem>Settings</CommandItem>
                  </CommandGroup>
                </CommandList>
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
