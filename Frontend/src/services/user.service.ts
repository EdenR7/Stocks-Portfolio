import { getErrorData } from "@/utils/errors/ErrorsFunctions";
import api from "./api";
import { CustomError } from "@/utils/errors/CustomError";
import { UserI } from "@/types/user.types";

async function getUser(): Promise<UserI> {
  try {
    const { data: user } = await api.get<UserI>("/users");
    return user;
  } catch (error) {
    console.log(error);
    const { errorName, errorMessage } = getErrorData(error);
    throw new CustomError(errorName, errorMessage);
  }
}

export const userService = {
  getUser,
};
