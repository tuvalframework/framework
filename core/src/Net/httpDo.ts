declare var fetchJsonp: Function;
import { FileDownloader } from './FileDownloader';

export function httpDo(url: string,  method?: string, callbackFunc?: Function): Promise<any> {
  var type: any;
  var callback;
  var errorCallback;
  var request;
  var promise;
  var jsonpOptions: any = {};
  var cbCount = 0;
  var contentType =  'text/plain';
  // Trim the callbacks off the end to get an idea of how many arguments are passed
  for (var i = arguments.length - 1; i > 0; i--) {
    if (typeof arguments[i] === 'function') {
      cbCount++;
    } else {
      break;
    }
  }
  // The number of arguments minus callbacks
  var argsCount = arguments.length - cbCount;
  var path = arguments[0];
  if (
    argsCount === 2 &&
    typeof path === 'string' &&
    typeof arguments[1] === 'object'
  ) {
    // Intended for more advanced use, pass in Request parameters directly
    request = new Request(path, arguments[1]);
    callback = arguments[2];
    errorCallback = arguments[3];
  } else {
    // Provided with arguments
    method = 'GET';
    var data;

    for (var j = 1; j < arguments.length; j++) {
      var a = arguments[j];
      if (typeof a === 'string') {
        if (a === 'GET' || a === 'POST' || a === 'PUT' || a === 'DELETE') {
          method = a;
        } else if (
          a === 'json' ||
          a === 'jsonp' ||
          a === 'binary' ||
          a === 'arrayBuffer' ||
          a === 'xml' ||
          a === 'text' ||
          a === 'table'
        ) {
          type = a;
        } else {
          data = a;
        }
      } else if (typeof a === 'number') {
        data = a.toString();
      } else if (typeof a === 'object') {
        if (a.hasOwnProperty('jsonpCallback')) {
          for (var attr in a) {
            jsonpOptions[attr] = a[attr];
          }
        } /* else if (a instanceof p5.XML) {
            data = a.serialize();
            contentType = 'application/xml';
          } */ else {
          data = JSON.stringify(a);
          contentType = 'application/json';
        }
      } else if (typeof a === 'function') {
        if (!callback) {
          callback = a;
        } else {
          errorCallback = a;
        }
      }
    }

    request = new Request(path, {
      method: method,
      mode: 'cors',
      body: data,
      headers: new Headers({
        'Content-Type': contentType
      })
    });
  }
  // do some sort of smart type checking
  if (!type) {
    if (path.indexOf('json') !== -1) {
      type = 'json';
    } else if (path.indexOf('xml') !== -1) {
      type = 'xml';
    } else {
      type = 'text';
    }
  }

  if (type === 'jsonp') {
    promise = fetchJsonp(path, jsonpOptions);
  } else {
    promise = fetch(request);
  }
  promise = promise.then(function (res: any) {
    if (!res.ok) {
      var err: any = new Error(res.body);
      err.status = res.status;
      err.ok = false;
      throw err;
    } else {
      var fileSize = res.headers.get('content-length');
      if (fileSize && fileSize > 64000000) {
        // p5._friendlyFileLoadError(7, path);
        new Error('File too big.');
      }
      switch (type) {
        case 'json':
        case 'jsonp':
          return res.json();
        case 'binary':
          return res.blob();
        case 'arrayBuffer':
          return res.arrayBuffer();
        case 'xml':
          return res.text().then(function (text: any) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(text, 'text/xml');
            return undefined;
          });
        default:
          return res.text();
      }
    }
  });
  promise.then(callback || function () { });
  promise.catch(errorCallback || console.error);
  return promise;
}


export class Http {
  public static async Json<T>(url: string): Promise<T> {
    return httpDo(url).then(response => {
      return JSON.parse(response);
    });
  }
  public static async Text(url: string): Promise<string> {
    return httpDo(url).then(response => {
      return response;
    });
  }
  public static async JS(url: string): Promise<string> {
    return httpDo(url).then(response => {
      return response;
    });
  }
  public static async Binary(url: string): Promise<string> {
    /* return httpDo(url,'GET','binary' as any).then(response => {
      return response;
    }); */
    return new Promise((resolve, reject) => {
      (new FileDownloader({
        url: url,
      }) as any).then(function (e) {
        resolve(e.request.response);
      })
        .catch(function (error) {
          reject(error);
        });
    });

  }
  public static async Do(url: string): Promise<Response> {
    return fetch(url);
  }
}