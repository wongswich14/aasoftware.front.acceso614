import { isRejectedWithValue, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const errorCatcherMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    
    if (isRejectedWithValue(action)) {
        console.warn("Error en la acción")

        toast.warning('data' in action.error ? (action.error.data as { message: string }).message : action.error.message)

    }

    return next(action)
}