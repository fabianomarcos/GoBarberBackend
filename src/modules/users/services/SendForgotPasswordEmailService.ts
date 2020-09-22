import IMailProvider from '@shared/container/provider/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokenRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Usuário não existe.');
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(email, 'Pedido de recuperação de senha pedido.');
  }
}

export default SendForgotPasswordEmailService;
