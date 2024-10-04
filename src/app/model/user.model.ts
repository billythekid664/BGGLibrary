export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  provider: string;
  gameList?: Array<{
    id: string;
    name: string;
  }>;
}
