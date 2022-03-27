import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';
// import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
// import { map } from 'lodash';

// mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JyZWFkIiwiYSI6ImNsMTZzNHdpcjE2N2Ezam9kNDJ0NnZ0OTQifQ.ZYf-p5cCBSBz6RXbEsWTDw';

export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async () => {
    const { chatRoom } = await api.post('/chat_rooms', { name });
    setChatRooms([...chatRooms, chatRoom]);
    setName('');
  };

  return (
    <div className="p-4">
      <h1>Welcome {user.firstName}</h1>
      <div className="card">
        <input className="cht-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={createRoom}>Create Room</Button>
      </div>
      <div className="card">
        {chatRooms.map((chatRoom) => (
          <div key={chatRoom.id}>
            <Link to={`/chat_rooms/${chatRoom.id}`}>{chatRoom.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
