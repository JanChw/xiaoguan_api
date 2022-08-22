export interface User {
  id?: number;
  name?: string;
  phone: string;
  password: string;
}

export interface UserQuery {
  content?: string;

  page?: string;

  size?: string;

  order?: string;
}
