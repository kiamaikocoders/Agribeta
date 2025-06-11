"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface DiagnosisResult {
  id: string
  timestamp: number
  image: string
  disease: string
  confidence: number
  description: string
  treatment: string[]
  preventionTips: string[]
}

interface DiagnosisHistoryContextType {
  history: DiagnosisResult[]
  addDiagnosis: (diagnosis: Omit<DiagnosisResult, "id" | "timestamp">) => void
  clearHistory: () => void
  getDiagnosis: (id: string) => DiagnosisResult | undefined
}

const DiagnosisHistoryContext = createContext<DiagnosisHistoryContextType | undefined>(undefined)

export function DiagnosisHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<DiagnosisResult[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("diagnosisHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to parse diagnosis history:", error)
      }
    }
  }, [])

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("diagnosisHistory", JSON.stringify(history))
  }, [history])

  const addDiagnosis = (diagnosis: Omit<DiagnosisResult, "id" | "timestamp">) => {
    const newDiagnosis: DiagnosisResult = {
      ...diagnosis,
      id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    setHistory((prev) => [newDiagnosis, ...prev])
  }

  const clearHistory = () => {
    setHistory([])
  }

  const getDiagnosis = (id: string) => {
    return history.find((item) => item.id === id)
  }

  return (
    <DiagnosisHistoryContext.Provider value={{ history, addDiagnosis, clearHistory, getDiagnosis }}>
      {children}
    </DiagnosisHistoryContext.Provider>
  )
}

export function useDiagnosisHistory() {
  const context = useContext(DiagnosisHistoryContext)
  if (context === undefined) {
    throw new Error("useDiagnosisHistory must be used within a DiagnosisHistoryProvider")
  }
  return context
}
