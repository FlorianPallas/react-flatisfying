export interface User {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  price: number;
  users: User['id'][];
}

export type Splits = { [userId: number]: number };
