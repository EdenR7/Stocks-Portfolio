import { LoginUserDataI, RegisterUserDataI } from "@/types/user.types";
import { CustomError } from "@/utils/errors/CustomError";
import { getErrorData } from "@/utils/errors/ErrorsFunctions";
import api from "./api";

async function loginUser(userData: LoginUserDataI): Promise<string> {
  try {
    const { data: token } = await api.post<string>("/auth/login", userData);
    return token;
  } catch (error) {
    console.log("loginUser Error: ", error);
    const { errorName, errorMessage } = getErrorData(error);
    throw new CustomError(errorName, errorMessage);
  }
}

async function registerUser(userData: RegisterUserDataI): Promise<void> {
  try {
    const { data } = await api.post("/auth/register", userData);
    console.log(data);
  } catch (error) {
    console.log("registerUser Error: ", error);
    const { errorName, errorMessage } = getErrorData(error);
    throw new CustomError(errorName, errorMessage);
  }
}

export const authService = {
  loginUser,
  registerUser,
};
