import { isAxiosError } from "axios";
import { CustomError } from "./CustomError";

export function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    return error.response?.data.message || error.response?.data;
  } else if (error instanceof Error || error instanceof CustomError) {
    return error.message as string;
  } else if (
    error !== null &&
    typeof error === "object" &&
    "message" in error
  ) {
    return error.message as string;
  } else if (typeof error === "string") {
    return error as string;
  } else {
    return "An unknown error occurred";
  }
}

export function getErrorStatus(error: unknown): Number {
  if (isAxiosError(error)) {
    return error.response?.status || 0;
  } else return 0;
}

export function getErrorName(error: unknown) {
  if (error instanceof Error || error instanceof CustomError) {
    return error.name as string;
  } else if (error !== null && typeof error === "object" && "name" in error) {
    return error.name as string;
  } else if (typeof error === "string") {
    return error as string;
  } else {
    return "Unknown error name";
  }
}

export function getErrorData(error: unknown) {
  const errorName = getErrorName(error);
  const errorMessage = getErrorMessage(error);
  const errorStatus = getErrorStatus(error);
  return { errorName, errorMessage, errorStatus };
}
