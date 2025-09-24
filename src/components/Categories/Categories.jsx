import React, { useMemo, useState } from "react"
import Header from "../Header/Header"

import categoriesIcon from "../../assets/categoriesIcon.svg"
import Input from "../Input/Input"
import CategoryList from "./CategoryList"
import { useCategories } from "../../hooks/useCategories"

const Categories = ({ selectedItem, setSelectedItem }) => {
    const [inputValue, setInputValue] = useState("")
    const { categories, isLoading } = useCategories()

    const onInputChange = (event) => {
        setInputValue(event.target.value)
    }

    const onItemSelect = (itemId, itemName) => {
        setSelectedItem(
            { id: itemId, name: itemName }
        )
    }

    const filterCategories = useMemo(() => {
        if (!inputValue) return categories

        return categories.filter(category => 
            category.name.toLowerCase().includes(inputValue.toLowerCase())
        )
    }, [inputValue, categories])

    return (
        <aside className="w-64 flex flex-col h-full mr-8">
            <div className="flex-shrink-0">
                <div className="mb-8">
                    <Header
                        iconPath={categoriesIcon}
                        title={"Categories"}
                    />
                </div>
                <Input
                    placeholder={"Search for a category"}
                    value={inputValue}
                    onChange={onInputChange}
                />
            </div>
            
            <div className="flex-1 overflow-y-auto mt-5 custom-scrollbar h-full">
                <CategoryList
                    items={filterCategories}
                    selectedItemId={selectedItem ? selectedItem.id : null}
                    onItemSelect={onItemSelect}
                    isLoading={isLoading}
                />
            </div>
        </aside>
    )
}

export default Categories