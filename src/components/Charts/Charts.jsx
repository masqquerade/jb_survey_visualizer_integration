import React from "react"

import chartsIcon from "../../assets/charts.svg"
import CategoryChart from "./CategoryChart/CategoryChart"
import Header from "../Header/Header"
import DifficultyChart from "./DifficultyChart/DifficultyChart"
import { useDifficultyDistribution, useQuestionsDistribution } from "../../hooks/useDistributions"
import ChartCard from "../ChartCard/ChartCard"

const Charts = ({ questions, selectedCategory, isLoading }) => {
    const categoryDistribution = useQuestionsDistribution(questions, selectedCategory)
    const difficultyDistribution = useDifficultyDistribution(questions)

    return (
        <div className="flex flex-col flex-1">
            <div>
                <div className="mb-8">
                    <Header
                        iconPath={chartsIcon}
                        title={"Charts"}
                    />
                </div>

                {
                    isLoading ? <div className="flex items-center justify-center w-full h-96 text-white font-bold">Loading...</div> : 
                    
                    <div>
                        <h1 className="text-white font-bold mb-5">{selectedCategory.name}</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {
                                selectedCategory.id === -1 &&
                                    <ChartCard title={"Questions Distribution"}>
                                        <CategoryChart data = {categoryDistribution}/>
                                    </ChartCard>
                            }
                            
                            <ChartCard title={"Difficulty Distribution"}>
                                <DifficultyChart
                                    data = {difficultyDistribution}
                                />
                            </ChartCard>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Charts