import { container } from 'tsyringe';
import EtherealMailProvider from './MailProvider/implemantations/EtherealMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

import DiskStorageProvider from './StoragedProviders/implementations/DiskStorageProvider';
import IStorageProvider from './StoragedProviders/models/IStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider(),
);
