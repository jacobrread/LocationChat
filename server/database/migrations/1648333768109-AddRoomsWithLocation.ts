import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddRoomsWithLocation1648333768109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_room',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'roomkey',
            type: 'text',
            isUnique: true,
          },
          {
            name: 'latitude',
            type: 'float',
          },
          {
            name: 'longitude',
            type: 'float',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_room');
  }
}
