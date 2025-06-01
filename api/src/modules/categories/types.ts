import { Static } from "elysia";
import {
  categoryCreateDto,
  categoryIndexDto,
  categoryShowDto,
  categoryUpdateDto,
} from "./dtos";

export type CategoryResponse = Static<(typeof categoryShowDto.response)[200]>;

export type CategoryCreatePayload = Static<typeof categoryCreateDto.body>;
export type CategoryCreateResponse = Static<
  (typeof categoryCreateDto.response)[200]
>;

export type CategoryUpdatePayload = Static<typeof categoryUpdateDto.body>;

export type CategoryIndexQuery = Static<typeof categoryIndexDto.query>;

export type CategoryParams = Static<typeof categoryShowDto.params>;

export type CategoryShowResponse = Static<
  (typeof categoryShowDto.response)[200]
>;
