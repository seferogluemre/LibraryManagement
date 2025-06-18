import Elysia from "elysia";
import {
  publisherCreateDto,
  publisherDestroyDto,
  publisherIndexDto,
  publisherShowDto,
  publisherUpdateDto,
} from "./dtos";
import { PublisherFormatter } from "./formatters";
import { PublisherService } from "./service";

export const app = new Elysia({
  prefix: "/publishers",
  name: "Publisher",
  detail: {
    tags: ["Publishers"],
  },
})
  .post(
    "",
    async ({ body }) => {
      const publisher = await PublisherService.store(body);
      return PublisherFormatter.createResponse(publisher);
    },
    publisherCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const publishers = await PublisherService.index(query);
      return publishers.map((publisher) =>
        PublisherFormatter.responseWithBooks(publisher)
      );
    },
    publisherIndexDto
  )
  .get(
    "/:id",
    async ({ params }) => {
      const publisher = await PublisherService.show({ id: params.id });
      return PublisherFormatter.responseWithBooks(publisher);
    },
    publisherShowDto
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const publisher = await PublisherService.update(params.id, body);
      return PublisherFormatter.responseWithBooks(publisher);
    },
    publisherUpdateDto
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const publisher = await PublisherService.destroy(params.id);
      return {
        message: "Yayıncı başarıyla silindi",
      };
    },
    publisherDestroyDto
  );
