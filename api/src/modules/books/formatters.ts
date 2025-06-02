import { BaseFormatter } from "#utils/base-formatter";
import { bookWithRelationsResponseSchema } from "./dtos";
import { BookWithRelationsResponse } from "./types";

export abstract class BookFormatter {
  static response(data: any): BookWithRelationsResponse {
    // Null olan category ve publisher'ları düzelt
    const formattedData = {
      ...data,
      category:
        data.category && Object.keys(data.category).length > 0
          ? data.category
          : null,
      publisher:
        data.publisher && Object.keys(data.publisher).length > 0
          ? data.publisher
          : null,
    };

    const convertedData = BaseFormatter.convertData<BookWithRelationsResponse>(
      formattedData,
      bookWithRelationsResponseSchema
    );
    return convertedData;
  }
}
