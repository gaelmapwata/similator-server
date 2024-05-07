import {
  Table, Column, Model, BelongsTo, ForeignKey,
} from 'sequelize-typescript';
import User from './User';

@Table({
  tableName: 'penalties',
  timestamps: true,
  paranoid: true,
})
export default class Penalty extends Model {
  static fillable = [
    'company',
    'amount',
    'userId',
    'datePenalty',
  ];

  @Column
    company!: string;

  @Column
    amount!: number;

  @Column
    datePenalty!: Date;

  @ForeignKey(() => User)
  @Column
    userId!: number;

  @BelongsTo(() => User)
    user!: User;
}
