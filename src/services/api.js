const RETRIEVE_TOKEN_URL = "https://opentdb.com/api_token.php?command=request"
const CATEGORY_LOOKUP_URL = "https://opentdb.com/api_category.php"
const CATEGORY_COUNT_LOOKUP_URL = "https://opentdb.com/api_count.php?category="

const queue = []

/** @type {boolean} - A flag to ensure only one instance of queueFetch is running. */
let isProcessing = false

const TOKEN_STORAGE_KEY = "opentdbApiKey"

/** @type {number} - the mandatory delay in ms between API calls. */
const RATE_LIMIT_DELAY = 5000

/**
 * @enum {number}
 * An enum of API response codes for clarity.
 */
const RESPONSE_CODES = {
  SUCCESS: 0,
  NO_RESULTS: 1,
  INVALID_PARAMETER: 2,
  TOKEN_NOT_FOUND: 3,
  TOKEN_EMPTY: 4,

  ABORTED: 99,
  WAITING: 100,
};

const unshiftRetrieveToken = () => {
        queue.unshift({
            url: RETRIEVE_TOKEN_URL,
            resolve: (resetData) => {
                if (resetData.token) {
                    console.log("New token successfully retrieved: ", resetData.token)
                    sessionStorage.setItem(TOKEN_STORAGE_KEY, resetData.token)
                }
            },
            reject: (error) => console.error("Failed to retrieve new token: ", error),
            signal: null,
            tokenReq: false,
        })
}

/**
 * Processes the API request queue one by one (FIFO).
 * This function is internal and should not be used directly from outside this module.
 * It also automatically handles session tokens saving them in SessionStorage for consistency within one session.
 */
const queueFetch = async () => {
    if (queue.length === 0) {
        isProcessing = false
        return
    }

    isProcessing = true 

    const { url, resolve, reject, tokenReq, signal } = queue.shift()

    if (signal?.aborted) {
        console.log("Request aborted, skipping: ", url)
        resolve({ response_code: RESPONSE_CODES.ABORTED, results: [] })
        setTimeout(queueFetch, 0)
        return
    }

    try {
        const token = sessionStorage.getItem(TOKEN_STORAGE_KEY)

        if (!token && tokenReq) {
            queue.unshift({ url, resolve, reject, signal });
            unshiftRetrieveToken()
        } else {
            const urlWithToken = `${url}&token=${token}`

            console.log("Url with token: ", urlWithToken)
            const response = await fetch(tokenReq ? urlWithToken : url, { signal })
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()
            console.log("Fetched data: ", data)

            if (data.response_code === RESPONSE_CODES.TOKEN_NOT_FOUND || data.response_code === RESPONSE_CODES.TOKEN_EMPTY) {
                console.warn("Token is empty/expired. Refreshing...")

                queue.unshift({ url, resolve, reject, signal });

                unshiftRetrieveToken()
            } else if (data.response_code === RESPONSE_CODES.NO_RESULTS) {
                console.warn("No questions available. Trying to retrieve smaller amount...")

                const originalUrlObject = new URL(url)
                const category = originalUrlObject.searchParams.get("category")

                if (category) {
                    queue.unshift({
                        url: `${CATEGORY_COUNT_LOOKUP_URL}${category}`,
                        resolve: (countData) => {
                            const newAmount = countData.category_question_count.total_question_count
                            console.log(`Found ${newAmount} questions.`)

                            const retryUrlObject = new URL(url)
                            retryUrlObject.searchParams.set("amount", newAmount)

                            queue.unshift({
                                url: retryUrlObject,
                                resolve,
                                reject,
                                signal,
                                tokenReq: true
                            })
                        },
                        reject: (error) => console.error("Failed to get smaller amount: ", error),
                        signal,
                        tokenReq: false
                    })
                }
                
            } else {
                resolve(data)
            }
        }

        
    } catch (error) {
        reject(error)
    } finally {
        setTimeout(queueFetch, RATE_LIMIT_DELAY)
    }
}

/**
 * Enques request putting it into FIFO queue and starts the queueFetch if it's not already runnin, enforcing the rate limit.
 * This is a public interface for making requets (fetching).
 * @param {string} url - The API endpoint to call.
 * @param {boolean} [tokenReq = false] - Indicates whether the request requires a session token.
 * @param {object} [options = {}] - Options for the request. Includes signal for request-abortion.
 * @returns {Promise<any>} - A promise that resolves with the API response data.
 */
const enqueueRequest = (url, tokenReq = false, options = {}) => {
    return new Promise((resolve, reject) => {
        queue.push({ url: url, resolve, reject, tokenReq, signal: options.signal })
        if (!isProcessing) {
            queueFetch()
        }
    })
}

const API = {
    /**
     * Retrieves a new session token.
     * This session token is being used to prevent getting the same questions.
     * Stores the token in sessionStorage to persist it across page reloads.
     * @returns {Promise<string | null>} - The new token, or null if failed.
     */
    retrieveNewToken: async (options = {}) => {
        try {
            const data = await enqueueRequest(RETRIEVE_TOKEN_URL, false, options)
            console.log("New token data: ", data)

            if (data.response_code === 0 && data.token) {
                sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token)
                console.log("New token succesfully retrieved.")
                return data.token
            } else {
                throw new Error("API-call did not return token.")
            }
        } catch (error) {
            console.error("Failed to retrieve API-token: ", error)
            sessionStorage.removeItem(TOKEN_STORAGE_KEY)
            return null
        }
    },

    /**
     * Fetches a specified number of questions, optionally filtered by category.
     * Handles token management automatically.
     * @param {object} options - Contains information for the request.
     * @param {number} options.amount - The number of questions to be retrieved.
     * @param {number | null} options.category - The category ID to filter by.
     * @returns {Promise<object>} - The API response containing the questions.
     */
    fetchQuestions: async ({ amount = 50, category = null }, options = {}) => {
        const buildUrl = () => {
            let url = `https://opentdb.com/api.php?amount=${amount}`
            if (category) {
                url += `&category=${category}`
            }

            return url
        }

        let apiUrl = buildUrl()
        const data = await enqueueRequest(apiUrl, true, options)

        return data
    },

    /**
     * Fetched the list of all available categories with their IDs.
     * @returns {Promise<any>} - The API response containing the category list.
     */
    fetchCategories: async (options = {}) => {
        try {
            const data = await enqueueRequest(CATEGORY_LOOKUP_URL, false, options)
            return data
        } catch (error) {
            console.error(error)
            return { trivia_categories: [] }
        }
    }
}

export default API
