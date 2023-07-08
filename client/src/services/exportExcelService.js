import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const exportExcel = async (time, token) => {
    try {
        let res = await axios.get(`${API_URL}/export/${time}`, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("res>>>   ", res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `Project_${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error("error export excel>>>", err.response.data);
    }
};
