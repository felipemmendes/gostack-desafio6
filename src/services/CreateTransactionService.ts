import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checkCategory = new CreateCategoryService();
    const checkCategoryResponse = await checkCategory.execute({ category });

    const { category_id } = checkCategoryResponse;

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Insuficient funds', 400);
      }
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

// import { getCustomRepository } from 'typeorm';

// import AppError from '../errors/AppError';
// import Transaction from '../models/Transaction';
// import TransactionsRepository from '../repositories/TransactionsRepository';

// interface Request {
//   title: string;
//   type: 'income' | 'outcome';
//   value: number;
//   category_id: string;
// }

// class CreateTransactionService {
//   public async execute({
//     title,
//     type,
//     value,
//     category_id,
//   }: Request): Promise<Transaction> {
//     const transactionsRepository = getCustomRepository(TransactionsRepository);

//     if (type === 'outcome') {
//       const balance = await transactionsRepository.getBalance();

//       if (value > balance.total) {
//         throw new AppError('Insuficient funds', 400);
//       }
//     }

//     const transaction = transactionsRepository.create({
//       title,
//       type,
//       value,
//       category_id,
//     });

//     await transactionsRepository.save(transaction);

//     return transaction;
//   }
// }

// export default CreateTransactionService;
