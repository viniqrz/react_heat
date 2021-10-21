import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

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

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('message', (message: Message) => {
  messagesQueue.push(message);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((prevState) =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
        );
      }
      messagesQueue.shift();
    }, 3000);
  }, []);

  useEffect(() => {
    api.get<Response>('messages/last3').then(({ data }) => {
      setMessages(data.messages);
    });
  }, []);

  console.log(messages);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(({ text, user }, i) => (
          <li key={i} className={styles.message}>
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
