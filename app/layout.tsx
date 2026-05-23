import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NOVARA Habitat | Rénovation premium & habitat intelligent',
  description: 'NOVARA Habitat accompagne vos projets de rénovation, énergie, smart home et amélioration de l’habitat avec une approche premium et digitale.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
