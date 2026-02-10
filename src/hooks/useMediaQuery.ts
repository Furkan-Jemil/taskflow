import { useState, useEffect } from 'react'

/**
 * Custom hook for responsive design - listens to media query changes
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        setMatches(media.matches)

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [query])

    return matches
}
