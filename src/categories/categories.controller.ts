import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoriesValidationParametersPipe } from './pipes/categories-validation-parameters.pipe';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoriesService } from './categories.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  @UsePipes(ValidationPipe)
  async getCategory(
    @Param('_id', CategoriesValidationParametersPipe) _id: string,
  ): Promise<Category> {
    return this.categoriesService.getCategory(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('_id', CategoriesValidationParametersPipe) _id: string,
  ): Promise<boolean> {
    return this.categoriesService.updateCategory(_id, updateCategoryDto);
  }

  @Post('/:_idCategory/players/:_idPlayer')
  async assignCategoryToPlayer(@Param() params: string[]): Promise<boolean> {
    return this.categoriesService.assignCategoryToPlayer(params);
  }

  @Delete('/:_id')
  @UsePipes(ValidationPipe)
  async deleteCategory(
    @Param('_id', CategoriesValidationParametersPipe) _id: string,
  ): Promise<boolean> {
    return this.categoriesService.deleteCategory(_id);
  }
}
