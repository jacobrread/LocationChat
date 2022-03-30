import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatRoomId: number;

  @Column()
  userId: number;

  @Column()
  contents: string;

  @Column()
  userName: string;
}
