import axios from "axios";

export default {
    getCountryList(){
        return axios.get("/getCountryList").then((res) => {
            return res.data.data.CountryList
        })
    }
}