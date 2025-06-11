"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchProps {
  onSearch: (query: string) => void
  className?: string
  placeholder?: string
}

export function Search({ onSearch, className, placeholder = "Search..." }: SearchProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [query])

  return (
    <div className={cn("flex w-full max-w-sm items-center space-x-2", className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-8 border-agribeta-green focus-visible:ring-agribeta-green"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button onClick={handleSearch} className="bg-agribeta-green hover:bg-agribeta-green/90">
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}
