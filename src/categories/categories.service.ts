import { PlayersService } from './../players/players.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
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
    private readonly playersService: PlayersService,
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
    return await this.categoryModel.find().populate('players').exec();
  }
  async getPlayerCategory(player): Promise<Category> {
    return await this.categoryModel
      .findOne({
        players: {
          $elemMatch: { $eq: { _id: player } },
        },
      })
      .exec();
  }

  async getCategory(_id): Promise<Category> {
    const findCategory = await this.categoryModel.findOne({ _id }).exec();
    if (!findCategory) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return findCategory;
  }

  async updateCategory(
    _id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<boolean> {
    const findCategory = await this.categoryModel.findOne({ _id }).exec();
    if (!findCategory) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    const updateCategory = await this.categoryModel
      .findByIdAndUpdate({ _id }, { $set: updateCategoryDto })
      .exec();
    if (!updateCategory) {
      return false;
    }
    return true;
  }

  async assignCategoryToPlayer(params: string[]): Promise<boolean> {
    const _idCategory = params['_idCategory'];
    const _idPlayer = params['_idPlayer'];

    const findCategory = await this.categoryModel
      .findOne({ _id: _idCategory })
      .exec()
      .catch((err) => console.log(err));

    if (!findCategory) {
      throw new BadRequestException('Categoria não cadastrada');
    }

    const player = await this.playersService
      .getPlayer(_idPlayer)
      .catch((err) => console.log(err));

    if (!player) {
      throw new BadRequestException('Jogador não cadastrado');
    }

    const playerInCategory = findCategory.players.filter(
      (player) => player._id == _idPlayer,
    );

    if (playerInCategory.length > 0) {
      throw new BadRequestException('Jogador já cadastrado');
    }
    findCategory.players.push(_idPlayer);
    await findCategory.save();
    return true;
  }

  async deleteCategory(_id): Promise<boolean> {
    const categoryFind = await this.categoryModel
      .findByIdAndDelete({ _id })
      .exec();
    if (!categoryFind) {
      return false;
    }
    return true;
  }
}
