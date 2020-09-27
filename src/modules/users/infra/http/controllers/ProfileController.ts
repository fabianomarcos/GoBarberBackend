import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import UserMap from '@modules/appointments/automapper/UserMap';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.body.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({
      user_id,
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.body.user.id;
    const { name, email, oldPassword, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      oldPassword,
      password,
    });

    const userMapped = UserMap.toDTO(user);

    return response.json(userMapped);
  }
}
