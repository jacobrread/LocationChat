import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JyZWFkIiwiYSI6ImNsMTZzNHdpcjE2N2Ezam9kNDJ0NnZ0OTQifQ.ZYf-p5cCBSBz6RXbEsWTDw';

export const Home = () => {
  const api = useContext(ApiContext);
  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [validRooms, setValidRooms] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [saving, setSaving] = useState(false);
  const [inputError, setInputError] = useState('');

  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);

    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      zoom: 9, // starting zoom
    });

    // map.on('click', () => {
    //   marker.getElement().onClick = () => {
    //     console.log('you clicked it');
    //   };
    // });

    navigator.geolocation.getCurrentPosition(
      (myLocation) => {
        chatRooms.forEach((room) => {
          const marker = new mapboxgl.Marker({});
          marker.setLngLat([room.longitude, room.latitude]);
          marker.addTo(map);
        });

        map.flyTo({
          center: [myLocation.coords.longitude, myLocation.coords.latitude],
        });
        setLatitude(myLocation.coords.latitude);
        setLongitude(myLocation.coords.longitude);

        const roomsWithinDistance = chatRooms.filter((room) => {
          return (
            getDistance(room.latitude, room.longitude, myLocation.coords.latitude, myLocation.coords.longitude) <= 5
          );
        });

        setValidRooms(roomsWithinDistance);
      },
      (err) => {
        setErrorMessage(err);
      },
    );
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async () => {
    if (name === '') {
      setInputError('Chat Room name cannot be blank');
      return;
    }
    window.location.reload();

    setSaving(true);
    navigator.geolocation.getCurrentPosition(async (location) => {
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      const { chatRoom } = await api.post('/chat_rooms', {
        name,
        lat: location.coords.latitude,
        long: location.coords.longitude,
      });
      setChatRooms([...validRooms, chatRoom]);
      setName('');
      setSaving(false);
    });
  };

  // Functions to calculate distance between user and a chatRoom
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div className="p-4">
      <div className="topnav flex">
        <h1 className="flex-1 user">Welcome {user.firstName}</h1>
        <div className="flex-2">
          <input className="cht-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={createRoom} className="button" disabled={saving}>
            Create Room
          </Button>
        </div>
      </div>

      <div className="error">{inputError}</div>

      <div className="row">
        <div className="main-column">
          <h2>Avaiable Chat Rooms:</h2>
          <div className="card back-color">
            {validRooms.map((chatRoom) => (
              <div key={chatRoom.id} className="flex">
                <Link to={`/chat_rooms/${chatRoom.id}`} className="chat-room">
                  {chatRoom.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="side-column">
          <div id="map" className="fit card" />
          <p>{errorMessage}</p>
        </div>
      </div>
    </div>
  );
};
