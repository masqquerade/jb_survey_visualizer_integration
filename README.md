# Survey Visualizer integration Test Task
[Demo Link](https://masqquerade.github.io/jb_survey_visualizer_integration/)

__Please note__: If the session token is expired or <50 questions from specific category can be retrieved, the tool will need additional time. You can see detailed logging in the console.

## Features
- __Category List__: View a complete, searchable list of all trivia categories.
- __Question distribution by category__: A bar chart displaying the number of questions per category from a random sample.
- __Question Distribution by difficulty__: A pie chart showing breakdown of questions by difficulty (Easy, Medium, Hard).
- __Dynamic filtering__: Interactively filter the question data by selecting a specific category to update the difficulty distribution chart.

## Stack
- __JavaScript__
- __React.js__
- __Native fetch API__
- __Recharts__
- __Tailwind CSS__

## Technical Challenges
#### 1. The problem: Too Many Requests
The Open Trivia API allows only __one request__ every 5 seconds per IP. On initial load, the app needs to:
- Request categories list
- Get new token and save it;
- Request 50 questions with new token

All of this steps was done immediately, which caused __Too Many Requests__ status code.

#### The solution: Queue
I implemented a FIFO request queue in the central API service __(src/services/api.js)__:
- All API calls are added to the queue
- A single processor works through the queue one item at time
- After each request completes, the processor waits for the mandatory 5-second cooldown before starting the next request.

This approach guarantees that the application never violates server's rate limit.

#### 2. The problem: Excessive Requests
The queue solved the rate-limiting issue, but it created a poor user experience. If a user quickly clicked several different categories, the app would add all five requests to the queue. The user, who only cares about their last selection, would have to wait for all outdated requests to process.

#### The solution: Debouncing + Request Cancellation
To solve this, I implemented two solutions:
- __Debouncing (useDebounce Hook)__: I introduced a debounce mechanism on the user's category selection. An API request is now only sent after user has stopped making changes for 500 ms. This prevents the queue from being spammed with unnecessary and outdated requests.
- __Request Cancellation__: To handle the edge case where a debounced request has already been sent but is now outdated, I integrated a cancellation system. When a new request is triggered, a cleanup function in __useEffect__ hook calls __controller.abort()__ (controller is a AbortController) on the previous request. The queue is smart enough to detect the aborted signal and will discard the request.

#### 3. The problem: Not enough questions in a category
As mentioned in the test task description, at least 50 questions should be used from the API. However, not all categories have enough questions. Therefore, sometimes status code 1 is being returned.
#### The solution:
- __Finding the count of questions in a category__: If status code 1 is returned from the DB API, internal service of the application creates another request to get the maximum possible number of questions in the specific category. As a next step, initial request is being repeated with the new amount of questions, preventing getting status code 1. Unfortunately, this leads to greater delays.

__Thank you for taking the time to review my solution.__
