import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Logout } from "@mui/icons-material";

import auth from "../../services/auth";
import { logout } from "../../redux/authSlice";

export default function SwipeableTemporaryDrawerIcon() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const currentUser = useSelector((state) => state.auth.auth.user);

    const handleLogout = () => {
        auth.signOut();
        dispatch(logout());
        navigate("/auth");
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <div className="flex flex-col items-center my-10">
                <div className="w-16 h-16">
                    <img
                        src={currentUser.userImg}
                        alt="user image"
                        className="rounded-full"
                    />
                </div>
                <div className="mt-2">
                    <strong>{currentUser.name}</strong>
                </div>
                <div className="text-sm">{currentUser.email}</div>
            </div>
            <Divider />
            <div
                className="py-3 px-2 hover:bg-slate-300 cursor-pointer"
                onClick={() => handleLogout()}
            >
                <Logout />
                <span>Logout</span>
            </div>
            <Divider />
        </Box>
    );

    return (
        <div>
            <React.Fragment>
                {/* <Button onClick={toggleDrawer("left", true)}>{"Left"}</Button> */}
                <IconButton onClick={toggleDrawer("left", true)}>
                    <MenuIcon />
                </IconButton>

                <SwipeableDrawer
                    anchor={"left"}
                    open={state["left"]}
                    onClose={toggleDrawer("left", false)}
                    onOpen={toggleDrawer("left", true)}
                >
                    {list("left")}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
