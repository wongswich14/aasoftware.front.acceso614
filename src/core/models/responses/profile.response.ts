import { ProfileDto } from "../dtos/profiles/profileDto";
import { ApiResponse } from "./api.response";

export interface ProfileResponse extends ApiResponse<ProfileDto> {
}