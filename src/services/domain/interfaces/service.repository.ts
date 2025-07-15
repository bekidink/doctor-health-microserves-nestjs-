import { Service } from '../entities/service.entity';

export interface ServiceRepository {
  findById(id: string): Promise<Service | null>;
  findByCode(code: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  save(service: Service): Promise<void>;
  update(service: Service): Promise<void>;
}
