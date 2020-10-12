import { getMonth, getYear } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

const nextMonth = getMonth(Date.now()) + 1;
const year = getYear(Date.now());

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    hours.map(async hour => {
      await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(year, nextMonth, 20, hour - 3, 0, 0),
      });
    });

    hours.map(async hour => {
      await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(year, nextMonth, 1, hour - 3, 0, 0),
      });
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider',
      year,
      month: nextMonth + 1,
    });

    const results = [
      { available: false, day: 1 },
      { available: true, day: 2 },
      { available: true, day: 3 },
      { available: true, day: 4 },
      { available: true, day: 5 },
      { available: true, day: 6 },
      { available: true, day: 7 },
      { available: true, day: 8 },
      { available: true, day: 9 },
      { available: true, day: 10 },
      { available: true, day: 11 },
      { available: true, day: 12 },
      { available: true, day: 13 },
      { available: true, day: 14 },
      { available: true, day: 15 },
      { available: true, day: 16 },
      { available: true, day: 17 },
      { available: true, day: 18 },
      { available: true, day: 19 },
      { available: false, day: 20 },
      { available: true, day: 21 },
      { available: true, day: 22 },
      { available: true, day: 23 },
      { available: true, day: 24 },
      { available: true, day: 25 },
      { available: true, day: 26 },
      { available: true, day: 27 },
      { available: true, day: 28 },
      { available: true, day: 29 },
      { available: true, day: 30 },
      { available: true, day: 31 },
    ];

    const monthsWithoutThirtyOneDays: number[] = [1, 3, 5, 8, 10];
    if (monthsWithoutThirtyOneDays.includes(nextMonth)) {
      results.pop();
      if (monthsWithoutThirtyOneDays.includes(1)) {
        results.pop();
      }
    }

    expect(availability).toEqual(expect.arrayContaining(results));
  });
});
