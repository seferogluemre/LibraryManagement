import prisma from "#core/prisma";
import { Prisma } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { NotFoundException } from "@utils/http-errors";
import bcrypt from "bcryptjs";
import { getUserFilters } from "./dtos";
import { UserCreatePayload, UserIndexQuery, UserUpdatePayload } from "./types";

export abstract class UsersService {
  private static async prepareUserPayloadForCreate(
    payloadRaw: UserCreatePayload
  ): Promise<Omit<Prisma.UserCreateInput, "id" | "createdAt">> {
    const { name, email, password, role } = payloadRaw;
    const hashedPassword = await bcrypt.hash(password, 10);
    return { name, email: email.toLowerCase(), hashedPassword, role };
  }

  private static async prepareUserPayloadForUpdate(
    payloadRaw: UserUpdatePayload
  ): Promise<Prisma.UserUpdateInput> {
    const { name, password, role } = payloadRaw;
    const dataToUpdate: Prisma.UserUpdateInput = {};
    if (name) dataToUpdate.name = name;
    if (password) dataToUpdate.hashedPassword = await bcrypt.hash(password, 10);
    if (role) dataToUpdate.role = role;
    return dataToUpdate;
  }

  static async index(query?: UserIndexQuery): Promise<Prisma.User[]> {
    const [hasFilters, filters] = getUserFilters(query);
    const where: Prisma.UserWhereInput = {};

    if (hasFilters && filters.length > 0) {
      where.OR = filters;
    }

    return prisma.user.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async show(where: Prisma.UserWhereUniqueInput) {
    const user = await prisma.user.findUnique({
      where,
    });

    if (!user) {
      throw new NotFoundException("Kullanıcı bulunamadı");
    }
    return user;
  }

  static async store(payload: UserCreatePayload): Promise<Prisma.User> {
    try {
      const userData = await this.prepareUserPayloadForCreate(payload);
      const user = await prisma.user.create({
        data: userData,
      });
      return user;
    } catch (error) {
      await HandleError.handlePrismaError(error, "user", "create");
      throw error;
    }
  }

  static async update(
    id: string,
    payload: UserUpdatePayload
  ): Promise<Prisma.User> {
    try {
      const updateData = await this.prepareUserPayloadForUpdate(payload);

      if (Object.keys(updateData).length === 0) {
        const currentUser = await prisma.user.findUnique({ where: { id } });
        if (!currentUser) throw new NotFoundException("Kullanıcı bulunamadı");
        return currentUser;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      });
      return updatedUser;
    } catch (error) {
      await HandleError.handlePrismaError(error, "user", "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<Prisma.User> {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });
      return deletedUser;
    } catch (error) {
      await HandleError.handlePrismaError(error, "user", "delete");
      throw error;
    }
  }
}
