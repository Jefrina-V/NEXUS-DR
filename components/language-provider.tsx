'use client'

import * as React from 'react'
import { type LanguageCode, translate } from '@/lib/i18n'

const STORAGE_KEY = 'nexus-dr-language'

interface LanguageContextValue {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<LanguageCode>('en')

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setLanguageState(stored as LanguageCode)
    } catch {
      // localStorage unavailable — silently keep default
    }
  }, [])

  const setLanguage = React.useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore persistence failures
    }
  }, [])

  const t = React.useCallback((key: string) => translate(language, key), [language])

  const value = React.useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
