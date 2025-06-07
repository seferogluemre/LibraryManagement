import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConflictException, NotFoundException } from "@utils/http-errors";

export abstract class HandleError {
  static async handlePrismaError(
    error: unknown,
    model: string,
    context: "find" | "create" | "update" | "delete"
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundException(`${model} bulunamadı`);
      }
      if (
        error.code === "P2002" &&
        (context === "create" || context === "update")
      ) {
        const target = (error.meta?.target as string[])?.join(", ");
        throw new ConflictException(`${target} zaten kullanılıyor.`);
      }
      if (error.code === "P2002" && context === "create") {
        throw new ConflictException(`${model} zaten mevcut`);
      }
      if (error.code === "P2002" && context === "update") {
        throw new ConflictException(`${model} zaten mevcut`);
      }
    }
    throw error;
  }
}
