import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);

  useEffect(async () => {
    const { user } = await api.get('/users/me');
    setUser(user);
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, []);

  if (loading) return 'Loading...';

  return (
    <div>
      <div className="cht-header flex">
        <div className="user">{chatRoom.name}</div>
        <Link to={'/'} className="link">
          Return to World
        </Link>
      </div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <h3>{message.userName}</h3>
            {message.contents}
            {console.log(messages)}
          </div>
        ))}
      </div>
      <div className="cht-footer flex">
        <input className="cht-input" type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button
          onClick={() => {
            sendMessage(contents, user);
            setContents('');
          }}
          className="cht-button"
        >
          Send
        </Button>
      </div>
    </div>
  );
};
