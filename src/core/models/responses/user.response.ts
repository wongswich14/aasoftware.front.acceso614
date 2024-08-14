import { UserDto } from "../dtos/users/userDto";
import { ApiResponse } from "./api.response";

export interface UserResponse extends ApiResponse<UserDto> {
    
}