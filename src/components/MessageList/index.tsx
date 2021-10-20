import { useState, useEffect } from 'react';

import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';

import { api } from '../../services/api';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

type Response = {
  messages: Message[];
};

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    api.get<Response>('messages/last3').then(({ data }) => {
      setMessages(data.messages);
    });
  });

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(({ id, text, user }) => (
          <li key={id} className={styles.message}>
            <p className={styles.messageContent}>{text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={user.avatar_url} alt={user.name} />
              </div>
              <span>{user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
