const requiredEnv = ["NEXT_PUBLIC_API_URL", "NEXT_AUTH_SECRET"] as const;
const optionalEnv = [] as const;

function logEnvExists(key: readonly string[]) {
  console.log("Environment variables found:");
  if (key.length === 0) {
    console.log("- ✅ None");
    return;
  }
  key.forEach((key) => {
    console.log(`- ✅ ${key}`);
  });
}

function logEnvMissing(key: readonly string[]) {
  console.error("Missing environment variables:");
  if (key.length === 0) {
    console.log("- ✅ None");
    return;
  }
  key.forEach((key) => {
    console.log(`- ❌ ${key}`);
  });
}

function logEnvUnused(key: readonly string[]) {
  console.warn("Unused environment variables:");
  if (key.length === 0) {
    console.log("- ✅ None");
    return;
  }
  key.forEach((key) => {
    console.log(`- ⚠️ ${key}`);
  });
}

export function checkEnv() {
  console.log("Checking environment variables...");

  const missingEnv: string[] = [];
  const unusedVariables: string[] = [];
  for (const key of requiredEnv) {
    if (process.env[key] == null) {
      missingEnv.push(key);
    }
  }
  for (const key of optionalEnv) {
    if (process.env[key] != null) {
      unusedVariables.push(key);
    }
  }
  //
  logEnvExists(requiredEnv);
  logEnvMissing(missingEnv);
  logEnvUnused(unusedVariables);
  //
  if (missingEnv.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnv.join(", ")}`,
    );
  }
  //
  console.log("Environment variables are valid");
}
