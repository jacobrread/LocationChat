import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsController } from 'server/controllers/chat_room.controller';
import { ChatRoom } from 'server/entities/chat_room.entity';
import { ChatRoomsService } from 'server/providers/services/chat_room.service';
import { JwtService } from 'server/providers/services/jwt.service';
import { GuardUtil } from 'server/providers/util/guard.util';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom])],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, JwtService, GuardUtil],
  exports: [],
})
export class ChatRoomsModule {}
