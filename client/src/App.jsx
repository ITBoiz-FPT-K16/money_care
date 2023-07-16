import { useState } from "react";
// IMPORT STYLES
import "./App.css";

// IMPORT LIBRARIES
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "chart.js/auto";

// IMPORT COMPONENTS
import HomeComponent from "./components/HomeScreens/HomeComponent.jsx";
import LoginComponent from "./components/loginScreen/LoginComponent";
import RedirectPage from "./components/RedirectPage";
import TransactionComponent from "./components/HomeScreens/transactionsScreen/TransactionComponent";
import ReportComponent from "./components/HomeScreens/reportScreen/ReportComponent";
import ExportExcelComponent from "./components/HomeScreens/exportScreen/ExportExcelComponent";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RedirectPage />} />
        <Route path="/home" element={<HomeComponent />}>
          <Route path="transactions" element={<TransactionComponent />} />

          {/* Define 1 route report o day */}
          <Route path="report" element={<ReportComponent />} />
          <Route path="export" element={<ExportExcelComponent />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/auth" element={<LoginComponent />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
