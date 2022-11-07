export * from './IAppStoreService';
export * from './BrokerAppStoreService';
export * from './IAppStoreItem';
export * from './LocalAppStoreService'

import { instance as container } from '@tuval/core';
import { ControlTypes } from '../../windows/Forms/Components/ControlTypes';
import { BrokerAppStoreService } from './BrokerAppStoreService';
import { LocalAppStoreService } from './LocalAppStoreService';

// container.register(ControlTypes.IAppStoreService, { useValue: new LocalAppStoreService() });