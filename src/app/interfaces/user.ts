export interface User {
  id: number;
  restaurantName: string;
  email: string;
}

export interface NewUser {
  restaurantName: string;
  email: string;
  password: string;
}