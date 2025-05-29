import { User } from "@prisma/client";
import { BaseFormatter } from "@utils/base-formatter";
import { userResponseSchema } from "./dtos";
import { UserShowResponse } from "./types";

export abstract class UserFormatter {
  static response(data: User) {
    const convertedData = BaseFormatter.convertData<UserShowResponse>(
      data,
      userResponseSchema
    );

    return convertedData;
  }
}
