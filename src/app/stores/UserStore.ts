import { makeAutoObservable } from 'mobx';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

class UserStore {
  currentUser: User | null = null;
  users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Администратор',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  login(email: string, password: string) {
    // In a real app, this would make an API call
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
  }

  addUser(user: Omit<User, 'id'>) {
    const newUser = {
      ...user,
      id: crypto.randomUUID()
    };
    this.users.push(newUser);
  }

  updateUser(id: string, updates: Partial<Omit<User, 'id'>>) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      if (this.currentUser?.id === id) {
        this.currentUser = this.users[index];
      }
    }
  }

  removeUser(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    if (this.currentUser?.id === id) {
      this.currentUser = null;
    }
  }
}

export const userStore = new UserStore();