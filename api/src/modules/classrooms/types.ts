import { Static } from "elysia";
import {
  classroomCreateDto,
  classroomIndexDto,
  classroomShowDto,
  classroomUpdateDto,
} from "./dtos";

export type ClassroomResponse = Static<(typeof classroomShowDto.response)[200]>;

export type ClassroomCreatePayload = Static<typeof classroomCreateDto.body>;
export type ClassroomCreateResponse = Static<
  (typeof classroomCreateDto.response)[200]
>;

export type ClassroomUpdatePayload = Static<typeof classroomUpdateDto.body>;

export type ClassroomParams = Static<typeof classroomShowDto.params>;
export type ClassroomShowResponse = Static<
  (typeof classroomShowDto.response)[200]
>;

export type ClassroomIndexQuery = Static<typeof classroomIndexDto.query>;
