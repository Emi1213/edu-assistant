export const PageStatus = { DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED' } as const;
export type PageStatus = typeof PageStatus[keyof typeof PageStatus];

export interface IPage {
  id: number;
  title: string;
  content: string;
  slug: string;
  order: number;
  moduleId: number;
  status?: PageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePage {
  title: string;
  content: string;
  moduleId: number;
  slug?: string;
  order?: number;
  status?: PageStatus;
}

export type IUpdatePage = Partial<ICreatePage>;

export interface IReorderPages {
  id: number;
  order: number;
}

export interface IPageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  moduleId?: number;
}
