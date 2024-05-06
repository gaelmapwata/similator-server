import {
  Table, Column, Model, BelongsToMany, HasMany,
} from 'sequelize-typescript';
import Role from './Role';
import UserRole from './UserRole';
import Penalty from './Penalty';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  static fillable = ['email', 'password'];

  @Column
    email!: string;

  @Column
    password!: string;

  @BelongsToMany(() => Role, () => UserRole)
    roles!: Role[];

  @HasMany(() => Penalty)
    penalties!: Penalty[];
}
