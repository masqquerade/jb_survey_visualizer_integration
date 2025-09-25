import { useEffect, useState } from "react"
import API from "../services/api"
import { useDebounce } from "./useDebounce"

const DEBOUNCE_DELAY = 500

/**
 * 
 * @param {any} selectedCategory - The debounced, currently selected category object.
 * @param {number} amount - The amount of questions to be retrieved.
 * @returns {{ questions: Array<object>, isLoading: boolean }} - An object containing the questions array and the loading state.
 */
export const useQuestions = (selectedCategory, amount) => {
    const [questions, setQuestions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!selectedCategory) {
            return;
        }

        setIsLoading(true)

        const controller = new AbortController()

        const id = selectedCategory.id === -1 ? null : selectedCategory.id

        API.fetchQuestions({ amount, category: id }, { signal: controller.signal })
            .then(data => {
                if (data.response_code === 0) {
                    setIsLoading(false)
                    setQuestions(data.results)
                } else if (data.response_code !== 99) {
                    console.error("Could not load questions.")
                    setQuestions([])
                } 
        })
        .catch(error => {
            if (error.name !== "AbortError") {
                console.error("Unexpected error occured: ", error)
                setQuestions([])
            }
        })
        .finally(() => {
            if (!controller.signal.aborted) {
                setIsLoading(false)
            }
        })

        return () => {
            controller.abort();
        }
    }, [selectedCategory, amount])

    return { questions, isLoading }
}