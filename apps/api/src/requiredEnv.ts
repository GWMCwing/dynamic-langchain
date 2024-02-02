import { config } from "dotenv";
config();

const requiredEnv = ["POSTGRES_DATABASE_CONNECTION_URL", "JWT_SECRET"] as const;
const optionalEnv = ["PORT", "TRUST_PROXY"] as const;

export const env: Record<(typeof requiredEnv)[number], string> &
  Partial<Record<(typeof optionalEnv)[number], string>> = {} as any;
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
