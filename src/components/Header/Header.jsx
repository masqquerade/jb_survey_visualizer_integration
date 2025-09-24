import React from "react"

const Header = ({ iconPath, title }) => {
    return (
        <div className="flex">
            <img src={iconPath} className="w-4"/>
            <div className="font-semibold ml-5 text-xl text-white ">
                {title}
            </div>
        </div>
    )
}

export default Header