import { useEffect, useState } from "react"

/**
 * Debouncing-hook for delaying an action.
 * In this application this hook is being used to prevent spamming API calls when user switches the categories.
 * @param {any} value - The value to be debounced.
 * @param {number} delay - The debounce delay in ms.
 * @returns {any} - The debounced value, which only updates after delay has passed.
 */
export const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debounceValue
}