export interface IPage {
  id: number;
  moduleId: number;
  title: string;
  orderIndex: number | null;
  keywords: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
