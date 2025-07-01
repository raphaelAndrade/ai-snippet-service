export interface MockUser {
    email: string;
    role: 'admin' | 'user';
    code: string;
  }
  
  export const mockUsers: MockUser[] = [
    { email: 'user1@example.com', role: 'user', code: '123456' },
    { email: 'user2@example.com', role: 'user', code: '123456' },
    { email: 'admin@example.com', role: 'admin', code: '123456' },
  ];
  