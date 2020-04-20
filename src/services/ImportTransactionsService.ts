import { getRepository, In, getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CsvTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const csvReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
      ltrim: true,
    });

    const parseCSV = csvReadStream.pipe(parsers);

    const CsvTransactions: CsvTransaction[] = [];
    const CsvCategories: string[] = [];

    parseCSV.on('data', async line => {
      const [lineTitle, lineType, lineValue, lineCategory] = line;

      if (!lineTitle || !lineType || !lineValue) {
        return;
      }

      const transaction = {
        title: lineTitle,
        type: lineType,
        value: lineValue,
        category: lineCategory,
      };

      CsvCategories.push(lineCategory);
      CsvTransactions.push(transaction);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(CsvCategories),
      },
    });

    const existentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    );

    const categoriesToCreate = CsvCategories.filter(
      category => !existentCategoriesTitle.includes(category),
    ).filter((value, index, self) => self.indexOf(value) === index);

    const categories = categoriesRepository.create(
      categoriesToCreate.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(categories);

    const allCategories = [...categories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      CsvTransactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: allCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
