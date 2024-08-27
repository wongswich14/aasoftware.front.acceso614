import { PojosMetadataMap } from "@automapper/pojos";
import { HouseCreateDto } from "src/core/models/dtos/houses/houseCreateDto";
import { HouseDto } from "src/core/models/dtos/houses/houseDto";
import { HouseResponse } from "src/core/models/responses/house.response";

export function createHouseMetadata() {
    PojosMetadataMap.create<HouseDto>("HouseDto")

    PojosMetadataMap.create<HouseResponse> 
}