export * from './IDesktopService';
export * from './LocalDesktopService';

import { instance as container } from '@tuval/core';
import { ControlTypes } from '../../windows/Forms/Components/ControlTypes';
import { LocalDesktopService } from './LocalDesktopService';

container.register(ControlTypes.IDesktopService, { useValue: new LocalDesktopService() });