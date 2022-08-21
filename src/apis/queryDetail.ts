import axios from "axios";

export default {
    queryDetail(clientId:string){
        return axios.get("/queryDetail?ClientId=" + clientId).then((res) => {
            return res.data.data
        })
    }
}