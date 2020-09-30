import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../dtos/infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
