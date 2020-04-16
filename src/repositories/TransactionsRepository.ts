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
    const transactionsReduced = transactions.reduce(
      (accumulator, { type, value }) => ({
        ...accumulator,
        [type]: accumulator[type] + value,
      }),
      { income: 0, outcome: 0 },
    );

    const { income, outcome } = transactionsReduced;

    const balance = {
      ...transactionsReduced,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
