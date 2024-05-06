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
    'amountDividedBy2',
    'amountDividedBy4',
    'amountDividedBy6',
    'resultPercent25',
    'resultPercent50',
    'resultPercent75',
    'userId',
    'datePenalty',
  ];

  @Column
    company!: string;

  @Column
    amount!: number;

  @Column
    amountDividedBy2!: number;

  @Column
    amountDividedBy4!: number;

  @Column
    amountDividedBy6!: number;

  @Column
    resultPercent25!: number;

  @Column
    resultPercent50!: number;

  @Column
    resultPercent75!: number;

  @Column
    datePenalty!: Date;

  @ForeignKey(() => User)
  @Column
    userId!: number;

  @BelongsTo(() => User)
    user!: User;
}
