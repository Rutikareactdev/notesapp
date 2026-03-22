import { StickyNote } from 'lucide-react'
import React from 'react'

function Logo() {
  return (
      <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary border-2 shadow-glow">
              <StickyNote className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">NoteAI</h1>
            <p className="text-muted-foreground text-center">
              AI-powered note-taking for the modern mind
            </p>
          </div>
  )
}

export default Logo