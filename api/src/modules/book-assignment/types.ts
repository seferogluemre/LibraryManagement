import { Static } from "elysia";
import {
  bookAssignmentCreateDto,
  bookAssignmentIndexDto,
  bookAssignmentResponseSchema,
  bookAssignmentShowDto,
  bookAssignmentUpdateDto,
  bookAssignmentWithRelationsResponseSchema,
} from "./dtos";

export type BookAssignmentResponse = Static<
  typeof bookAssignmentResponseSchema
>;
export type BookAssignmentWithRelationsResponse = Static<
  typeof bookAssignmentWithRelationsResponseSchema
>;

export type BookAssignmentCreatePayload = Static<
  typeof bookAssignmentCreateDto.body
>;
export type BookAssignmentCreateResponse = Static<
  (typeof bookAssignmentCreateDto.response)[200]
>;

export type BookAssignmentShowResponse = Static<
  (typeof bookAssignmentShowDto.response)[200]
>;

export type BookAssignmentUpdatePayload = Static<
  typeof bookAssignmentUpdateDto.body
>;
export type BookAssignmentUpdateResponse = Static<
  (typeof bookAssignmentUpdateDto.response)[200]
>;

export type BookAssignmentIndexQuery = Static<
  typeof bookAssignmentIndexDto.query
>;
export type BookAssignmentIndexResponse = Static<
  (typeof bookAssignmentIndexDto.response)[200]
>;

export type BookAssignmentParams = Static<typeof bookAssignmentShowDto.params>;
