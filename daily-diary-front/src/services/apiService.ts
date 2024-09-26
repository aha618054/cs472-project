import { CustomError } from "../utils/customError";
import { StatusCode } from "../models/enums/StatusCodeEnum";
import { ErrorResponse } from "../models/ErrorResponse";

export class APIService {
    getBaseUrl = (): string => {
        return "http://localhost:8080/api";
    };

    generateHeader = (): Headers => {
        const headers: Headers = new Headers();
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");
        return headers;
    };

    getData = (url: string): Promise<Response> => {
        return fetch(url, {
            method: "GET",
            headers: this.generateHeader(),
        });
    };

    postData = (url: string, data: any): Promise<Response> => {
        return fetch(url, {
            method: "POST",
            headers: this.generateHeader(),
            body: JSON.stringify(data),
        });
    };

    putData = (url: string, data: any): Promise<Response> => {
        return fetch(url, {
            method: "PUT",
            headers: this.generateHeader(),
            body: JSON.stringify(data),
        });
    };

    patchData = (url: string, data: any): Promise<Response> => {
        return fetch(url, {
            method: "PATCH",
            headers: this.generateHeader(),
            body: JSON.stringify(data),
        });
    };

    deleteData = (url: string): Promise<Response> => {
        return fetch(url, {
            method: "DELETE",
            headers: this.generateHeader(),        
        });
    };

    throwError = async (response: Response) => {
        const errorResponse: ErrorResponse = await response.json();
        if (errorResponse.status === StatusCode.BAD_REQUEST) {
            throw new CustomError(
                errorResponse.status,
                errorResponse.message,
                response.statusText
            );
        }
        window.location.href = "/error";
    };
}
