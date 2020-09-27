import { getMonth } from 'date-fns';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
const month = getMonth(Date.now()) + 1;

beforeEach(() => {
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
});

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, month, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
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
