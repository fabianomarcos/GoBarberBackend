import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = updateUserAvatar.execute({
      user_id: request.body.user.id, // conferir estava sem o body
      avatarFileName: request.file.filename,
    });

    return response.json({ ...user, password: '********' });
  }
}
