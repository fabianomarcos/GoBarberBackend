import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';

import { IAppointmentsRepository } from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cachedData = await this.cacheProvider.recover('key');

    console.log(cachedData);

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, year, month, day },
    );

    // await this.cacheProvider.save('chave', 'valor');

    return appointments;
  }
}

export default ListProviderAppointmentsService;
