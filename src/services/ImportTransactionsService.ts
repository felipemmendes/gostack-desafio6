import { Readable } from 'stream';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  csvReadStream: Readable;
}

interface TransactionRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ csvReadStream }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const parsers = csvParse({
      from_line: 2,
      ltrim: true,
    });

    const parseCSV = csvReadStream.pipe(parsers);
    const transactionsToCreate: Array<TransactionRequest> = [];

    parseCSV.on('data', async line => {
      const [lineTitle, lineType, lineValue, lineCategory] = line;

      const transaction = {
        title: lineTitle,
        type: lineType,
        value: lineValue,
        category: lineCategory,
      };

      transactionsToCreate.push(transaction);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const transactions: Transaction[] = [];

    async function createTransactions(
      transactionsArray: TransactionRequest[],
    ): Promise<void> {
      // eslint-disable-next-line no-restricted-syntax
      for (const transaction of transactionsArray) {
        const { title, type, value, category } = transaction;

        // eslint-disable-next-line no-await-in-loop
        const response = await createTransaction.execute({
          title,
          type,
          value,
          category,
        });

        transactions.push(response);
      }
    }

    await createTransactions(transactionsToCreate);

    return transactions;
  }
}

export default ImportTransactionsService;
