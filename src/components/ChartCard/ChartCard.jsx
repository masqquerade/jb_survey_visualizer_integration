const ChartCard = ({ title, children }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full h-full">
            <h3 className="text-2xl font-semibold text-white mb-6">{ title }</h3>
            <div className="w-full h-72">{ children }</div>
        </div>
    )
}

export default ChartCard