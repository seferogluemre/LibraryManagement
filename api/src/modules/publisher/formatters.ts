import { BaseFormatter } from "#utils/base-formatter";
import { Publisher } from "@prisma/client";
import {
  publisherResponseSchema,
  publisherWithBooksResponseSchema,
} from "./dtos";
import { PublisherResponse } from "./types";

type PublisherWithBooks = Publisher & {
  books: { id: string }[];
};

export class PublisherFormatter {
  /**
   * Create operation için kullanılır (sadece id ve name döner)
   */
  static createResponse(data: Publisher) {
    const convertedData = BaseFormatter.convertData<PublisherResponse>(
      data,
      publisherResponseSchema
    );
    return convertedData;
  }

  /**
   * Show, update, index operations için kullanılır (books array ile birlikte)
   */
  static responseWithBooks(data: PublisherWithBooks) {
    const convertedData = BaseFormatter.convertData<PublisherResponse>(
      data,
      publisherWithBooksResponseSchema
    );
    return convertedData;
  }

  /**
   * Geriye dönük uyumluluk için - create operations için kullanılır
   */
  static response(data: Publisher) {
    return this.createResponse(data);
  }
}
