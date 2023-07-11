import React from "react";
import excelIcon from "../../../assets/images/excel-icon.png";
import { TextField, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { exportExcel } from "../../../services/exportExcelService";
import { toast } from "react-toastify";
const ExportExcelComponent = () => {
    const token = useSelector((state) => state.auth.auth.user.accessToken);
    const [month, setMonth] = React.useState("");
    const [year, setYear] = React.useState("");
    const handleOnchangeMonth = (e) => {
        setMonth(e.target.value);
    };

    const handleOnchangeYear = (e) => {
        setYear(e.target.value);
    };

    const handleExportByMonth = async () => {
        try {
            const res = await exportExcel(month, token);
            console.log("export all");
            setMonth("");
        } catch (error) {
            toast.error(err.message);
        }
    };

    const handleExportByYear = async () => {
        try {
            const res = await exportExcel(year, token);
            setYear("");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleExportAll = async () => {
        try {
            const res = await exportExcel("", token);
        } catch (err) {
            toast.error(err.message);
        }
    };
    return (
        <div className="h-100vh pl-20">
            <Navbar />
            <div className="h-100 bg-white-secondary">
                <div className=" p-10 grid grid-cols-1 md:grid-cols-3  gap-8">
                    <div className="bg-white-primary col-span-1 flex flex-col items-center justify-center rounded-md box-border shadow-lg">
                        <div className="flex justify-center items-center p-5">
                            <img
                                src={excelIcon}
                                alt=""
                                width={"80px"}
                                height={"80px"}
                            />
                            <h3>Export by month</h3>
                        </div>

                        <div>
                            <TextField
                                variant="outlined"
                                size="small"
                                label={"Input month"}
                                placeholder="YYYY/MM"
                                value={month}
                                onChange={handleOnchangeMonth}
                            />
                        </div>
                        <div className="p-5">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleExportByMonth}
                                disabled={
                                    month.length !== 7 ||
                                    isNaN(month.slice(0, 4)) ||
                                    isNaN(month.slice(5, 7))
                                }
                            >
                                <FileDownloadIcon />
                                Export
                            </Button>
                        </div>

                        <div></div>
                    </div>
                    <div className="bg-white-primary col-span-1 flex flex-col items-center justify-center rounded-md box-border shadow-lg">
                        <div className="flex justify-center items-center p-5">
                            <img
                                src={excelIcon}
                                alt=""
                                width={"80px"}
                                height={"80px"}
                            />
                            <h3>Export by year</h3>
                        </div>

                        <div>
                            <TextField
                                variant="outlined"
                                size="small"
                                label={"Input year"}
                                placeholder="YYYY"
                                value={year}
                                onChange={handleOnchangeYear}
                            />
                        </div>
                        <div className="p-5">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleExportByYear}
                                disabled={year.length !== 4 || isNaN(year)}
                            >
                                <FileDownloadIcon />
                                Export
                            </Button>
                        </div>

                        <div></div>
                    </div>
                    <div className="bg-white-primary col-span-1 flex flex-col items-center justify-center rounded-md box-border shadow-lg">
                        <div className="flex justify-center items-center p-5">
                            <img
                                src={excelIcon}
                                alt=""
                                width={"80px"}
                                height={"80px"}
                            />
                            <h3>Export all</h3>
                        </div>

                        <div></div>
                        <div className="p-5">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleExportAll}
                            >
                                <FileDownloadIcon />
                                Export
                            </Button>
                        </div>

                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportExcelComponent;
