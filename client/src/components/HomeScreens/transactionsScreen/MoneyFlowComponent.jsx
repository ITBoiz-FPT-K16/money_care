import React from "react";

const MoneyFlowComponent = () => {
    return (
        <div className="mb-5 bg-white-primary p-3">
            <div className="flex justify-between items-center">
                <span>Inflow</span>
                <strong className="text-blue-400">70,000</strong>
            </div>
            <div className="flex justify-between items-center">
                <span>Outflow</span>
                <strong className="text-red-600">- 10,000</strong>
            </div>
            <div className="flex justify-end items-center ">
                <strong className="border-t-1 border-gray-400 pl-5">
                    60,000
                </strong>
            </div>
        </div>
    );
};

export default MoneyFlowComponent;
