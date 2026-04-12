import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Base Schemas for Data
export const ProvinceSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CitySchema = z.object({
  id: z.string(),
  provinceId: z.string(),
  name: z.string(),
});

export const DistrictSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
});

export const VillageSchema = z.object({
  id: z.string(),
  districtId: z.string(),
  name: z.string(),
});

// DTOs for the Clean Response Data
export class ProvinceDto extends createZodDto(ProvinceSchema) {}
export class CityDto extends createZodDto(CitySchema) {}
export class DistrictDto extends createZodDto(DistrictSchema) {}
export class VillageDto extends createZodDto(VillageSchema) {}

// Response Schemas for External API (Internal Use)
export const ProvincesResponseSchema = z.object({
  status: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.array(ProvinceSchema),
});

export const CitiesResponseSchema = z.object({
  status: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.array(CitySchema),
});

export const DistrictsResponseSchema = z.object({
  status: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.array(DistrictSchema),
});

export const VillagesResponseSchema = z.object({
  status: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.array(VillageSchema),
});

// Internal DTO types for HttpService
export type ProvincesResponse = z.infer<typeof ProvincesResponseSchema>;
export type CitiesResponse = z.infer<typeof CitiesResponseSchema>;
export type DistrictsResponse = z.infer<typeof DistrictsResponseSchema>;
export type VillagesResponse = z.infer<typeof VillagesResponseSchema>;
