import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const exportExcel = async (time, token) => {
    console.log("time>>>   ", time);

    try {
        let timeExport;
        if (time == "") {
            timeExport = "all";
        } else {
            timeExport = time;
        }

        let res = await axios.get(`${API_URL}/export/${time}`, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("res>>>   ", res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `export_${timeExport}.xlsx`);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error("error export excel>>>", err.response.data);
    }
};
