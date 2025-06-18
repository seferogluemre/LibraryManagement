import prisma from "@core/prisma";
import { Book, Prisma } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { NotFoundException } from "@utils/http-errors";
import { AuthService } from "../auth/service";
import { getBooksFilters } from "./dtos";
import { BookCreatePayload, BookIndexQuery, BookUpdatePayload } from "./types";

export abstract class BookService {
  private static async getUserIdFromAuthHeader(
    authorizationHeader: string | undefined
  ): Promise<string> {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new NotFoundException("Authorization header gerekli");
    }

    const token = authorizationHeader.substring(7);
    const user = await AuthService.validateToken(token);
    return user.id;
  }

  private static async prepareBookPayloadForCreate(
    payloadRaw: BookCreatePayload
  ): Promise<Omit<Prisma.BookCreateInput, "id">> {
    const {
      title,
      isbn,
      published_year,
      total_copies,
      available_copies,
      author_id,
      category_id,
      publisher_id,
    } = payloadRaw;

    // Yazarın var olduğunu kontrol et
    const authorExists = await prisma.author.findUnique({
      where: { id: author_id },
    });

    if (!authorExists) {
      throw new NotFoundException("Belirtilen yazar bulunamadı");
    }

    // Kategori varsa kontrol et
    if (category_id) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: category_id },
      });

      if (!categoryExists) {
        throw new NotFoundException("Belirtilen kategori bulunamadı");
      }
    }

    // Yayınevi varsa kontrol et
    if (publisher_id) {
      const publisherExists = await prisma.publisher.findUnique({
        where: { id: publisher_id },
      });

      if (!publisherExists) {
        throw new NotFoundException("Belirtilen yayınevi bulunamadı");
      }
    }

    return {
      title,
      isbn: isbn || null,
      publishedYear: published_year || null,
      totalCopies: total_copies,
      availableCopies: available_copies || total_copies,
      author: {
        connect: { id: author_id },
      },
      ...(category_id && {
        category: {
          connect: { id: category_id },
        },
      }),
      ...(publisher_id && {
        publisher: {
          connect: { id: publisher_id },
        },
      }),
    };
  }

  private static async prepareBookPayloadForUpdate(
    payloadRaw: BookUpdatePayload
  ): Promise<Prisma.BookUpdateInput> {
    const {
      title,
      isbn,
      published_year,
      total_copies,
      available_copies,
      author_id,
      category_id,
      publisher_id,
      addedBy,
    } = payloadRaw;

    const dataToUpdate: Prisma.BookUpdateInput = {};

    if (title !== undefined) dataToUpdate.title = title;
    if (isbn !== undefined) dataToUpdate.isbn = isbn;
    if (published_year !== undefined) dataToUpdate.publishedYear = published_year;
    if (total_copies !== undefined) dataToUpdate.totalCopies = total_copies;
    if (available_copies !== undefined)
      dataToUpdate.availableCopies = available_copies;

    if (author_id) {
      const authorExists = await prisma.author.findUnique({
        where: { id: author_id },
      });
      if (!authorExists) throw new NotFoundException("Belirtilen yazar bulunamadı");
      dataToUpdate.author = { connect: { id: author_id } };
    }

    if (category_id !== undefined) {
      if (category_id) {
        const categoryExists = await prisma.category.findUnique({
          where: { id: category_id },
        });
        if (!categoryExists) throw new NotFoundException("Belirtilen kategori bulunamadı");
        dataToUpdate.category = { connect: { id: category_id } };
      } else {
        dataToUpdate.category = { disconnect: true };
      }
    }

    if (publisher_id !== undefined) {
      if (publisher_id) {
        const publisherExists = await prisma.publisher.findUnique({
          where: { id: publisher_id },
        });
        if (!publisherExists) throw new NotFoundException("Belirtilen yayınevi bulunamadı");
        dataToUpdate.publisher = { connect: { id: publisher_id } };
      } else {
        dataToUpdate.publisher = { disconnect: true };
      }
    }

    if (addedBy) {
      // Kullanıcının var olduğunu kontrol et
      const userExists = await prisma.user.findUnique({
        where: { id: addedBy },
      });

      if (!userExists) {
        throw new NotFoundException("Belirtilen kullanıcı bulunamadı");
      }

      dataToUpdate.addedBy = {
        connect: { id: addedBy },
      };
    }

    return dataToUpdate;
  }

  static async index(query?: BookIndexQuery) {
    try {
      const [hasFilters, filters] = getBooksFilters(query);

      const where: Prisma.BookWhereInput = {};

      if (hasFilters && filters.length > 0) {
        where.OR = filters;
      }

      const books = await prisma.book.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      });

      return books;
    } catch (error) {
      throw error;
    }
  }

  static async show(where: Prisma.BookWhereUniqueInput) {
    try {
      const book = await prisma.book.findUnique({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!book) {
        throw new NotFoundException("Kitap bulunamadı");
      }
      return book;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "find");
      throw error;
    }
  }

  static async store(
    payload: BookCreatePayload,
    authorizationHeader: string | undefined
  ) {
    try {
      const userId = await this.getUserIdFromAuthHeader(authorizationHeader);
      const bookData = await this.prepareBookPayloadForCreate(payload);
      const book = await prisma.book.create({
        data: {
          ...bookData,
          addedBy: {
            connect: { id: userId },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return book;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "create");
      throw error;
    }
  }

  static async update(id: string, payload: BookUpdatePayload) {
    try {
      const updateData = await this.prepareBookPayloadForUpdate(payload);

      if (Object.keys(updateData).length === 0) {
        const currentBook = await this.show({ id });
        return currentBook;
      }

      const updatedBook = await prisma.book.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return updatedBook;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<Book> {
    try {
      const deletedBook = await prisma.book.delete({
        where: { id },
      });
      return deletedBook;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "delete");
      throw error;
    }
  }

  /**
   * Belirli bir yazarın kitaplarını listele
   */
  static async getBooksByAuthor(authorId: string) {
    try {
      const books = await prisma.book.findMany({
        where: { authorId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      });
      return books;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "find");
      throw error;
    }
  }

  /**
   * Belirli bir kategorideki kitapları listele
   */
  static async getBooksByCategory(categoryId: string) {
    try {
      const books = await prisma.book.findMany({
        where: { categoryId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      });
      return books;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "find");
      throw error;
    }
  }

  /**
   * Belirli bir yayınevinin kitaplarını listele
   */
  static async getBooksByPublisher(publisherId: string) {
    try {
      const books = await prisma.book.findMany({
        where: { publisherId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      });
      return books;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "find");
      throw error;
    }
  }

  /**
   * ISBN numarasına göre kitap bul
   */
  static async findByIsbn(isbn: string) {
    try {
      const book = await prisma.book.findUnique({
        where: { isbn },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          publisher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return book;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book", "find");
      throw error;
    }
  }
}
