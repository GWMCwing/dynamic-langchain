import { config } from "dotenv";
config();

const requiredEnv = ["MODEL_PATH", "EMBEDDING_MODEL_PATH"] as const;

export const env: Record<(typeof requiredEnv)[number], string> = {} as any;
{
  const missingEnv: string[] = [];
  for (const key of requiredEnv) {
    if (process.env[key] == null) {
      missingEnv.push(key);
    } else {
      env[key] = process.env[key]!;
    }
  }
  if (missingEnv.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnv.join(", ")}`,
    );
  }
}
