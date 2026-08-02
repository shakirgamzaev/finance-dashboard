//json models returned by the fastapi backend

//matches the CategoryRead pydantic model (/categories endpoints)
export type Category = {
  userId: number;
  id: number;
  name: string;
};
