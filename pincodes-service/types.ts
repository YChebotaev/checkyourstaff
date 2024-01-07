export type CreateBody = {
  tenantId: string;
  payload: any;
};

export type CreateData = {
  code: string;
};

export type GetBody = {
  tenantId: string;
  code: string;
};

export type GetData<P> = {
  payload: P;
};
