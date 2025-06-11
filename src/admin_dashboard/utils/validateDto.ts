import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const validateDTO = async <T extends object>(
  dtoClass: new () => T,
  body: any
): Promise<T> => {
  const dtoInstance = plainToInstance(dtoClass, body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const messages = errors
      .map((err) => Object.values(err.constraints || {}))
      .flat();
    const error = new Error(messages.join("; "));
    error.name = "ValidationError";
    throw error;
  }

  return dtoInstance;
};
