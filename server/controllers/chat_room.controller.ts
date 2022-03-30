import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatRoom } from 'server/entities/chat_room.entity';
import { ChatRoomsService } from 'server/providers/services/chat_room.service';
import * as crypto from 'crypto';

class ChatRoomBody {
  name: string;
  lat: number;
  long: number;
}

@Controller()
export class ChatRoomsController {
  constructor(private chatRoomsService: ChatRoomsService) {}

  @Get('/chat_rooms')
  async index() {
    const chatRooms = await this.chatRoomsService.findAll();
    return { chatRooms };
  }

  @Get('/chat_rooms/:id')
  async show(@Param('id') id: string) {
    const chatRoom = await this.chatRoomsService.findOne(parseInt(id));
    return { chatRoom };
  }

  @Post('/chat_rooms')
  async create(@Body() body: ChatRoomBody) {
    let chatRoom = new ChatRoom();
    chatRoom.name = body.name;
    chatRoom.roomkey = crypto.randomBytes(8).toString('hex');
    chatRoom.latitude = body.lat;
    chatRoom.longitude = body.long;
    chatRoom = await this.chatRoomsService.create(chatRoom);
    return { chatRoom };
  }

  // @Post('/chat_rooms')
  // async create(@Body() body: ChatRoomBody) {
  //   let chatRoom = new ChatRoom();
  //   chatRoom.name = body.name;
  //   chatRoom.roomkey = crypto.randomBytes(8).toString('hex');

  //   const roomLocation = (location) => {
  //     chatRoom.latitude = location.coords.latitude;
  //     chatRoom.longitude = location.coords.longitude;
  //   };
  //   navigator.geolocation.getCurrentPosition(roomLocation);

  //   chatRoom = await this.chatRoomsService.create(chatRoom);
  //   return { chatRoom };
  // }
}
