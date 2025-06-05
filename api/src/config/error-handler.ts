import { ErrorHandler } from "elysia";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleElysiaError: ErrorHandler<any, any, any, any, any> = ({
  error,
  code,
  set,
}) => {
  set.headers["Content-Type"] = "application/json";

  if (code === "VALIDATION") {
    return {
      name: "UnprocessableEntityError",
      message: "Validation error",
      details: {
        // @ts-ignore
        type: error.type ?? error.error?.type,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields:
          error.all ??
          error.error?.all?.map((err: any) => ({ ...err, path: error.path })),
      },
    };
  }

  if (process.env.NODE_ENV === "development") {
    return error;
  }

  if (
    code === "INTERNAL_SERVER_ERROR" ||
    // Prisma error codes
    // @ts-ignore
    (code.startsWith("P") && code.length === 5)
  ) {
    return {
      name: "InternalServerError",
      message: "Internal server error",
    };
  }

  // Default error response
  return {
    name: "UnknownError",
    message: "An error occurred",
  };
};
