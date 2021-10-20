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
};

type AuthProvider = {
  children: ReactNode;
};

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

    localStorage.setItem('@dowhile:token', token);

    console.log(response.data, githubCode);

    setUser(responseUser);
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, code] = url.split('?code=');

      signIn(code);

      window.history.pushState({}, '', urlWithoutCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInUrl }}>
      {children}
    </AuthContext.Provider>
  );
}
