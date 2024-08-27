import { createMapper } from "@automapper/core";
import { pojos } from "@automapper/pojos";

const mapper = createMapper({ strategyInitializer: pojos() })