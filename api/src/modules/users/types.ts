import { Static } from "elysia";
import {
  userCreateDto,
  userIndexDto,
  userShowDto,
  userUpdateDto,
} from "./dtos";

export type UserResponse = Static<(typeof userShowDto.response)[200]>;

export type UserCreatePayload = Static<typeof userCreateDto.body>;
export type UserCreateResponse = Static<(typeof userCreateDto.response)[200]>;

export type UserUpdatePayload = Static<typeof userUpdateDto.body>;

export type UserParams = Static<typeof userShowDto.params>;
export type UserShowResponse = Static<(typeof userShowDto.response)[200]>;

export type UserIndexQuery = Static<typeof userIndexDto.query>;
