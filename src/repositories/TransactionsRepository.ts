import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find({ select: ['type', 'value'] });
    const { income, outcome } = transactions.reduce(
      (accumulator, { type, value }) => {
        switch (type) {
          case 'income':
            accumulator.income += Number(value);
            break;
          case 'outcome':
            accumulator.outcome += Number(value);
            break;

          default:
            break;
        }
        return accumulator;
      },
      { income: 0, outcome: 0 },
    );

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
