import prisma from "#core/prisma";
import { ConflictException, NotFoundException } from "#utils/http-errors";
import { Prisma, Publisher } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getPublisherFilters } from "./dtos";
import {
  PublisherCreatePayload,
  PublisherIndexQuery,
  PublisherUpdatePayload,
} from "./types";

type PublisherWithBooks = Publisher & {
  books: { id: string }[];
};

export abstract class PublisherService {
  private static async handlePrismaError(
    error: unknown,
    context: "find" | "create" | "update" | "delete"
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundException("Yayıncı bulunamadı");
      }
      if (
        error.code === "P2002" &&
        (context === "create" || context === "update")
      ) {
        const target = (error.meta?.target as string[])?.join(", ");
        if (target?.includes("publisher_name")) {
          throw new ConflictException("Bu yayıncı adı zaten kullanılıyor");
        }
        throw new ConflictException(`${target} zaten kullanılıyor`);
      }
      if (error.code === "P2003" && context === "create") {
        throw new NotFoundException("Belirtilen yayıncı bulunamadı");
      }
    }
    throw error;
  }

  private static async preparePublisherPayloadForCreate(
    payloadRaw: PublisherCreatePayload
  ): Promise<Omit<Prisma.PublisherCreateInput, "id">> {
    const { name } = payloadRaw;

    return {
      name,
    };
  }

  private static async preparePublisherPayloadForUpdate(
    payloadRaw: PublisherUpdatePayload
  ): Promise<Prisma.PublisherUpdateInput> {
    const { name } = payloadRaw;
    const dataToUpdate: Prisma.PublisherUpdateInput = {};

    if (name) dataToUpdate.name = name;

    return dataToUpdate;
  }

  static async index(
    query?: PublisherIndexQuery
  ): Promise<PublisherWithBooks[]> {
    try {
      const [hasFilters, filters] = getPublisherFilters(query);

      const where: Prisma.PublisherWhereInput = {};

      if (hasFilters && filters.length > 0) {
        where.OR = filters;
      }

      const publishers = await prisma.publisher.findMany({
        where,
        include: {
          books: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return publishers;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  static async show(
    where: Prisma.PublisherWhereUniqueInput
  ): Promise<PublisherWithBooks> {
    try {
      const publisher = await prisma.publisher.findUnique({
        where,
        include: {
          books: true,
        },
      });

      if (!publisher) {
        throw new NotFoundException("Yayıncı bulunamadı");
      }
      return publisher;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  static async store(payload: PublisherCreatePayload): Promise<Publisher> {
    try {
      const publisherData =
        await this.preparePublisherPayloadForCreate(payload);
      const publisher = await prisma.publisher.create({
        data: publisherData,
      });
      return publisher;
    } catch (error) {
      await this.handlePrismaError(error, "create");
      throw error;
    }
  }

  static async update(
    id: string,
    payload: PublisherUpdatePayload
  ): Promise<PublisherWithBooks> {
    try {
      const updateData = await this.preparePublisherPayloadForUpdate(payload);

      if (Object.keys(updateData).length === 0) {
        const currentPublisher = await this.show({ id });
        return currentPublisher;
      }

      const updatedPublisher = await prisma.publisher.update({
        where: { id },
        data: updateData,
        include: {
          books: true,
        },
      });

      return updatedPublisher;
    } catch (error) {
      await this.handlePrismaError(error, "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<Publisher> {
    try {
      const deletedPublisher = await prisma.publisher.delete({
        where: { id },
      });
      return deletedPublisher;
    } catch (error) {
      await this.handlePrismaError(error, "delete");
      throw error;
    }
  }
}
