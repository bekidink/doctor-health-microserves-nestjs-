export interface CreateServiceDto {
  code: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  duration?: number;
}
