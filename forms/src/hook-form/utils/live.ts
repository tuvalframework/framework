import { Form_Ref } from '../types';

import isHTMLElement from './isHTMLElement';

export default (ref: Form_Ref) => isHTMLElement(ref) && ref.isConnected;
