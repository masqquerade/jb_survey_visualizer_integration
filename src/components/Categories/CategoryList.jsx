import React from "react"

import "./scrollbar.style.css"

const CategoryList = ({ items, selectedItemId, onItemSelect, isLoading }) => {
    return (
        <div className="w-full max-w-xs rounded-lg max-h-72 pr-3">
            <ul className="space-y-1">
                {isLoading ? <div className="w-full flex justify-center text-white">Loading...</div> : (items.length == 0 ? <div className="w-full flex justify-center text-white">No categories found.</div> : items.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => onItemSelect(item.id, item.name)}
                            className=
                            {`w-full text-left p-2 rounded-md transition-colors duration-200
                                ${selectedItemId === item.id 
                                ? 'bg-blue-600 text-white font-semibold shadow-lg' 
                                : 'text-gray-500 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >{item.name}</button>
                    </li>
                )))}
            </ul>
        </div>
    )
}

export default CategoryList