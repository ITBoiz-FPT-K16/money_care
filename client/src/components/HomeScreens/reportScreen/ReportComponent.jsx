import Navbar from "../Navbar";
import { BarChart, DoughnutChart } from "./ChartComponent";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import DAYS_IN_MONTH, { backgroundColorChart } from "../../../utils/string";
import moment from "moment";
import { Box } from "@mui/material";
import { currencyFormat } from "../../../utils/index";
const ReportComponent = () => {
  const [dateIncome, setDateIncome] = useState([]);
  const [dateExpense, setDateExpense] = useState([]);

  const [categoryIncome, setCategoryIncome] = useState();
  const [categoryExpense, setCategoryExpense] = useState([]);

  const [totalIncome, setTotalIncome] = useState();
  const [totalExpense, setTotalExpense] = useState();

  const [result, setResult] = useState();

  const token = useSelector((state) => state.auth.auth.user.accessToken);
  const API_URL = import.meta.env.VITE_API_URL;

  const timeThisMonth = moment(new Date()).format("YYYY/MM");

  useEffect(() => {
    axios
      .get(`${API_URL}/transactions/${timeThisMonth}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        const dateIncomeArr = data.dateInMonth.map((date) => date.totalIncomes);
        const dateExpenseArr = data.dateInMonth.map(
          (date) => -Math.abs(date.totalExpenses)
        );
        const incomeCategoryArr = data.incomeList.map((object) => {
          return {
            name: object.name,
            value: object.total,
          };
        });
        console.log(incomeCategoryArr);
        const expenseCategoryArr = data.expenseList.map((object) => {
          return {
            name: object.name,
            value: object.total,
          };
        });
        setCategoryIncome(incomeCategoryArr);
        setCategoryExpense(expenseCategoryArr);
        setTotalExpense(currencyFormat(data.totalExpenses));
        setTotalIncome(currencyFormat(data.totalIncomes));
        setDateIncome(dateIncomeArr);
        setDateExpense(dateExpenseArr);
        setResult(currencyFormat(data.totalIncomes - data.totalExpenses));

        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  //Data show in months
  const dateData = {
    labels: DAYS_IN_MONTH,
    datasets: [
      {
        label: "Income",
        data: dateIncome,
        backgroundColor: ["rgb(96 165 250)"],
        stack: "Stack 0",
      },
      {
        label: "Expense",
        data: dateExpense,
        backgroundColor: ["rgb(239 68 68)"],
        stack: "Stack 0",
      },
    ],
  };

  //Data show in Pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const incomeData = {
    labels: categoryExpense?.map((object) => object.name),
    datasets: [
      {
        label: "Income",
        data: categoryIncome?.map((object) => object.value),
        backgroundColor: backgroundColorChart,
      },
    ],
  };

  const expenseData = {
    labels: categoryExpense?.map((object) => object.name),
    datasets: [
      {
        label: "Expense",
        data: categoryExpense?.map((object) => object.value),
        backgroundColor: backgroundColorChart,
        hoverOffset: 4,
      },
    ],
  };
  const openModal = () => {
    console.log("open modal");
  };

  return (
    <div className="pl-20 h-100%">
      <>
        <Navbar />
        <div
          className="flex justify-center items-center"
          style={{ height: "100vh" }}
        >
          <div
            className="bg-white-secondary rounded-xl shadow-xl box-border overflow-auto relative"
            style={{ width: "500px", height: "550px" }}
          >
            <Box>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  position: "sticky",
                  top: "2px",
                }}
              >
                <div>
                  <div>
                    <h1 className="text-center text-2xl font-bold">
                      Net Income
                    </h1>
                    <div className="flex justify-center items-center">
                      <p>{result}</p>
                    </div>
                  </div>
                  <div style={{ width: "90%", height: "90%" }}>
                    <BarChart data={dateData} />
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2">
                    <p className="text-center">Income</p>
                    <p className="text-center font-bold text-blue-400">
                      {totalIncome}
                    </p>
                    <div>
                      <DoughnutChart data={incomeData} options={options} />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <p className="text-center">Expense</p>
                    <p className="text-center font-bold text-red-400">
                      {totalExpense}
                    </p>
                    <div>
                      <DoughnutChart data={expenseData} options={options} />
                    </div>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
        </div>
      </>
    </div>
  );
};

export default ReportComponent;
