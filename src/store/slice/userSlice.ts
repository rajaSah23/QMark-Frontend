import { createSlice } from "@reduxjs/toolkit"
import { loginUser, registerUser, verifyOTP } from "../action/user-action"
import { toast } from "../../../utils/APIClient"



export interface InitialState {
    userData: any,

    error: any,
    loading: boolean
}


const initialState: InitialState = {
    userData: null,
    error: null,
    loading: false
}
export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData :(state, action)=>{
            state.userData = action.payload;
        }
    },
    extraReducers: (builder) => {

        builder.addCase(registerUser.pending, (state, action) => {
            sessionStorage.removeItem("registration");

        }).addCase(registerUser.fulfilled, (state, action) => {
            sessionStorage.setItem("registration", JSON.stringify(action.payload));
            toast.success( "User registered")

        }).addCase(registerUser.rejected, (state, action: any) => {
            sessionStorage.removeItem("registration");
            toast.error(action.payload?.message || "Failed to register")


        })
       
        builder.addCase(verifyOTP.pending, (state, action) => {
            state.loading=true

        }).addCase(verifyOTP.fulfilled, (state, action) => {
            state.userData = action.payload;
            state.loading = false
            localStorage.setItem("userData", JSON.stringify(action.payload));
            toast.success( action.payload?.message||"OTP verified")
            sessionStorage.removeItem("registration");
            
        }).addCase(verifyOTP.rejected, (state, action: any) => {
            toast.error(action.payload?.message || "OTP verification failed")
            state.loading = false
        })
        
        builder.addCase(loginUser.pending, (state, action) => {
            state.loading=true

        }).addCase(loginUser.fulfilled, (state, action) => {
            console.log("loginUser.fulfilled", action.payload);
            state.userData = action.payload;
            // state.data = action.payload;
            state.loading = false
            localStorage.setItem("userData", JSON.stringify(action.payload));
            toast.success( action.payload?.message||"Logged in")
            // sessionStorage.removeItem("registration");
        }).addCase(loginUser.rejected, (state, action: any) => {
            toast.error(action.payload?.message || "Failed to login")
            state.loading = false
        })
    }

})

export const { setUserData } = UserSlice.actions; 

export default UserSlice.reducer;



