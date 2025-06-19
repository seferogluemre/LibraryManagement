import prisma from "@core/prisma";
import { Author, Prisma } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { NotFoundException } from "@utils/http-errors";
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
      const { page = 1, limit = 10, name } = query || {};
      const skip = (page - 1) * limit;

      const where: Prisma.AuthorWhereInput = {};
      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive',
        };
      }

      const [total, authors] = await prisma.$transaction([
        prisma.author.count({ where }),
        prisma.author.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: "asc" },
          include: {
            _count: {
              select: { books: true },
            },
          },
        }),
      ]);

      return {
        data: authors,
        total,
        page,
        limit,
      };
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
