import { useState, useEffect } from "react"
import API from "../services/api"

/**
 * A custom hook to fetch and manage list of all available categories.
 * @returns {{ categories: Array<object>, isLoading: boolean }} - An object containing the array of categories and the loading state for better user experience.
 */
export const useCategories = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)

                const data = await API.fetchCategories()
                if (data && data.trivia_categories) {
                    const allCategoriesOpt = { id: -1, name: "All Categories" }
                    setCategories([allCategoriesOpt, ...data.trivia_categories])
                } else {
                    throw new Error("Could not fetch categories.")
                }
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { categories, isLoading }
}