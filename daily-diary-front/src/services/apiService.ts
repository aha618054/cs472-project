import { CustomError } from "../utils/customError";
import { StatusCode } from "../models/enums/StatusCodeEnum";
import { ErrorResponse } from "../models/ErrorResponse";

export class APIService {
    // Method to get the base URL
    getBaseUrl = (): string => {
        return "http://localhost:8080/api"; // Ensure your base URL is correct
    };

    // Method to generate HTTP headers for the requests
    generateHeader = (): Headers => {
        const headers: Headers = new Headers();
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");
        return headers;
    };

    // Method to handle GET requests
    getData = (url: string): Promise<Response> => {
        return fetch(url, {
            method: "GET",
            headers: this.generateHeader(),
        });
    };

    // Method to handle POST requests
    postData = (url: string, data: any): Promise<Response> => {
        return fetch(url, {
            method: "POST",
            headers: this.generateHeader(),
            body: JSON.stringify(data),
        });
    };

    // Method to handle PUT requests
    putData = (url: string, data: any): Promise<Response> => {
        return fetch(url, {
            method: "PUT",
            headers: this.generateHeader(),
            body: JSON.stringify(data),
        });
    };

    // Method to handle PATCH requests
    patchData = (url: string, data: any): Promise<Response> => {
        return fetch(url, {
            method: "PATCH",
            headers: this.generateHeader(),
            body: JSON.stringify(data),
        });
    };

    // Updated method to handle DELETE requests
    deleteData = (url: string): Promise<Response> => {
        return fetch(url, {
            method: "DELETE", // Corrected from "GET" to "DELETE"
            headers: this.generateHeader(),
        });
    };

    // Method to throw an error based on the response status
    throwError = async (response: Response) => {
        try {
            const errorResponse: ErrorResponse = await response.json();
            
            if (errorResponse.status === StatusCode.BAD_REQUEST) {
                throw new CustomError(
                    errorResponse.status,
                    errorResponse.message,
                    response.statusText
                );
            }

            if (errorResponse.status === StatusCode.NOT_FOUND) {
                alert("The requested resource was not found.");
                return;
            }

            // You can add additional checks if there are other status codes you handle
            // For other unhandled status codes, redirect to the error page
            window.location.href = "/error";
        } catch (error) {
            // If the response is not in JSON format, handle the error gracefully
            console.error("Error parsing response:", error);
            window.location.href = "/error";
        }
    };
}
