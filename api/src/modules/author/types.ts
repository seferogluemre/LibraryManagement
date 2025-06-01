import { Static } from "elysia";
import {
  authorCreateDto,
  authorIndexDto,
  authorShowDto,
  authorUpdateDto,
} from "./dtos";

export type AuthorResponse = Static<(typeof authorShowDto.response)[200]>;

export type AuthorCreatePayload = Static<typeof authorCreateDto.body>;
export type AuthorCreateResponse = Static<
  (typeof authorCreateDto.response)[200]
>;
export type AuthorShowResponse = Static<(typeof authorShowDto.response)[200]>;

export type AuthorUpdatePayload = Static<typeof authorUpdateDto.body>;

export type AuthorIndexQuery = Static<typeof authorIndexDto.query>;

export type AuthorParams = Static<typeof authorShowDto.params>;
