const excel = require("exceljs");
var express = require('express');
var exportRouter = express.Router();
const bodyParser = require('body-parser');
const Incomes = require('../models/incomes');
const Expenses = require('../models/expenses');
const authenticate = require('../authenticate');

exportRouter.use(bodyParser.json());

async function getData(id, year, month) {
    // edit query to get data by year and month
    let query = { user: id };
    if (year) {
        year = parseInt(year);
        if (month) {
            month = parseInt(month);
            query.date = { $gte: new Date(year, month - 1), $lte: new Date(year, month) };
        }
        else {
            query.date = { $gte: new Date(year, 0), $lte: new Date(year, 11, 31) };
        }
    }

    let incomes = await Incomes.find(query).populate('category').sort({ date: -1 }).exec();
    let expenses = await Expenses.find(query).populate('category').sort({ date: -1 }).exec();
    // split incomes and expenses by month year, incomes and expenses in the same month year will be in the same element of array 
    let divideByMonthYear = {};
    incomes.forEach(income => {
        // get month year of income with format MM/YYYY
        let monthYear = income.date.getMonth() + 1 + '-' + income.date.getFullYear();
        if (income.date.getMonth() + 1 < 10) {
            monthYear = '0' + monthYear;
        }
        if (divideByMonthYear[monthYear]) {
            divideByMonthYear[monthYear].push(income);
        } else {
            divideByMonthYear[monthYear] = [income];
        }
        if (divideByMonthYear[monthYear].total) {
            divideByMonthYear[monthYear].total += income.amount;
        }
        else {
            divideByMonthYear[monthYear].total = income.amount;
        }
    })
    expenses.forEach(expense => {
        let monthYear = expense.date.getMonth() + 1 + '-' + expense.date.getFullYear();
        if (expense.date.getMonth() + 1 < 10) {
            monthYear = '0' + monthYear;
        }
        expense.amount = -expense.amount;
        if (divideByMonthYear[monthYear]) {
            divideByMonthYear[monthYear].push(expense);
        } else {
            divideByMonthYear[monthYear] = [expense];
        }
        if (divideByMonthYear[monthYear].total) {
            divideByMonthYear[monthYear].total += expense.amount;
        }
        else {
            divideByMonthYear[monthYear].total = expense.amount;
        }
    })
    // sort incomes and expenses by date month year in each element of divideByMonthYear
    for (let key in divideByMonthYear) {
        divideByMonthYear[key].sort((a, b) => {
            return a.date - b.date;
        })
    };
    // sort divideByMonthYear by month year
    let sortedDivideByMonthYear = Object.keys(divideByMonthYear).sort((a, b) => {
        let aMonthYear = a.split('-');
        let bMonthYear = b.split('-');
        return new Date(aMonthYear[1], aMonthYear[0]) - new Date(bMonthYear[1], bMonthYear[0]);
    });


    // create workbook
    let workbook = new excel.Workbook();
    // each month for each sheet
    sortedDivideByMonthYear.forEach(monthYear => {
        let worksheet = workbook.addWorksheet(monthYear);
        worksheet.columns = [
            { header: "Date", key: "date", width: 30 },
            { header: "Category", key: "category", width: 30 },
            { header: "Description", key: "description", width: 40 },
            { header: "Amount", key: "amount", width: 20 },
        ];
        divideByMonthYear[monthYear].forEach(item => {
            worksheet.addRow({ date: item.date, category: item.category.name, description: item.description, amount: item.amount });
        })
        let totalRow = worksheet.addRow({ date: '', category: '', description: 'Total', amount: divideByMonthYear[monthYear].total });
        if (divideByMonthYear[monthYear].total < 0) {
            totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
        }
        else {
            totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00FF00' } };
        }
    })
    if (sortedDivideByMonthYear.length == 0) {
        let worksheet = workbook.addWorksheet('No data');
        worksheet.columns = [
            { header: "No data", key: "date", width: 30 },
        ];
    }
    return workbook;
}

exportRouter.route('/')
    .get(authenticate.verifyUser, async (req, res, next) => {
        let id = req.user.uid;
        let workbook = await getData(id);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "data.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    });

exportRouter.route('/:year/')
    .get(authenticate.verifyUser, async (req, res, next) => {
        let id = req.user.uid;
        let year = req.params.year;
        let workbook = await getData(id, year);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "data.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    });

exportRouter.route('/:year/:month')
    .get(authenticate.verifyUser, async (req, res, next) => {
        let id = req.user.uid;
        let year = req.params.year;
        let month = req.params.month;
        let workbook = await getData(id, year, month);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "data.xlsx"
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    });

module.exports = exportRouter;
