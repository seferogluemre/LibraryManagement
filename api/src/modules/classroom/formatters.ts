import { BaseFormatter } from "#utils/base-formatter";
import { Classroom } from "@prisma/client";
import { ClassroomShowResponse } from "./types";
import { classroomResponseSchema } from "./dtos";

export abstract class ClassroomFormatter {
    static response(data: Classroom) {
        const convertedData = BaseFormatter.convertData<ClassroomShowResponse>(
            data,
            classroomResponseSchema
        );
        return convertedData;
    }
}