export function checkRequiredEnvVariables(names: string[]): void {
    const missingVariables: string[] = [];
    for (const name of names) {
      if (process.env[name] === undefined) {
        missingVariables.push(name);
      }
    }
    if (missingVariables.length > 0) {
      throw new Error(`Required environment variables are missing: ${missingVariables.join(', ')}`);
    }
  }