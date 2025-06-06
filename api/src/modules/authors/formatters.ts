import { Author } from "@prisma/client";
import { BaseFormatter } from "@utils/base-formatter";
import { authorResponseSchema } from "./dtos";
import { AuthorShowResponse } from "./types";

export abstract class AuthorFormatter {
  static response(data: Author) {
    const convertedData = BaseFormatter.convertData<AuthorShowResponse>(
      data,
      authorResponseSchema
    );
    return convertedData;
  }
}
