//json models returned by the fastapi backend

//matches the AccountRead pydantic model (/accounts endpoints)
export type Account = {
  userId: number
  id: number;
  name: string;
};
