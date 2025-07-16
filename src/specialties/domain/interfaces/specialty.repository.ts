import { Specialty } from '../entities/specialty.entity';

export interface SpecialtyRepository {
  findByDoctorId(doctorId: string): Promise<Specialty[]>;
  findById(id: string): Promise<Specialty | null>;
  findByName(name: string): Promise<Specialty | null>;
  findAll(): Promise<Specialty[]>;
  save(specialty: Specialty): Promise<void>;
  update(specialty: Specialty): Promise<void>;
  assignToDoctor(specialtyId: string, doctorId: string): Promise<void>;
}
