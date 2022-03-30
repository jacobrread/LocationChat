import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';
// import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
// import { map } from 'lodash';

// mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2JyZWFkIiwiYSI6ImNsMTZzNHdpcjE2N2Ezam9kNDJ0NnZ0OTQifQ.ZYf-p5cCBSBz6RXbEsWTDw';

export const Home = () => {
  const api = useContext(ApiContext);
  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [errorMessage, getErrorMessage] = useState(false);
  const [validRooms, setValidRooms] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

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
  //     zoom: 9, // starting zoom
  //   });
  // });

  // Get user's current position
  navigator.geolocation.getCurrentPosition((location) => {
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  });

  // Methods to calculate distance between user and a chatRoom
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

  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);

    let roomsWithinDistance = [];
    chatRooms.forEach((room) => {
      const distance = getDistance(lat, long, room.latitude, room.longitude);
      // range of 5 kilometers
      if (distance <= 5) {
        roomsWithinDistance.push(room);
      }
    });

    setValidRooms(roomsWithinDistance);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  //
  // TODO Why is my createRoom returning a 500 error?
  //
  const createRoom = async () => {
    const { chatRoom } = await api.post('/chat_rooms', { name, latitude, longitude });
    setChatRooms([...validRooms, chatRoom]);
    setName('');
  };

  return (
    <div className="p-4">
      <div className="topnav flex">
        <h1 className="flex-1 user">Welcome {user.firstName}</h1>
        <div className="flex-2">
          <input className="cht-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={createRoom} className="button">
            Create Room
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="main-column">
          <h2 className="top-space">Avaiable Chat Rooms:</h2>
          <div className="card">
            {validRooms.map((chatRoom) => (
              <div key={chatRoom.id}>
                <Link to={`/chat_rooms/${chatRoom.id}`}>{chatRoom.name}</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="side-column">
          <div className="top-space"></div>
          <p>{errorMessage}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Amet venenatis urna cursus eget. Platea dictumst vestibulum rhoncus est pellentesque.
            Egestas integer eget aliquet nibh praesent tristique magna sit amet. Ipsum dolor sit amet consectetur
            adipiscing. Viverra suspendisse potenti nullam ac tortor. Ut venenatis tellus in metus vulputate eu
            scelerisque. Odio facilisis mauris sit amet massa vitae. Adipiscing at in tellus integer feugiat scelerisque
            varius morbi enim. Odio aenean sed adipiscing diam donec. Nulla pellentesque dignissim enim sit amet
            venenatis urna cursus. Eu ultrices vitae auctor eu. Lectus quam id leo in. Vel orci porta non pulvinar neque
            laoreet suspendisse interdum. Venenatis tellus in metus vulputate eu scelerisque felis. Sapien nec sagittis
            aliquam malesuada bibendum arcu. Tempus imperdiet nulla malesuada pellentesque elit. Morbi tristique
            senectus et netus et malesuada fames ac. Senectus et netus et malesuada fames ac turpis egestas integer.
            Ultricies integer quis auctor elit sed vulputate mi. Sapien faucibus et molestie ac feugiat sed lectus
            vestibulum mattis. At ultrices mi tempus imperdiet nulla. In ornare quam viverra orci sagittis eu volutpat
            odio facilisis. Et tortor consequat id porta nibh venenatis cras. Tristique nulla aliquet enim tortor. Dui
            sapien eget mi proin sed libero enim sed. In egestas erat imperdiet sed euismod nisi. Sagittis aliquam
            malesuada bibendum arcu vitae. Malesuada nunc vel risus commodo viverra. Dolor morbi non arcu risus quis
            varius quam. Gravida quis blandit turpis cursus in hac habitasse platea dictumst. Vel fringilla est
            ullamcorper eget nulla. Ornare suspendisse sed nisi lacus sed viverra tellus. Nec feugiat in fermentum
            posuere. Suspendisse interdum consectetur libero id faucibus nisl. Non nisi est sit amet facilisis magna
            etiam. Consequat ac felis donec et odio pellentesque diam volutpat commodo. Eleifend donec pretium vulputate
            sapien nec sagittis aliquam malesuada bibendum. Volutpat sed cras ornare arcu dui. Turpis nunc eget lorem
            dolor sed. Diam maecenas sed enim ut sem viverra aliquet eget sit.
          </p>
        </div>
      </div>
    </div>
  );
};
