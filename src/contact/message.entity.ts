import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  servicio: string;

  @Column('text')
  mensaje: string;

  @CreateDateColumn()
  created_at: Date;
}
