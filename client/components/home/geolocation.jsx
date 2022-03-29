import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';
import { useRef } from 'react/cjs/react.production.min';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { map } from 'lodash';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JyZWFkIiwiYSI6ImNsMTZzNHdpcjE2N2Ezam9kNDJ0NnZ0OTQifQ.ZYf-p5cCBSBz6RXbEsWTDw';

export const Home = () => {
  const [, setAuthToken] = useContext(AuthContext);
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [updates, setUpdates] = useState([]);
  const updatesRef = useRef([]);

  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (myLocation) => {
        console.log(myLocation);
      },
      (err) => {
        setErrorMessage(err);
      },
    );
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [myLocation.coords.longitude, myLocation.coords.latitude], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async () => {
    const { chatRoom } = await api.post('/chatrooms', { name });
    setChatRooms([...chatRooms, chatRoom]);
    setName('');
  };

  return (
    <div className="p-4">
      <h1>Welcome {user.firstName}</h1>
      <input style="shadowed" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={createRoom}>Create Room</Button>
      <div>
        {chatRooms.map((chatRoom) => (
          <div key={chatRoom.id}>
            <Link to={`/chat_rooms/${chatRoom.id}`}>{chatRoom.name}</Link>
          </div>
        ))}
      </div>
      <div>{map};</div>
    </div>
  );
};

// // Geolocation
// const [errorMessage, setErrorMessage] = useState(false);
// const [updates, setUpdates] = useState([]);
// const updatesRef = useRef([]);

// useEffect(() => {
//   navigator.geolocation.getCurrentPosition(
//     (myLocation) => {
//       console.log(myLocation);
//     },
//     (err) => {
//       setErrorMessage(err);
//     },
//   );
//   const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/streets-v11', // style URL
//     center: [myLocation.coords.longitude, myLocation.coords.latitude], // starting position [lng, lat]
//     zoom: 9 // starting zoom
//     });
// }

//   // THE OTHER (FASTER) OPTION IS:

//   const watch = navigator.geolocation.watchPosition(
//     (myLocation) => {
//       console.log(myLocation);
//       updatesRef.current.push(myLocation);
//       setUpdates([...updatesRef.current]);
//     },
//     (err) => {
//       setErrorMessage(err);
//     },
//   );

//   return () => {
//     navigator.geolocation.clearWatch(watch);
//   };
// }, []);

// return <div>{errorMessage && '. You need to allow the browser to use your location to use this application'}</div>;
