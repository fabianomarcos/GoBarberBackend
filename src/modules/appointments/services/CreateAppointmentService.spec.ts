import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import { getMonth } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

const month = getMonth(Date.now()) + 1;

beforeEach(() => {
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  fakeNotificationRepository = new FakeNotificationsRepository();
  fakeCacheProvider = new FakeCacheProvider();

  createAppointment = new CreateAppointmentService(
    fakeAppointmentsRepository,
    fakeNotificationRepository,
    fakeCacheProvider,
  );
});

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, month, 10, 12).getTime();
    });

    const appointment = await fakeAppointmentsRepository.create({
      date: new Date(2020, month, 10, 13),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, month, 25, 10);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to return error when do not exiting appointment_id', async () => {
    const appointmentDate = new Date(2020, month, 25, 10);

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, month, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, month, 10, 11),
        user_id: '123123',
        provider_id: '123123',
      }),
    );
  });

  it('should not be able to create an appointment with same user provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, month, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, month, 10, 11),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    );
  });

  it('should not be able to create an appointment before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, month, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, month, 10, 9),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, month, 10, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
