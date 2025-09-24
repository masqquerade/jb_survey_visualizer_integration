import { useEffect, useState } from "react"
import Header from "./components/Header/Header.jsx"
import "./index.css"
import Categories from "./components/Categories/Categories.jsx"
import Charts from "./components/Charts/Charts.jsx"
import { useQuestions } from "./hooks/useQuestions.js"
import { useDebounce } from "./hooks/useDebounce.js"

function App() {
  const [selectedCategory, setSelectedCategory] = useState({ id: -1, name: "All Categories" })
  const { questions, isLoading } = useQuestions(selectedCategory, 50)
  const debouncedCategory = useDebounce(selectedCategory)

  return (
    <div className="bg-[#171717] min-h-screen">
      {
        <div className="container mx-auto bg-[#171717] h-full">
          <div className="flex p-6 lg:h-screen">
            <Categories
              selectedItem={selectedCategory}
              setSelectedItem={setSelectedCategory}
            />

            <div className="flex-1 flex flex-col">
              <Charts
                isLoading={isLoading || (selectedCategory.id !== debouncedCategory.id)}
                questions={questions}
                selectedCategory={debouncedCategory}
              />
            </div>
          </div>
      </div>
      }
    </div>
  )
}

export default App
