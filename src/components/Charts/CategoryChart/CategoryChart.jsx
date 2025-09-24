import React from "react"
import { BarChart, ResponsiveContainer, Bar, CartesianGrid, YAxis, Legend, XAxis, Tooltip } from "recharts"

const CategoryChart = ({ data }) => {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', color: '#E5E7EB' }} cursor={{ fill: 'rgba(75, 85, 99, 0.3)' }} />
                    <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                    <Bar dataKey="count" fill="#3B82F6" name="Question Count" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CategoryChart