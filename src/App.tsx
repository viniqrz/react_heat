import styles from './App.module.scss';

import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { AuthProvider } from './contexts/auth';

export function App() {
  return (
    <main className={styles.contentWrapper}>
      <AuthProvider>
        <MessageList />
        <LoginBox />
      </AuthProvider>
    </main>
  );
}
