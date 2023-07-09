import { Bar, Pie, Doughnut } from "react-chartjs-2";

const BarChart = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};
const PieChart = ({ data, options }) => {
  return <Pie data={data} options={options} />;
};
const DoughnutChart = ({ data, options }) => {
  return <Doughnut data={data} options={options} />;
};
export { BarChart, PieChart, DoughnutChart };
