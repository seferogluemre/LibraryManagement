import prisma from "#core/prisma";
import { HandleError } from "#shared/error/handle-error";
import { NotFoundException } from "#utils/http-errors";
import { Author, Prisma } from "@prisma/client";
import { getAuthorFilters } from "./dtos";
import {
  AuthorCreatePayload,
  AuthorIndexQuery,
  AuthorUpdatePayload,
} from "./types";

export abstract class AuthorService {
  private static async prepareAuthorPayloadForCreate(
    payloadRaw: AuthorCreatePayload
  ): Promise<Omit<Prisma.AuthorCreateInput, "id" | "createdAt">> {
    const { name } = payloadRaw;
    return { name };
  }

  private static async prepareAuthorPayloadForUpdate(
    payloadRaw: AuthorUpdatePayload
  ): Promise<Prisma.AuthorUpdateInput> {
    const { name } = payloadRaw;
    const dataToUpdate: Prisma.AuthorUpdateInput = {};
    if (name) dataToUpdate.name = name;
    return dataToUpdate;
  }

  static async index(query?: AuthorIndexQuery) {
    try {
      const [hasFilters, filters] = getAuthorFilters(query);

      const where: Prisma.AuthorWhereInput = {};

      if (hasFilters && filters.length > 0) {
        where.OR = filters;
      }

      const authors = await prisma.author.findMany({
        where,
        orderBy: { name: "asc" },
      });

      return authors;
    } catch (error) {
      await HandleError.handlePrismaError(error, "author", "find");
      throw error;
    }
  }

  static async show(where: Prisma.AuthorWhereUniqueInput) {
    try {
      const author = await prisma.author.findUnique({
        where,
      });

      if (!author) {
        throw new NotFoundException("Yazar bulunamadı");
      }
      return author;
    } catch (error) {
      await HandleError.handlePrismaError(error, "author", "find");
      throw error;
    }
  }

  static async store(payload: AuthorCreatePayload): Promise<Author> {
    try {
      const authorData = await this.prepareAuthorPayloadForCreate(payload);
      const author = await prisma.author.create({
        data: authorData,
      });
      return author;
    } catch (error) {
      await HandleError.handlePrismaError(error, "author", "create");
      throw error;
    }
  }

  static async update(
    id: string,
    payload: AuthorUpdatePayload
  ): Promise<Author> {
    try {
      const updatedData = await this.prepareAuthorPayloadForUpdate(payload);

      if (Object.keys(updatedData).length == 0) {
        const currentAuthor = await prisma.author.findUnique({
          where: { id },
        });
        if (!currentAuthor) throw new NotFoundException("Yazar bulunamadı");
        return currentAuthor;
      }

      const updatedAuthor = await prisma.author.update({
        where: { id },
        data: updatedData,
      });
      return updatedAuthor;
    } catch (error) {
      await HandleError.handlePrismaError(error, "author", "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<Author> {
    try {
      const deletedAuthor = await prisma.author.delete({
        where: { id },
      });
      return deletedAuthor;
    } catch (error) {
      await HandleError.handlePrismaError(error, "author", "delete");
      throw error;
    }
  }
}
