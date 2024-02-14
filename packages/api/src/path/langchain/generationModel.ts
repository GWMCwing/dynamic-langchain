import { AllowedModelName_GenerationModel } from "@repo/langchain/typing";
import {
  EmptyHeader,
  GetRequestDefinition,
  ResponseDefinition,
} from "../../utility/request.js";
import { InterfaceDefinition, RouteDefinition } from "../../utility/route.js";

type GET_GenerationModelName = InterfaceDefinition<
  "GET",
  GetRequestDefinition,
  ResponseDefinition<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
        generationModelList: AllowedModelName_GenerationModel[];
      },
    "json"
  >
>;

export type GenerationModel = RouteDefinition<
  "/langchain/generationModels",
  {
    GET: GET_GenerationModelName;
  }
>;
