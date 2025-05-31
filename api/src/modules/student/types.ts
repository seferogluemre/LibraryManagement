import { Static } from "elysia";
import {
  studentCreateDto,
  studentIndexDto,
  studentShowDto,
  studentUpdateDto,
} from "./dtos";

export type StudentResponse = Static<(typeof studentShowDto.response)[200]>;

export type StudentCreatePayload = Static<typeof studentCreateDto.body>;
export type StudentCreateResponse = Static<
  (typeof studentCreateDto.response)[200]
>;

export type StudentUpdatePayload = Static<typeof studentUpdateDto.body>;

export type StudentIndexQuery = Static<typeof studentIndexDto.query>;

export type StudentParams = Static<typeof studentShowDto.params>;
