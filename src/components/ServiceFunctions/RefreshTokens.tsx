import axios from "axios";
import { GetBackendUrl } from "./GetBackendUrl";
import { Cookie } from "universal-cookie";

export function RefreshTokens(cookies: Cookie){
    axios
        .post(GetBackendUrl()+"/api/v1/auth/refresh-token",{},{headers:{
            "Authorization": cookies.get("refresh_token")
        }})
        .then((response) => {
            let data = response.data;
            if (data.status != 200) {
                console.log(data);
                window.location.href = "/auth";
                return false
            }
            cookies.set("access_token", data.body.access_token);
            cookies.set("refresh_token", data.body.refresh_token);
            return true
        })
        .catch((error) => {
            console.log(error);
            return false
        });
}