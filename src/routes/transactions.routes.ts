import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);

  // const { title, value, type, category } = request.body;

  // const checkCategory = new CreateCategoryService();
  // const checkCategoryResponse = await checkCategory.execute({ category });

  // const { category_id } = checkCategoryResponse;

  // const createTransaction = new CreateTransactionService();
  // const transaction = await createTransaction.execute({
  //   title,
  //   type,
  //   value,
  //   category_id,
  // });

  // return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const checkId = new DeleteTransactionService();

  await checkId.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();

    const csvPath = path.join(uploadConfig.directory, request.file.filename);

    const transactions = await importTransaction.execute({
      csvReadStream: fs.createReadStream(csvPath),
    });

    await fs.promises.unlink(csvPath);

    return response.json(transactions);
  },
);

export default transactionsRouter;
