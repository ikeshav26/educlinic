import { create } from 'zustand';
import axios from 'axios';

export interface UserStore {
  user: any;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: any) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  fetchUser: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          withCredentials: true,
        }
      );
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
