import prisma from "#core/prisma";
import { HandleError } from "#shared/error/handle-error";
import { NotFoundException } from "#utils/http-errors";
import { Category, Prisma } from "@prisma/client";
import { getCategoryFilters } from "./dtos";
import {
  CategoryCreatePayload,
  CategoryIndexQuery,
  CategoryUpdatePayload,
} from "./types";

export abstract class CategoryService {
  private static async prepareCategoryPayloadForCreate(
    payloadRaw: CategoryCreatePayload
  ): Promise<Omit<Prisma.CategoryCreateInput, "id" | "createdAt">> {
    const { name } = payloadRaw;
    return { name };
  }

  private static async prepareCategoryPayloadForUpdate(
    payloadRaw: CategoryUpdatePayload
  ): Promise<Prisma.CategoryUpdateInput> {
    const { name } = payloadRaw;
    const dataToUpdate: Prisma.CategoryUpdateInput = {};
    if (name) dataToUpdate.name = name;
    return dataToUpdate;
  }

  static async index(query?: CategoryIndexQuery) {
    try {
      const [hasFilters, filters] = getCategoryFilters(query);

      const where: Prisma.CategoryWhereInput = {};

      if (hasFilters && filters.length > 0) {
        where.OR = filters;
      }

      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: "asc" },
      });

      return categories;
    } catch (error) {
      await HandleError.handlePrismaError(error, "category", "find");
      throw error;
    }
  }

  static async show(where: Prisma.CategoryWhereUniqueInput) {
    try {
      const category = await prisma.category.findUnique({
        where,
      });

      if (!category) {
        throw new NotFoundException("Kategori bulunamadı");
      }

      return category;
    } catch (error) {
      await HandleError.handlePrismaError(error, "category", "find");
      throw error;
    }
  }

  static async store(payload: CategoryCreatePayload): Promise<Category> {
    try {
      const categoryData = await this.prepareCategoryPayloadForCreate(payload);
      const category = await prisma.category.create({
        data: categoryData,
      });
      return category;
    } catch (error) {
      await HandleError.handlePrismaError(error, "category", "create");
      throw error;
    }
  }

  static async update(
    id: string,
    payload: CategoryUpdatePayload
  ): Promise<Category> {
    try {
      const updatedData = await this.prepareCategoryPayloadForUpdate(payload);

      if (Object.keys(updatedData).length == 0) {
        const currentCategory = await prisma.category.findUnique({
          where: { id },
        });
        if (!currentCategory)
          throw new NotFoundException("Kategori bulunamadı");
        return currentCategory;
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: updatedData,
      });
      return updatedCategory;
    } catch (error) {
      await HandleError.handlePrismaError(error, "category", "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<Category> {
    try {
      const deletedCategory = await prisma.category.delete({
        where: { id },
      });
      return deletedCategory;
    } catch (error) {
      await HandleError.handlePrismaError(error, "category", "delete");
      throw error;
    }
  }
}
