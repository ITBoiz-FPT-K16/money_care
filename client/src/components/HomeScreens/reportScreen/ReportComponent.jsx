import Navbar from "../Navbar";
import { BarChart, DoughnutChart } from "./ChartComponent";
import { useState, useEffect } from "react";
import DAYS_IN_MONTH, { backgroundColorChart } from "../../../utils/string";
import { Box } from "@mui/material";
import { currencyFormat } from "../../../utils/index";
import Modal from "@mui/material/Modal";
import { timeRangeOptions } from "../timeRangeOptions";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionDetail } from "../../../services/reportService";
import * as reportAction from "../../../redux/reportSlice";
import { toast } from "react-toastify";

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

  const [incomeData, setIncomeData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [dateData, setDateData] = useState({});

  const [isShowModal, setIsShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalCategory, setModalCategory] = useState();
  const [modalTotal, setModalTotal] = useState();
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const token = useSelector((state) => state.auth.auth.user.accessToken);
  const data = useSelector((state) => state.reportTransaction.reportInfo);
  const timeThisMonth = moment(timeRange.startDate).format("YYYY/MM");

  const fetchData = async () => {
    dispatch(reportAction.getReportStart());
    const res = await getTransactionDetail("2023/07", token);
    if (res.errCode == 0) {
      console.log("res.data", res.data);

      dispatch(reportAction.getReportSuccess(res.data));
      const data = res.data;
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
    } else {
      dispatch(reportAction.getReportFail(res.message));
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const incomeData = {
      labels: categoryIncome?.map((object) => object.name),
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
        },
      ],
    };

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
    setIncomeData(incomeData);
    setExpenseData(expenseData);
    setDateData(dateData);
  }, [categoryIncome, categoryExpense]);

  console.log("incomeData", incomeData);
  console.log("expenseData", expenseData);

  //Data show in Pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const openModalTotal = () => {
    console.log("open modal");
    setIsShowModal(!isShowModal);
    setModalData(incomeData);
    setModalCategory(categoryIncome);
  };
  const openModalIncome = () => {
    console.log("open modal");
    setIsShowModal(!isShowModal);
    setModalData(incomeData);
    setModalCategory(categoryIncome);
    setModalTotal(totalIncome);
    setIsIncomeModal(true);
  };
  const openModalExpense = () => {
    console.log("open modal");
    setIsShowModal(!isShowModal);
    setModalData(expenseData);
    setModalTotal(totalExpense);
    setModalCategory(categoryExpense);
    setIsIncomeModal(false);
  };
  const closeModal = () => {
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
                  {Object.keys(dateData).length > 0 && (
                    <div onClick={openModalTotal}>
                      <BarChart data={dateData} />
                    </div>
                  )}
                </div>
                <div className="flex border-t-2">
                  <div
                    onClick={openModalIncome}
                    className="w-1/2 hover:bg-lime-50 border-x"
                  >
                    <p className="text-center">Income</p>
                    <p className="text-center font-bold text-blue-400">
                      {totalIncome}
                    </p>
                    <div className="flex justify-center items-center">
                      {Object.keys(incomeData).length > 0 && (
                        <DoughnutChart data={incomeData} options={options} />
                      )}
                    </div>
                  </div>
                  <div
                    onClick={openModalExpense}
                    className="w-1/2 hover:bg-lime-50"
                  >
                    <p className="text-center">Expense</p>
                    <p className="text-center font-bold text-red-400">
                      {totalExpense}
                    </p>

                    {Object.keys(expenseData).length > 0 && (
                      <div>
                        <DoughnutChart data={expenseData} options={options} />
                      </div>
                    )}

                    {Object.keys(expenseData).length == 0 && (
                      <div>
                        <h2>
                          {" "}
                          nếu không có dữ liệu thì nó display dòng này rồi Chắc
                          hư bên chart
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
              </Box>

              <Modal
                open={isShowModal}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div className="flex items-center justify-center pb-2">
                    <h4
                      className={
                        isIncomeModal
                          ? "text-blue-400 text-center text-2xl font-bold pt-2"
                          : "text-red-400 text-center text-2xl font-bold pt-2"
                      }
                    >
                      {isIncomeModal ? "Income" : "Expense"}
                    </h4>
                    <div className="w-1/2">
                      <div>
                        {Object.keys(modalData).length > 0 && (
                          <DoughnutChart data={modalData} options={options} />
                        )}
                      </div>
                    </div>
                    <div className="w-1/2">
                      <p className="text-center font-bold text-black-400">
                        {modalTotal}
                      </p>
                    </div>
                  </div>
                  <div>
                    <>
                      <>
                        {modalCategory?.map((object, index) => {
                          return (
                            <div key={index} className="flex justify-between">
                              <div className="flex items-center">
                                <div className="w-14 h-14">
                                  <img src={object.image} alt={object.name} />
                                </div>
                                <div className="mx-2">
                                  <div>
                                    <p>{object.name}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <p
                                  className={
                                    isIncomeModal
                                      ? "text-blue-400"
                                      : "text-red-400"
                                  }
                                >
                                  {currencyFormat(object.value)}
                                </p>
                              </div>
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
    </>
  );
};

export default ReportComponent;
