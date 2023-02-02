import { CreateCategoryDto } from './dtos/create-categoy.dto';
import { Category } from './interfaces/category.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const findCategory = await this.categoryModel.findOne({ category }).exec();
    if (findCategory) {
      throw new BadRequestException(`Categoria ${category} já cadastrada`);
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async getCategory(_id): Promise<Category> {
    const categoryFind = await this.categoryModel.findOne({ _id }).exec();
    if (!categoryFind) {
      throw new NotFoundException('Categoria não encontrado.');
    }
    return categoryFind;
  }
}
