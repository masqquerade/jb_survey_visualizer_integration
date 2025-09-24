import React from "react"
import { PieChart, ResponsiveContainer, Cell, Pie, YAxis, Legend, XAxis, Tooltip } from "recharts"

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const RADIAN = Math.PI / 180;

const DifficultyChart = ({ data }) => {
    const COLORS = { 'Easy': '#22C55E', 'Medium': '#F59E0B', 'Hard': '#EF4444' };

    return (
        <div className="w-full h-72">
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                         label={renderCustomizedLabel}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>

                    <Tooltip contentStyle={{ backgroundColor: '#E5E7EB', border: '1px solid #4B5563', color: '#E5E7EB' }} />
                    <Legend 
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ color: '#E5E7EB', paddingTop: "1.5vh"}}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DifficultyChart