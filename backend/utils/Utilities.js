export const ErrorHandler = (res, code, message) => {
    switch (code) {
        case 400:
            return res.status(code).json({
                status: "Bad Request",
                code: code,
                message: message || "The request is invalid",
            });
        case 404:
            return res.status(code).json({
                status: "Not Found",
                code: code,
                message: message || "The requested resource could not be found",
            });
        case 500:
            return res.status(code).json({
                status: "Internal Server Error",
                code: code,
                message: message || "An unexpected error occurred on the server",
            });
        default:
            return res.status(code || 500).json({
                status: "Error",
                code: code || 500,
                message: message || "An unknown error occurred",
            });
    }
};

export const SuccessHandler = (res, data, message, code = 200) => {
    switch (code) {
        case 200:
            return res.status(code).json({
                status: "OK",
                code: code,
                message: message || "Success",
                data: data,
            });
        case 201:
            return res.status(code).json({
                status: "Created",
                code: code,
                message: message || "Successfully created",
                data: data,
            });
        default:
            return res.status(code).json({
                status: "Success",
                code: code,
                message: message || "Operation successful",
                data: data,
            });
    }
};



