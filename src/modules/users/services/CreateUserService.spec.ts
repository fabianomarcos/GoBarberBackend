import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvide: FakeHashProvider;
let createUser: CreateUserService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeHashProvide = new FakeHashProvider();

  createUser = new CreateUserService(fakeUsersRepository, fakeHashProvide);
});

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Fabiano Bill',
      email: 'Fabiano@bill.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Fabiano Bill',
      email: 'Fabiano@bill.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Fabiano Bill',
        email: 'Fabiano@bill.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
