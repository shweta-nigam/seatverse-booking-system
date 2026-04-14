import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"

const register = async (req,res) => {
    const user =  await authService.register(req.body)
    ApiResponse.created(res, "Registration success", user)
}

const login = async (req,res) => {
    const data = await authService.login(req.body)
    ApiResponse.success(res, "Login successful", data)
};

export {register, login} 