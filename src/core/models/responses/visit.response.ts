import { ApiResponse } from "./api.response";
import {VisitsDto} from "../dtos/visits/visitsDto.ts";

export interface VisitResponse extends ApiResponse<VisitsDto> {

}