import { createContext, useEffect, useState, ReactNode } from 'react';

import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

type AuthProvider = {
  children: ReactNode;
};

type ProfileResponse = {
  user: User;
};

const LOCAL_STORAGE_TOKEN_KEY = '@dowhile:token';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl =
    'https://github.com/login/oauth/authorize?scope=user&client_id=cb3c088c77423e250b9b';

  async function signIn(githubCode: string): Promise<void> {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user: responseUser } = response.data;

    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

    setUser(responseUser);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<ProfileResponse>('profile').then(({ data }) => {
        setUser(data.user);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [, code] = url.split('?code=');
      const [baseUrl] = url.split('signin');

      signIn(code);

      window.history.pushState({}, '', baseUrl);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
