import { getMonth } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;
const nextMonth = getMonth(Date.now()) + 1;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user',
      date: new Date(2020, nextMonth, 20, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user',

      date: new Date(2020, nextMonth, 20, 11, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, nextMonth, 20, 9).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'provider-id',
      year: 2020,
      month: nextMonth + 1,
      day: 20,
    });

    const results = [
      { available: false, hour: 8 },
      { available: false, hour: 9 },
      { available: true, hour: 10 },
      { available: false, hour: 11 },
      { available: true, hour: 12 },
      { available: true, hour: 13 },
      { available: true, hour: 14 },
      { available: true, hour: 15 },
      { available: true, hour: 16 },
      { available: false, hour: 17 },
    ];

    expect(availability).toEqual(expect.arrayContaining(results));
  });
});
