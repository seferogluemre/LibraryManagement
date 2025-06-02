import { Static } from "elysia";
import {
  bookByIsbnDto,
  bookCreateDto,
  bookIndexDto,
  bookResponseSchema,
  booksByAuthorDto,
  booksByCategoryDto,
  booksByPublisherDto,
  bookShowDto,
  bookUpdateDto,
  bookWithRelationsResponseSchema,
} from "./dtos";

export type BookResponse = Static<typeof bookResponseSchema>;
export type BookWithRelationsResponse = Static<
  typeof bookWithRelationsResponseSchema
>;

export type BookCreatePayload = Static<typeof bookCreateDto.body>;
export type BookCreateResponse = Static<(typeof bookCreateDto.response)[200]>;

export type BookShowResponse = Static<(typeof bookShowDto.response)[200]>;

export type BookUpdatePayload = Static<typeof bookUpdateDto.body>;
export type BookUpdateResponse = Static<(typeof bookUpdateDto.response)[200]>;

export type BookIndexQuery = Static<typeof bookIndexDto.query>;
export type BookIndexResponse = Static<(typeof bookIndexDto.response)[200]>;

export type BookParams = Static<typeof bookShowDto.params>;

export type BooksByAuthorParams = Static<typeof booksByAuthorDto.params>;
export type BooksByAuthorResponse = Static<
  (typeof booksByAuthorDto.response)[200]
>;

export type BooksByCategoryParams = Static<typeof booksByCategoryDto.params>;
export type BooksByCategoryResponse = Static<
  (typeof booksByCategoryDto.response)[200]
>;

export type BooksByPublisherParams = Static<typeof booksByPublisherDto.params>;
export type BooksByPublisherResponse = Static<
  (typeof booksByPublisherDto.response)[200]
>;

export type BookByIsbnParams = Static<typeof bookByIsbnDto.params>;
export type BookByIsbnResponse = Static<(typeof bookByIsbnDto.response)[200]>;
