import { Prisma } from "@prisma/client";

type SwapDecimalWithNumber<T> = {
  [k in keyof T]: T[k] extends Prisma.DecimalJsLike
    ? number
    : T[k] extends object
      ? SwapDecimalWithNumber<T[k]>
      : T[k];
};

export const decimalsToNumber = <T extends object>(
  obj: T
): SwapDecimalWithNumber<T> => {
  obj = JSON.parse(JSON.stringify(obj));

  if (!obj) return obj;

  // @ts-ignore
  Object.keys(obj).forEach((key: keyof T) => {
    if (Prisma.Decimal.isDecimal(obj[key])) {
      // @ts-ignore
      obj[key] = obj[key].toNumber();
    } else if (Array.isArray(obj[key])) {
      // @ts-ignore
      obj[key] = obj[key].map((el) =>
        typeof el === "object" ? decimalsToNumber(el) : el
      );
    } else if (typeof obj[key] === "object") {
      // @ts-ignore
      obj[key] = decimalsToNumber(obj[key]);
    }
  });

  return obj as SwapDecimalWithNumber<T>;
};
