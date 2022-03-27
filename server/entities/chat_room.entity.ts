import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  roomkey: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;
}
