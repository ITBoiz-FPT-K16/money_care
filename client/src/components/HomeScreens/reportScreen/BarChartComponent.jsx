import React from "react";
import { Bar } from 'react-chartjs-2';

const BarChart = ({data}) => {
    return <Bar data={data} />;
}

export default BarChart;