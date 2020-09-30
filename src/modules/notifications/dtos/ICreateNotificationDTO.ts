import { interface } from '../respositories/INotificationsRepository';

export default interface ICreateNotificationDTO {
  content: string;
  recipient_id: string;
}
