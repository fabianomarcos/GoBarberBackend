import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/provider/StoragedProviders/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeStorageProvider = new FakeStorageProvider();

  updateUserAvatar = new UpdateUserAvatarService(
    fakeUsersRepository,
    fakeStorageProvider,
  );
});

describe('UpdateUserAvatar', () => {
  it('should be able to change a new avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fabiano BIll Bill',
      email: 'FabianTwo@bill.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Fabiano Bill',
      email: 'FabianoMrc@bill.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
