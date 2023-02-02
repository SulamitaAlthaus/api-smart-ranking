import { CategoriesValidationParametersPipe } from './pipes/categories-validation-parameters.pipe';
import { CreateCategoryDto } from './dtos/create-categoy.dto';
import { CategoriesService } from './categories.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get('/:_id')
  async getCategory(
    @Param('_id', CategoriesValidationParametersPipe) _id: string,
  ): Promise<Category> {
    return this.categoriesService.getCategory(_id);
  }
}
