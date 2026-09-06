'use client'

import { LanguagesIcon } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supportedLanguages } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
      <SelectTrigger
        aria-label="Change language"
        className="h-8 gap-1.5 border-none bg-transparent px-2 text-xs shadow-none hover:bg-accent/60"
      >
        <LanguagesIcon className="size-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {supportedLanguages.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.label}
              {l.reviewPending ? ' (review pending)' : ''}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
