import { Context } from '../Context';
import { TVC_Files } from './TVC';
import { Filesystem_Application } from './Filesystem_Application';
export * from './TVC';
export * from './Screen';
export * from './TextConsole';
export * from './Umay';
export * from './Commands';
export * from './ImageBank';
export * from './TCOnsoleManifest';

export const TVCModule = {
    TVC_Files: ['value', TVC_Files],
    Filesystem_Application: ['value', Filesystem_Application],
}

Context.Current.addModules([TVCModule]);