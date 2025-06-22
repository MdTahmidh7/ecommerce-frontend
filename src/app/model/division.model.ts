export interface DivisionModel{
  id: string;
  name: string;
  bnName: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Optional field for soft delete
}
