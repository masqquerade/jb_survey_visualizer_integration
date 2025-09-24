import React, { useState } from "react"

import eyeIcon from "../../assets/eye.svg"

const Input = ({ input, onChange, placeholder }) => {

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-2 flex items-center">
                <img src={eyeIcon}/>
            </div>
            <input type="text" 
                className="w-full bg-[#4f4f4f] rounded-lg placeholder:text-[#a3a3a3] border-slate-200 focus:outline-none focus:border-slate-400 text-white pl-10 font-light pb-1 pt-1" 
                onChange={onChange}
                value={input}
                placeholder={placeholder}
            />
        </div>
    )
}

export default Input