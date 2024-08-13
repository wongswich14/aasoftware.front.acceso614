import { UserDto } from "../dtos/users/userDto";
import { ApiResponse } from "./api.response";

export interface AuthResponse extends ApiResponse<UserDto> {
    token?: string,
}