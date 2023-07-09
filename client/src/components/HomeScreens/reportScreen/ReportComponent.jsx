import React from "react";
import Navbar from "../Navbar";
import BarChart from "./BarChartComponent";
import { useState } from "react";
import { timeRangeOptions } from "../timeRangeOptions";
import axios from "axios";
import DAYS_IN_MONTH from "../../../utils/string";

const ReportComponent = () => {
    const [rangeTime, setRangeTime] = useState(timeRangeOptions[0]);
    
    var data = 0;
    var totalIncome = [];
    var totalExpense = [];

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGE0ZTY4ZmUxZWFkOTNkOGMxNjFiYWUiLCJpYXQiOjE2ODg1NjgxOTAsImV4cCI6MTY4ODU3MTc5MH0.hWa0x0rqJIB5Js_MCvrGy16h8pykK0iXGlrde1PCSB8'

    axios.get("http://localhost:5001/transactions/2023/06/detail", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    ).then((res) => {
        data = res.data;
        console.log(data.dateInMonth);
        data.dateInMonth.forEach((value, index, arr)=> {
            var date = data.dateInMonth[index];
            totalIncome.push(date.totalExpenses);
        })
        console.log(totalIncome);
    })
    const sampleData = {
        labels: DAYS_IN_MONTH,
        datasets: [
            {
                label: 'Money Spent',
                data: totalIncome,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)'
                ],
                borderWidth: 1,
                barThickness: 20,
            }
        ]
    }
    return (
        <div className="pl-20 h-100%">
            <>
                <Navbar />
                <div className="place-content-center">
                    <p>Money Spent</p>
                    <BarChart data={sampleData} />
                </div>
            </>
        </div>
    );
};

export default ReportComponent;
