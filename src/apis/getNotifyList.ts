import axios from "axios";

export default {
    getNotifyList(){
        return axios.get("/getNotifyList").then((res) => {
            return res.data.data.NotifyList
        })
    }
}