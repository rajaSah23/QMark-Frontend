import axios from 'axios'
import { notifications } from '@mantine/notifications';


const client = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_BASE_URL
    }, 
    // {
    // withCredentials: true,
    // }
)

export default client;

export const reCapchaMatching = async (value:any) => {
    try {
        const response = await client.post("/verify-recapcha", value)
        return response.data;
    } catch (error) {
        return error
    }
}




export const toast = {
    success:(title:String,message="")=>{
        notifications.show({
            title: title,
            message: message,
          })
    },
    error:(title:String,message="")=>{
        notifications.show({
            position: 'top-right',
            color:"red",
            title: title,
            message: message,
          })
    },
}