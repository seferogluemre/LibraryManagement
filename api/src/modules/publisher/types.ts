import { Static } from "elysia";
import {
  publisherCreateDto,
  publisherIndexDto,
  publisherShowDto,
  publisherUpdateDto,
} from "./dtos";

export type PublisherResponse = Static<(typeof publisherShowDto.response)[200]>;

export type PublisherCreatePayload = Static<typeof publisherCreateDto.body>;
export type PublisherCreateResponse = Static<
  (typeof publisherCreateDto.response)[200]
>;

export type PublisherUpdatePayload = Static<typeof publisherUpdateDto.body>;

export type PublisherIndexQuery = Static<typeof publisherIndexDto.query>;

export type PublisherParams = Static<typeof publisherShowDto.params>;
