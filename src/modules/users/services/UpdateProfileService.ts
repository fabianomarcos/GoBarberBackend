import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    const nonExistentEmail = userWithUpdateEmail?.id !== user_id;

    if (userWithUpdateEmail && nonExistentEmail) {
      throw new AppError('Este email já está em uso.');
    }

    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError('Você precisa informar a senha atual.');
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (checkOldPassword) {
        throw new AppError('A senha atual não confere.');
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
