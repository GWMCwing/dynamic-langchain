import { InputLabel, MenuItem, Select } from "@mui/material";
import SelectInput from "@mui/material/Select/SelectInput";
import { GenerationModel } from "@repo/api-types/route/langchain";
import { AxiosFetch } from "@utility/axios";
import { useEffect, useState } from "react";

async function getModelList() {
  const { data } = await AxiosFetch<GenerationModel, "GET">(
    "GET",
    "/langchain/generationModels",
    "json",
    {},
  )();
  if (data.success === false) return null;
  return data.generationModelList;
}

export function ModelSelector({
  modelName,
  setModelName,
}: {
  modelName: string;
  setModelName: (modelName: string) => unknown;
}) {
  const [generationModelList, setModelList] = useState<string[] | null>(null);
  const [loadState, setLoadState] = useState<"ready" | "loading" | "loaded">(
    "ready",
  );

  useEffect(() => {
    if (loadState !== "ready") return;
    setLoadState("loading");
    getModelList().then((list) => {
      setModelList(list);
      setLoadState("loaded");
    });
  });
  //

  return (
    <>
      <InputLabel id="model-select-label">Model</InputLabel>
      <Select
        labelId="model-select-label"
        id="model-select"
        label="Model"
        value={modelName}
        onChange={(e) => setModelName(e.target.value as string)}
        fullWidth
      >
        {generationModelList ? (
          generationModelList.map((model) => (
            <MenuItem key={model} value={model}>
              {model}
            </MenuItem>
          ))
        ) : (
          <MenuItem value={""}>Error</MenuItem>
        )}
      </Select>
    </>
  );
}
