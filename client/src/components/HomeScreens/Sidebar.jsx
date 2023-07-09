// IMPORT ICONS
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaidIcon from "@mui/icons-material/Paid";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import SwipeableTemporaryDrawerIcon from "./Drawer";
import { NavLink } from "react-router-dom";
import { Help } from "@mui/icons-material";
import { Divider } from "@mui/material";
const Sidebar = () => {
    return (
        <div className="w-20 fixed top-0 left-0 bottom-0 bg-white-primary box-border">
            <nav className="flex flex-col justify-center items-center mb-5 text-white-secondary">
                <div
                    className={
                        "flex flex-col w-full justify-center items-center px-2 py-4  mb-2 text-black hover:bg-gray-200"
                    }
                >
                    <SwipeableTemporaryDrawerIcon />
                </div>

                <NavLink
                    to="/home/transactions"
                    className={
                        "flex flex-col w-full justify-center items-center px-2 py-2 my-2 hover:bg-gray-200 "
                    }
                >
                    <AccountBalanceWalletIcon />
                    <div className="text-xs">
                        <strong>Transaction</strong>
                    </div>
                </NavLink>

                <NavLink
                    to="/home/report"
                    className={
                        " flex flex-col w-full justify-center items-center px-2 py-2 my-2 hover:bg-gray-200"
                    }
                >
                    <AssessmentIcon />
                    <div className="text-xs">
                        <strong>Report</strong>
                    </div>
                </NavLink>

                <NavLink
                    to="/home/export"
                    className={
                        "flex flex-col w-full justify-center items-center px-2 py-2 my-2  border-b-1 border-gray-300  hover:bg-gray-200"
                    }
                >
                    <PaidIcon />
                    <div className="text-xs">
                        <strong>Budget</strong>
                    </div>
                </NavLink>

                <NavLink
                    to="/home/store"
                    className={
                        "flex flex-col w-full justify-center items-center px-2 py-2 my-2  hover:bg-gray-200"
                    }
                >
                    <LocalGroceryStoreIcon />
                    <div className="text-xs">
                        <strong>Store</strong>
                    </div>
                </NavLink>

                <NavLink
                    to="home/help"
                    className={
                        "flex flex-col w-full justify-center items-center px-2 py-2 my-2  hover:bg-gray-200"
                    }
                >
                    <Help />
                    <div className="text-xs">
                        <strong>Help</strong>
                    </div>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
