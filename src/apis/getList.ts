import axios from "axios";

export default {
    getList(){
        return axios.get("/getList").then((res) => {
            return res.data.data.list
        })
    }
}