/*! *****************************************************************************************************************************
Copyright (c) Tuvalsoft Corporation. All rights reserved.
*                                                                                                                               *
* ████████╗██╗   ██╗██╗   ██╗ █████╗ ██╗         ███████╗██████╗  █████╗ ███╗   ███╗███████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗ *
* ╚══██╔══╝██║   ██║██║   ██║██╔══██╗██║         ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝ *
*    ██║   ██║   ██║██║   ██║███████║██║         █████╗  ██████╔╝███████║██╔████╔██║█████╗  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝  *
*    ██║   ██║   ██║╚██╗ ██╔╝██╔══██║██║         ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ██║███╗██║██║   ██║██╔══██╗██╔═██╗  *
*    ██║   ╚██████╔╝ ╚████╔╝ ██║  ██║███████╗    ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗ *
*    ╚═╝    ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ *
*                                                                                                                               *
*                                                                                                                               *
* This file is part of Tuval Framework.                                                                                         *
* Copyright (c) Tuvalsoft 2018 All rights reserved.                                                                             *
*                                                                                                                               *
* Licensed under the GNU General Public License v3.0.                                                                           *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                                                                    *
* Tuval Framework Created By Tuvalsoft in 2018                                                                                  *
******************************************************************************************************************************@*/
import './Extensions/StringExtensions';
import './Extensions/NumberExtensions';
import'./Extensions/ArrayExtentions';
import'./Extensions/ObjectExtensions';
//import 'reflect-metadata';

export * from './SystemEvents';
export * from './Activator';
export * from './applyToDefaults';
export * from './as';

export * from './Storage';

export * from './assert';
// export * from './byte';
export * from './Char';
export * from './checkNotNull';
export * from './classNames';
export * from './clone';
export * from './cloneObject';
export * from './cloneWithShallow';
export * from './Compare';
export * from './CompareResult';
export * from './Constructor';
export * from './contain';
export * from './Conversion';
export * from './convert';
export * from './deepEqual';
export * from './Enum';
export * from './Environment';
export * from './error';
export * from './Event';
export * from './EventArgs';
export * from './EventHandler';
export * from './Exception';
export * from './extend';
export * from './flatten';
export * from './float';
export * from './foreach';
export * from './Functions';
export * from './FunctionTypes';
export * from './ICloneable';
export * from './IComparable';
export * from './IEquatable';
export * from './IFormatProvider';
export * from './IFormattable';
export * from './ILazy';
export * from './IMap';
export * from './initArray';
export * from './inlineType';
// export * from './integer';
// export * from './Interface';
export * from './is';
export * from './isBrowser';
export * from './isEqual';
export * from './isImplement';
export * from './isInDocument';
export * from './JSON';
export * from './KeyValueExtract';
export * from './KeyValuePair';
export * from './Lazy';
export * from './mapToObject';
export * from './merge';
export * from './nameof';
//export * from './ObservableValue';
export * from './optional';
export * from './Out';
export * from './prepareToStringify';
export * from './Primitive';
export * from './PropertyChangedEventArgs';
export * from './proto';
//export * from './Random';
export * from './reach';
export * from './ResolverBase';
export * from './shallow';
export * from './shalowExtend';
export * from './stringify';
export * from './SystemTypes';
export * from './toByte';
export * from './toChar';
export * from './toDouble';
export * from './toFloat';
export * from './toLong';
export * from './toShort';
export * from './trace';
export * from './TypeValidator';
export * from './TypeValue';
export * from './unique';
export * from './Void';
export * from './warn';

export * from './Collections';
export * from './Disposable';
export * from './Events';
export * from './Exceptions';
export * from './Math';
export * from './Reflection';
export * from './Context';

export * from './checkNotNull';



export * from './Extensions/TArray';
export * from './Extensions/TChar';
export * from './Extensions';
export * from './ThrowHelper';

export * from './Linq';
export * from './Text';
export * from './uuid/Guid';
export * from './moduleLoader/ModuleLoader';
export * from './Net';
export * from './Uri';
export * from './services';
//export * from './Observable';
export * from './Threading';

export * from './Time';
export * from './Time/__DateTime';
export * from './Timespan';
export * from './IO';
export * from './Compress';
export * from './Encoding';

export * from './Delegate';
export * from './Event';

export * from './Input';

export * from './Random';
export * from './Console';
export * from './IServiceProvider';

export * from './Locale';

//export * from './Geometry';

export * from './Parser/esprima';
export * from './Marshal';
export * from './sprintf';
export * from './resources_/ResourceManager';
export * from './IAsyncResult';

export * from './Int16';
export * from './Int32';

export * from './IServiceProvider';
export * from './Globalization';
export * from './Math/TNumber';
export * from './TimeZoneInfo';
export * from './Modulation';
export * from './Cryptography';
export * from './TVConsole';
export * from './PreLoad';
export * from './byte';
export * from './LazyValue';

export * from './BitConverter';

export * from './IOC';

export * from './Drivers';
export * from './Runtime/Runtime';
export * from './exportToGlobal';
export * from './Router';
export * from './moment/moment';

export * from './publish';

export * from './Net';
export * from './amqp';

import './exports';

import { ParseNumbers } from './ParseNumbers';
import { Context } from './Context/Context';




/*
export * from './byte';
export * from './Out';
export *  from  './as';
export * from './type';
export * from './isImplement';
export * from './is';
export * from './nameof';
export * from './foreach';
export * from './warn';
export * from './error';
export * from './isBrowser';
export * from './isEqual';
export * from './shalowExtend';
export * from './Void';
export * from './Enum';
export * from './Event';
export * from './EventArgs';
export * from './clone';
export * from './assert';
export * from './merge';
export * from './proto';
export * from './flatten';
export * from './applyToDefaults';
export * from './mapToObject';
export * from './deepEqual';
export * from './reach';
export * from './contain';
export * from './shallow';
export * from './Optional';
export * from './ScrollEventHandler';
export * from './EventHandler';
export * from './classNames';
export * from './trace';
export * from './PropertyChangedEventArgs';

export * from './ObservableValue';
export * from './isInDocument';

export * from './Text/capitalize';

export * from './IO';
export * from './Net/httpDo';
export * from './Net/import';

export * from './Events/index';
export * from './Math';

import './Extensions/StringExtensions';
import'./Extensions/ArrayExtentions';
import'./Extensions/ObjectExtensions';

export * from './exceptions/index';
export * from "./reflection/index";
export * from "./windows/Forms/index";
 */

console.log('son test');


export const MainCoreModule = {
    /* __init__: ['eventBus',
        'global',
        'mouse',
        'input',
        'keyboardPP',
        'tickerPP',
        'timerPP',
        'routerPP'
    ], */
    ParseNumbers: ['value', ParseNumbers],

}

Context.Current.addModules([MainCoreModule]);