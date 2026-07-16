export interface User {
  id: string;
  name: string;
  email: string;
}

export interface StoredAccount extends User {
  password: string;
}
