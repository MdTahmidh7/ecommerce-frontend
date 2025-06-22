export interface UpazilaModel{
  id: string;
  name: string;
  bnName: string;
  url: string;
  districtId: string; // Reference to the District
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Optional field for soft delete
}
