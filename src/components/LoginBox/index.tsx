import { useEffect } from 'react';

import { VscGithubInverted } from 'react-icons/vsc';
import styles from './styles.module.scss';

import { api } from '../../services/api';

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    avatar_url: string;
  };
};

export function LoginBox() {
  const signInUrl =
    'https://github.com/login/oauth/authorize?scope=user&client_id=cb3c088c77423e250b9b';

  async function signIn(githubCode: string): Promise<void> {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token);
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, code] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);
    }
  }, []);

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" />
        Entrar com Github
      </a>
    </div>
  );
}
