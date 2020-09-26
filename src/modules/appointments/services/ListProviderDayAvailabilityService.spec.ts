import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    hours.map(async hour => {
      await fakeAppointmentsRepository.create({
        provider_id: 'user',
        date: new Date(2020, 4, 20, hour - 3, 0, 0),
      });
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    const results = [
      { available: true, hour: 8 },
      { available: true, hour: 9 },
      { available: true, hour: 10 },
    ];

    expect(availability).toEqual(expect.arrayContaining(results));
  });
});
