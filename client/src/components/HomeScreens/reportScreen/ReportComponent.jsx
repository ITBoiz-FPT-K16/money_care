import Navbar from "../Navbar";
import { BarChart, DoughnutChart } from "./ChartComponent";
import { useState, useEffect } from "react";
import axios from "axios";
import DAYS_IN_MONTH, { backgroundColorChart } from "../../../utils/string";
import { Box } from "@mui/material";
import { currencyFormat } from "../../../utils/index";
import Modal from "@mui/material/Modal";
import { timeRangeOptions } from "../timeRangeOptions";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import * as reportAction from "../../../redux/reportSlice";

const ReportComponent = () => {
  const dispatch = useDispatch();

  const [dateIncome, setDateIncome] = useState([]);
  const [dateExpense, setDateExpense] = useState([]);

  const [categoryIncome, setCategoryIncome] = useState();
  const [categoryExpense, setCategoryExpense] = useState([]);

  const [totalIncome, setTotalIncome] = useState();
  const [totalExpense, setTotalExpense] = useState();

  const [result, setResult] = useState();
  const [timeRange, setTimeRange] = useState(timeRangeOptions[0]);

  const [isShowModal, setIsShowModal] = useState(false);
  const token = useSelector((state) => state.auth.auth.user.accessToken);
  const data = useSelector((state) => state.reportTransaction.reportInfo);
  const API_URL = import.meta.env.VITE_API_URL;

  const timeThisMonth = moment(timeRange.startDate).format("YYYY/MM");
  useEffect(() => {
    axios
      .get(`${API_URL}/transactions/${timeRange.monthYear}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(reportAction.getReportStart());

        dispatch(reportAction.getReportSuccess(res.data));

        const dateIncomeArr = data.dateInMonth.map((date) => date.totalIncomes);
        const dateExpenseArr = data.dateInMonth.map(
          (date) => -Math.abs(date.totalExpenses)
        );
        const incomeCategoryArr = data.incomeList.map((object) => {
          return {
            name: object.name,
            value: object.total,
            image: object.image,
          };
        });
        const expenseCategoryArr = data.expenseList.map((object) => {
          return {
            name: object.name,
            value: object.total,
            image: object.image,
          };
        });
        setCategoryIncome(incomeCategoryArr);
        setCategoryExpense(expenseCategoryArr);
        setTotalExpense(currencyFormat(data.totalExpenses));
        setTotalIncome(currencyFormat(data.totalIncomes));
        setDateIncome(dateIncomeArr);
        setDateExpense(dateExpenseArr);
        setResult(currencyFormat(data.totalIncomes - data.totalExpenses));
      })
      .catch((err) => {
        dispatch(reportAction.getReportFail(err));
        console.log(err);
      });
  }, [timeRange.monthYear]);
  console.log(data);
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
    setIsShowModal(!isShowModal);
  };

  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      {data.dateInMonth.length > 0 && (
        <div className="pl-20 h-100%">
          <>
            <Navbar />
            <div
              className="flex justify-center items-center"
              style={{ height: "100vh" }}
            >
              <div
                className="bg-white-secondary rounded-xl shadow-xl box-border overflow-auto relative"
                style={{ width: "600px", height: "600px" }}
              >
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
                  <div className="hover:bg-lime-50 pb-2">
                    <div>
                      <h1 className="text-center text-2xl font-bold pt-2">
                        Net Income
                      </h1>
                      <div className="flex justify-center items-center">
                        <p>{result}</p>
                      </div>
                    </div>
                    <div onClick={openModal}>
                      <BarChart data={dateData} />
                    </div>
                  </div>
                  <div className="flex border-t-2">
                    <div
                      onClick={openModal}
                      className="w-1/2 hover:bg-lime-50 border-x"
                    >
                      <p className="text-center">Income</p>
                      <p className="text-center font-bold text-blue-400">
                        {totalIncome}
                      </p>
                      <div>
                        <DoughnutChart data={incomeData} options={options} />
                      </div>
                    </div>
                    <div onClick={openModal} className="w-1/2 hover:bg-lime-50">
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

                <Modal
                  open={isShowModal}
                  onClose={openModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <div className="flex items-center justify-center pb-2">
                      <h4 className="text-center text-2xl font-bold pt-2">
                        Expense
                      </h4>
                      <div className="w-1/2">
                        <div>
                          <DoughnutChart data={expenseData} options={options} />
                        </div>
                      </div>
                      <div className="w-1/2">
                        <p className="text-center font-bold text-red-400">
                          {totalExpense}
                        </p>
                      </div>
                    </div>
                    <div>
                      <>
                        {/* <DetailComponent array={categoryExpense} /> */}
                        <>
                          {categoryExpense?.map((object, index) => {
                            return (
                              <div key={index} className="flex justify-between">
                                <div className="w-14 h-14">
                                  <img src={object.image} alt={object.name} />
                                </div>
                                <p>{object.name}</p>

                                <p className="text-red-400">{object.value}</p>
                              </div>
                            );
                          })}
                        </>
                      </>
                    </div>
                  </Box>
                </Modal>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default ReportComponent;
