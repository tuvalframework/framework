import React, { createElement, Fragment } from "../../preact/compat";

import { Message } from '../types';
import isString from '../utils/isString';

export default (value: unknown): value is Message =>
  isString(value) || React.isValidElement(value as any);
