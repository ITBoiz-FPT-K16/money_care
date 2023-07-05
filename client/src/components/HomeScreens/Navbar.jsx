import React, { useState } from "react";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// IMPORT ICONS
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import { Button, IconButton, Tooltip } from "@mui/material";
import moment from "moment/moment";
import { timeRangeOptions } from "./timeRangeOptions";
const Navbar = () => {
    const pathName = window.location.pathname;
    const dateToday = moment(new Date()).format("DD");
    const [rangeTime, setRangeTime] = useState(timeRangeOptions[0]);

    console.log(dateToday);
    return (
        <div className="h-14 bg-white-primary box-border flex justify-between items-center">
            <div className="flex items-center mx-5">
                <div className="h-10 w-10">
                    <img
                        src="https://static.moneylover.me/img/icon/icon.png"
                        alt="wallet img"
                    />
                </div>
                <div className="mx-2 flex flex-col items-center">
                    <div className="text-xs ">
                        <span>Total</span>
                        <ArrowDropDownIcon />
                    </div>
                    <div>
                        <strong className="text-base">-27,000,000</strong>
                    </div>
                </div>
            </div>

            {pathName.includes("/home/transactions") && (
                <div className="flex items-center mx-5 text-gray-500">
                    <Tooltip title="Jump to today">
                        <div className="mx-3 relative cursor-pointer">
                            <CalendarTodayIcon aria-colindextext="n" />
                            <div className="absolute top-1 right-1">
                                <span className="text-xs">{dateToday}</span>
                            </div>
                        </div>
                    </Tooltip>

                    <Tooltip title="View by transaction">
                        <div className="mx-3 relative cursor-pointer">
                            <VisibilityIcon />
                            <div className="absolute top-2 left-2">
                                <EventIcon
                                    fontSize="30"
                                    style={{ backgroundColor: "#fff" }}
                                />
                            </div>
                        </div>
                    </Tooltip>

                    <Tooltip title="Search">
                        <div className="mx-3 cursor-pointer">
                            <SearchIcon />
                        </div>
                    </Tooltip>

                    <Button
                        variant="contained"
                        color="success"
                        className="mx-2"
                    >
                        {" "}
                        Add transaction
                    </Button>
                </div>
            )}

            {pathName.includes("/home/report") && (
                <div className="flex flex-col items-center">
                    <div className="text-xs">
                        <strong>{rangeTime.description}</strong>
                        <ArrowDropDownIcon />
                    </div>
                    <div className="text-xs">
                        <span>
                            {rangeTime.startDate} - {rangeTime.endDate}
                        </span>
                    </div>
                </div>
            )}

            {pathName.includes("/home/report") && (
                <div>
                    <Tooltip title="Search">
                        <div className="mx-10 cursor-pointer">
                            <SearchIcon />
                        </div>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default Navbar;
