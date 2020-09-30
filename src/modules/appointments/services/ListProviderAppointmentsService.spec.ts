import { getMonth } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointment: ListProviderAppointmentsService;

const month = getMonth(Date.now()) + 1;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointment = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments with on a specific day', async () => {
    const appointmentOne = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, month, 20, 14, 0, 0),
    });

    const appointmentTwo = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, month, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointment.execute({
      provider_id: 'provider',
      year: 2020,
      month: month + 1,
      day: 20,
    });

    expect(appointments).toEqual([appointmentOne, appointmentTwo]);
  });
});
