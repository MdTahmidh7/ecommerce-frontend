export interface DistrictsModel{
  id: string;
  name: string;
  bnName: string;
  url: string;
  divisionId: string; // Reference to the Division
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Optional field for soft delete
}
