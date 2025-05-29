import { Value } from "@sinclair/typebox/value";
import { decimalsToNumber } from "./prisma-helpers";

export abstract class BaseFormatter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static convertData<ReturnType extends object>(data: any, dto: any) {
    const clonedData = { ...data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanData = Value.Clean(dto, clonedData) as any;
    const convertedData = Value.Convert(dto, decimalsToNumber(cleanData));

    return convertedData as ReturnType;
  }
}
