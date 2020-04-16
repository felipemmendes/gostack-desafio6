import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  category: string;
}

interface Response {
  category_id: string;
}

class CreateCategoryService {
  public async execute({ category }: Request): Promise<Response> {
    const categoriesRepository = getRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (checkCategoryExists) {
      const category_id = checkCategoryExists.id;

      return { category_id };
    }

    const newCategory = categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(newCategory);

    const category_id = newCategory.id;

    return { category_id };
  }
}

export default CreateCategoryService;
