import { ApiPropertyOptions } from '@nestjs/swagger';

/** Regular string, just to make it more clear what type of string it is  */
export type UUID = string;
export type Email = string;

/** Provided object must have integer Id and can have any other fields */
export interface WithId {
    id: number;
    [key: string]: any;
}

/** Provided object must have uuid as id and any other fields */
export interface WithUuid {
    id: UUID;
    [key: string]: any;
}

/*
 * Generic type for creating const objects for dto and entities
 * that provides swagger api properties options metadata
 * (such as 'description' and 'example') in separated *-swagger.constant.ts files.
 * It makes our dto and entities more cleaner!
 */
export type SwaggerDoc<T> = { [P in keyof T]?: ApiPropertyOptions };
