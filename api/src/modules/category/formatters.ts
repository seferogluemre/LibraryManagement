import { BaseFormatter } from "#utils/base-formatter";
import { Category } from "@prisma/client";
import { categoryResponseSchema } from "./dtos";
import { CategoryShowResponse } from "./types";

export abstract class CategoryFormatter {
  static response(data: Category) {
    const convertedData = BaseFormatter.convertData<CategoryShowResponse>(
      data,
      categoryResponseSchema
    );
    return convertedData;
  }
}
