import { useMemo } from "react"

/**
 * A custom hook that calculates the distribution of questions by difficulty.
 * @param {Array<object>} questions - The raw array of questions from the API.
 * @returns {Array<object>} - The transformed data for the chart.
 */
export const useDifficultyDistribution = (questions) => {
    const distribution = useMemo(() => {
        const counts = questions.reduce((acc, q) => {
            const difficulty = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)
            acc[difficulty] = (acc[difficulty] || 0) + 1
            return acc
        }, {})

        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [questions])

    return distribution
}

/**
 * A custom hook that calculates the distribution of questions by category.
 * It only performs if the "All Categories" option is selected.
 * @param {Array<any>} questions - The raw array of questions from the API.
 * @param {object} selectedCategory - The currently selected category.
 * @returns 
 */
export const useQuestionsDistribution = (questions, selectedCategory) => {
    const distribution = useMemo(() => {
        if (selectedCategory.id !== -1) return []

        const counts = questions.reduce((acc, q) => {
            acc[q.category] = (acc[q.category] || 0) + 1
            return acc
        }, {})

        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [questions, selectedCategory])

    return distribution
}