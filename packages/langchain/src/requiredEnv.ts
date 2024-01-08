import { config } from "dotenv";
config();

const requiredEnv = [] as const;
const optionalEnv = ["MODEL_PATH_TINY_LLAMA", "MODEL_PATH_MISTRAL"] as const;

export const env: Record<
  (typeof requiredEnv)[number] | (typeof optionalEnv)[number],
  string
> = {} as any;
{
  const missingEnv: string[] = [];
  for (const key of requiredEnv) {
    if (process.env[key] == null) {
      missingEnv.push(key);
    } else {
      env[key as keyof typeof env] = process.env[key]!;
    }
  }
  if (missingEnv.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnv.join(", ")}`,
    );
  }
  for (const key of optionalEnv) {
    if (process.env[key] != null) {
      env[key as keyof typeof env] = process.env[key]!;
    }
  }
}
