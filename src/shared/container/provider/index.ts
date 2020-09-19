import { container } from 'tsyringe';

import DiskStorageProvider from './StoragedProviders/implementations/DiskStorageProvider';
import IStorageProvider from './StoragedProviders/models/IStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
