import { Context } from "../Context";
import { EventBus } from "../Events";
import { TStorage } from "../Storage";
import { Http } from "../Net";
import { Dictionary } from "../Collections";
import { Guid } from '../uuid/Guid';
import { is } from "../is";
import { Export, exportToGlobal } from "../exportToGlobal";
import { Encoding } from '../Encoding/Encoding';
import { Convert } from '../convert';
import { TLoader } from '../PreLoad/TLoader';
import { TBuffer } from '../IO/Buffer/TBuffer';
import { TCompress } from "../Compress";
import { int } from "../float";
import { TMath } from '../Math/TMath';
export interface ModuleInfo {
  name: string;
  module: any;
}

const LazyLoad = (function (doc) {

  if (!doc) {
    return;
  }
  // User agent
  var env,

    // <head> elementi, lazy olarak yuklenir
    head,

    // bekleyen çağrılar
    pending = {},

    // Bekleyen bir stil sayfasının yüklemeyi bitirip bitirmediğini kontrol etme sayısı. Bu çok giderek yükselirse, muhtemelen kilitlenmiştir.
    pollCount = 0,

    // Kuyruktaki istekler.
    queue = { css: [], js: [] },

    // Tarayıcının stil sayfaları
    styleSheets = doc.styleSheets;

  function createNode(name, attrs?) {
    var node = doc?.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  function finish(type) {
    var p = pending[type],
      callback,
      urls;

    if (p) {
      callback = p.callback;
      urls = p.urls;

      urls.shift();
      pollCount = 0;


      if (!urls.length) {
        callback && callback.call(p.context, (window as any).tmodule/* p.obj */);
        pending[type] = null;
        (window as any).tmodule = undefined;
        queue[type].length && load(type);
      }
    }
  }


  function getEnv() {
    var ua = navigator.userAgent;

    env = {

      async: doc?.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE|Trident/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }


  function load(type, urls?, callback?, obj?, context?) {
    var _finish = function () { finish(type); },
      isCSS = type === 'css',
      nodes: any[] = [],
      i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {

      urls = typeof urls === 'string' ? [urls] : urls.concat();

      if (isCSS || env.async || env.gecko || env.opera) {
        // eşzamanlı yükleme
        queue[type].push({
          urls: urls,
          callback: callback,
          obj: obj,
          context: context
        });
      } else {
        // senkron yükleme
        for (let i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls: [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj: obj,
            context: context
          });
        }
      }
    }


    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc?.head || doc?.getElementsByTagName('head')[0]);
    pendingUrls = p.urls.concat();

    for (let i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
        node = env.gecko ? createNode('style') : createNode('link', {
          href: url,
          rel: 'stylesheet'
        });
      } else {
        node = createNode('script', { src: url });
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko ve WebKit onload olayını desteklemez
        if (env.webkit) {
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }
      nodes.push(node);
    }

    for (let i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  function pollGecko(node) {
    var hasRules;

    try {
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        hasRules && finish('css');
      }

      return;
    }
    finish('css');
  }


  function pollWebKit() {
    var css = (pending as any).css, i;

    if (css) {
      i = styleSheets.length;
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          finish('css');
        }
      }
    }
  }

  return {
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    js: function (urls, callback, obj?, context?) {
      load('js', urls, callback, obj, context);
    }

  };
})((is.NodeEnvironment() || is.workerContext()) ? null : window.document);


function loadScript(src, opts, cb?) {
  var head = document.head || document.getElementsByTagName('head')[0]
  var script = document.createElement('script')

  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  opts = opts || {}
  cb = cb || function () { }

  script.type = opts.type || 'text/javascript'
  script.charset = opts.charset || 'utf8';
  script.async = 'async' in opts ? !!opts.async : true
  script.src = src

  if (opts.attrs) {
    setAttributes(script, opts.attrs)
  }

  if (opts.text) {
    script.text = '' + opts.text
  }

  var onend = 'onload' in script ? stdOnEnd : ieOnEnd
  onend(script, cb)

  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script)
}

function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}

function stdOnEnd(script, cb) {
  script.onload = function () {
    this.onerror = this.onload = null
    cb(null, script)
  }
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null
    cb(new Error('Failed to load ' + this.src), script)
  }
}

function ieOnEnd(script, cb) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null
    cb(null, script) // there is no way to catch loading errors in IE8
  }
}

@Export('tuval$core')
export class ModuleLoader {
  public static LoadedModules: any = {};
  public static cache: Dictionary<string, any>;
  public static get Cache(): Dictionary<string, any> {
    if (ModuleLoader.cache == null) {
      ModuleLoader.cache = new Dictionary();
    }
    return ModuleLoader.cache;
  }

  public static Load(url: string, moduleName?: string, callback?: Function): Promise<any> {
    const lz: any = LazyLoad;
    return new Promise((resolve, reject) => {
      EventBus.Default.on('module.' + moduleName ?? 'loaded', (moduleInfo) => {
        resolve(moduleInfo);
      });

      lz.js(url, (tmodule: any) => {
        callback ?? (tmodule);
      });
    });
  }

  private static InstalledLibs: string[] = [];
  public static LoadLib(url: string, moduleName: string, callback?: Function): Promise<void> {

    if (ModuleLoader.InstalledLibs.indexOf(moduleName) > -1) {
      return new Promise((resolve) => {
        resolve();
      });
    } else {
      ModuleLoader.InstalledLibs.push(moduleName);
      return new Promise((resolve, reject) => {
        /*  EventBus.Default.on('module.' + moduleName ?? 'loaded', (moduleInfo) => {
           resolve(moduleInfo);
         }); */

        loadScript(url, (err) => {
          if (err) {
            console.error('Haaaataaaaaa' + err);
            reject();
          }
          resolve();
        });
      });
    }
  }




  public static LoadFromLocal(moduleName: string): Promise<ModuleInfo> {
    return new Promise((resolve, reject) => {
      TStorage.GetFileBytes(moduleName).then(blob => {
        var reader = new FileReader();
        reader.onload = function () {
          let sb: string = reader.result as any;
          sb += `
                        (function(){
                            console.log('dinamik-----');
                            const eventBus = tuval$core.Context.Current.get('eventBus');
                            eventBus.fire('module.${moduleName}', {
                                        name: '${moduleName}',
                                        module: ${moduleName}
                                });
                            })();
                            `;

          var b = new Blob([sb]);
          const localUrl = window.URL.createObjectURL(b);
          ModuleLoader.Load(localUrl, moduleName).then((moduleInfo: ModuleInfo) => {
            resolve(moduleInfo.module);
          });

        }
        reader.readAsText(blob);

      });
    });
  }
  public static LoadFromUrl(url: string, moduleName: string): Promise<ModuleInfo> {
    if (ModuleLoader.Cache.ContainsKey(url + '_' + moduleName)) {
      return new Promise((resolve, reject) => {
        const localUrl = ModuleLoader.Cache.Get(url + '_' + moduleName);
        ModuleLoader.Load(localUrl, moduleName).then((moduleInfo: ModuleInfo) => {
          resolve(moduleInfo);
        });
      });
    } else {
      const moduleId = Guid.NewGuid().ToString();
      return new Promise((resolve, reject) => {
        Http.JS(url).then(content => {

          let sb: string = '';
          sb += `
                        (function(){
                            const moduleId = '${moduleId}';
                            const state = tuval$core.State.Default.Get(moduleId);
                            ${content}
                            const eventBus = tuval$core.EventBus.Default;
                            eventBus.fire('module.${moduleName}', {
                                        name: '${moduleName}',
                                        constructor: typeof ${moduleName} === 'undefined' ? null : ${moduleName},
                                        error: typeof ${moduleName} === 'undefined' ? 'module not found' : null
                                });
                                eventBus.fire('moduleLoaded', {
                                    name: '${moduleName}',
                                    constructor: typeof ${moduleName} === 'undefined' ? null : ${moduleName},
                                    error: typeof ${moduleName} === 'undefined' ? 'module not found' : null
                            });
                            })();
                            `;

          var b = new Blob([sb]);
          const localUrl = window.URL.createObjectURL(b);
          ModuleLoader.Cache.Set(url + '_' + moduleName, localUrl);
          ModuleLoader.Load(localUrl, moduleName).then((moduleInfo: ModuleInfo) => {
            resolve(moduleInfo);
          });
        });
      });
    }
  }

  public static LoadBundledModule(url: string, moduleName: string): Promise<ModuleInfo> {
    return new Promise((resolve, reject) => {
      Http.JS(url).then(content => {
        let sb: string = content;

        var b = new Blob([sb]);
        const localUrl = window.URL.createObjectURL(b);
        ModuleLoader.Load(localUrl, moduleName).then((moduleInfo: ModuleInfo) => {
          resolve(moduleInfo.module);
        });

      });
    });
  }

  private static Loading: any = {};

  private static librariesHeaders: any = {};
  private static librariesUrls: any = {};
  private static GetDeps(encodedUrl: string, moduleName: string, deps: any, priority: int): Promise<any[]> {
    if (ModuleLoader.librariesHeaders[moduleName] != null) {
      return new Promise((resolve, reject) => {
        const promises: any[] = [];
        var header = ModuleLoader.librariesHeaders[moduleName];
        for (let lib in header) {
          if (deps[lib] == null) {
            deps[lib] = {};
            deps[lib].count = 0;
            deps[lib].priority = 0;
          }
          deps[lib].count++;
          deps[lib].priority = TMath.max(deps[lib].priority, priority);
          promises.push(ModuleLoader.GetDeps('/lib/' + lib + '.lib', lib, deps, priority + 1));
        }
        Promise.all(promises).then((despsArray) => {
          resolve(deps);
        });

      });
    } else {
      return new Promise((resolve, reject) => {
        const promises: any[] = [];
        TLoader.LoadBinary(encodedUrl).then(fileData => {
          const promises: any[] = [];
          const buffer = new TBuffer(new Uint8Array(fileData));
          const headerSize = buffer.readInt32();
          const headerJSONBytes = buffer.readBytes(headerSize);

          const header = JSON.parse(Encoding.UTF8.GetString(headerJSONBytes));
          ModuleLoader.librariesHeaders[moduleName] = header;

          const scriptSize = buffer.readInt32();
          let scriptJSONBytes = buffer.readBytes(scriptSize);
          scriptJSONBytes = TCompress.DeCompressBytes(scriptJSONBytes);

          ModuleLoader.librariesUrls[moduleName] = Convert.ToBlobUrl(scriptJSONBytes, '');

          for (let lib in header) {
            if (deps[lib] == null) {
              deps[lib] = {};
              deps[lib].count = 0;
              deps[lib].priority = 0;
            }
            deps[lib].count++;
            deps[lib].priority = TMath.max(deps[lib].priority, priority);
            promises.push({
              url: '/lib/' + lib + '.lib',
              lib: lib,
              deps: deps,
              priority: priority + 1
            });
          }

          (new Promise((resolve, reject) => {
            if (promises.length > 0) {
              ModuleLoader.GetDeps(promises[0].url, promises[0].lib, deps, promises[0].priority).then(e => {
                if (promises.length > 1) {
                  ModuleLoader.GetDeps(promises[1].url, promises[1].lib, deps, promises[1].priority).then(e => {
                    if (promises.length > 2) {
                      ModuleLoader.GetDeps(promises[2].url, promises[2].lib, deps, promises[2].priority).then(e => {
                        if (promises.length > 3) {
                          ModuleLoader.GetDeps(promises[3].url, promises[3].lib, deps, promises[3].priority).then(e => {
                            if (promises.length > 4) {
                              ModuleLoader.GetDeps(promises[4].url, promises[4].lib, deps, promises[4].priority).then(e => {
                                if (promises.length > 5) {
                                  ModuleLoader.GetDeps(promises[5].url, promises[5].lib, deps, promises[5].priority).then(e => {
                                    if (promises.length > 6) {
                                      ModuleLoader.GetDeps(promises[6].url, promises[6].lib, deps, promises[6].priority).then(e => {
                                        if (promises.length > 7) {
                                          ModuleLoader.GetDeps(promises[7].url, promises[7].lib, deps, promises[7].priority).then(e => {
                                            if (promises.length > 8) {
                                              ModuleLoader.GetDeps(promises[8].url, promises[8].lib, deps, promises[8].priority).then(e => {
                                                if (promises.length > 9) {
                                                  ModuleLoader.GetDeps(promises[9].url, promises[9].lib, deps, promises[9].priority).then(e => {
                                                    if (promises.length > 10) {
                                                      ModuleLoader.GetDeps(promises[10].url, promises[10].lib, deps, promises[10].priority).then(e => {
                                                        if (promises.length > 11) {
                                                          ModuleLoader.GetDeps(promises[11].url, promises[11].lib, deps, promises[11].priority).then(e => {
                                                            if (promises.length > 12) {
                                                              ModuleLoader.GetDeps(promises[12].url, promises[12].lib, deps, promises[12].priority).then(e => {
                                                                if (promises.length > 13) {
                                                                  ModuleLoader.GetDeps(promises[13].url, promises[13].lib, deps, promises[13].priority).then(e => {
                                                                    if (promises.length > 14) {
                                                                      ModuleLoader.GetDeps(promises[14].url, promises[14].lib, deps, promises[14].priority).then(e => {
                                                                        if (promises.length > 15) {
                                                                          ModuleLoader.GetDeps(promises[15].url, promises[15].lib, deps, promises[15].priority).then(e => {
                                                                            if (promises.length > 16) {
                                                                              throw 'yeter';
                                                                            } else {
                                                                              resolve(null);
                                                                            }
                                                                          });
                                                                        } else {
                                                                          resolve(null);
                                                                        }
                                                                      });
                                                                    } else {
                                                                      resolve(null);
                                                                    }
                                                                  });
                                                                } else {
                                                                  resolve(null);
                                                                }
                                                              });
                                                            } else {
                                                              resolve(null);
                                                            }
                                                          });
                                                        } else {
                                                          resolve(null);
                                                        }
                                                      });
                                                    } else {
                                                      resolve(null);
                                                    }
                                                  });
                                                } else {
                                                  resolve(null);
                                                }
                                              });
                                            } else {
                                              resolve(null);
                                            }
                                          });
                                        } else {
                                          resolve(null);
                                        }
                                      });
                                    } else {
                                      resolve(null);
                                    }
                                  });
                                } else {
                                  resolve(null);
                                }
                              });
                            } else {
                              resolve(null);
                            }
                          });
                        } else {
                          resolve(null);
                        }
                      });
                    } else {
                      resolve(null);
                    }
                  });
                } else {
                  resolve(null);
                }
              });
            } else {
              resolve(null);
            }
          })).then(e => resolve(deps));
        });
      });

    }
  }
  public static LoadBundledModuleWithDecode(encodedUrl: string, moduleName: string, isLib: boolean = false): Promise<ModuleInfo> {
    debugger;
    return new Promise((_resolve, _reject) => {
      const deps = {};
      (ModuleLoader as any).GetDeps(encodedUrl, moduleName, deps, 0).then((deps) => {
        console.log(deps);
        var sortable: any[] = [];
        for (var vehicle in deps) {
          sortable.push([vehicle, deps[vehicle].count, deps[vehicle].priority]);
        }

        sortable.sort(function (a, b) {
          if (b[1] === a[1]) {
            return b[2] - a[2];
          } else {
            return b[1] - a[1];
          }
        });

        (new Promise(((resolve, reject) => {
          if (sortable.length > 0) {
            const url = (ModuleLoader as any).librariesUrls[sortable[0][0]];
            ModuleLoader.LoadLib(url, sortable[0][0]).then(() => {
              resolve(null as any);
            });
          } else {
            resolve(null);
          }
        })).then(() => {
          (new Promise(((resolve, reject) => {
            if (sortable.length > 1) {
              const url = (ModuleLoader as any).librariesUrls[sortable[1][0]];
              ModuleLoader.LoadLib(url, sortable[1][0]).then(() => {
                resolve(null as any);
              });
            } else {
              resolve(null);
            }
          })).then(() => {
            (new Promise(((resolve, reject) => {
              if (sortable.length > 2) {
                const url = (ModuleLoader as any).librariesUrls[sortable[2][0]];
                ModuleLoader.LoadLib(url, sortable[2][0]).then(() => {
                  resolve(null as any);
                });
              } else {
                resolve(null);
              }
            })).then(() => {
              (new Promise(((resolve, reject) => {
                if (sortable.length > 3) {
                  const url = (ModuleLoader as any).librariesUrls[sortable[3][0]];
                  ModuleLoader.LoadLib(url, sortable[3][0]).then(() => {
                    resolve(null as any);
                  });
                } else {
                  resolve(null);
                }
              })).then(() => {
                (new Promise(((resolve, reject) => {
                  if (sortable.length > 4) {
                    const url = (ModuleLoader as any).librariesUrls[sortable[4][0]];
                    ModuleLoader.LoadLib(url, sortable[4][0]).then(() => {
                      resolve(null as any);
                    });
                  } else {
                    resolve(null);
                  }
                })).then(() => {
                  (new Promise(((resolve, reject) => {
                    if (sortable.length > 5) {
                      const url = (ModuleLoader as any).librariesUrls[sortable[5][0]];
                      ModuleLoader.LoadLib(url, sortable[5][0]).then(() => {
                        resolve(null as any);
                      });
                    } else {
                      resolve(null);
                    }
                  })).then(() => {
                    (new Promise(((resolve, reject) => {
                      if (sortable.length > 6) {
                        const url = (ModuleLoader as any).librariesUrls[sortable[6][0]];
                        ModuleLoader.LoadLib(url, sortable[6][0]).then(() => {
                          resolve(null as any);
                        });
                      } else {
                        resolve(null);
                      }
                    })).then(() => {
                      (new Promise(((resolve, reject) => {
                        if (sortable.length > 7) {
                          const url = (ModuleLoader as any).librariesUrls[sortable[7][0]];
                          ModuleLoader.LoadLib(url, sortable[7][0]).then(() => {
                            resolve(null as any);
                          });
                        } else {
                          resolve(null);
                        }
                      })).then(() => {
                        (new Promise(((resolve, reject) => {
                          if (sortable.length > 8) {
                            const url = (ModuleLoader as any).librariesUrls[sortable[8][0]];
                            ModuleLoader.LoadLib(url, sortable[8][0]).then(() => {
                              resolve(null as any);
                            });
                          } else {
                            resolve(null);
                          }
                        })).then(() => {
                          (new Promise(((resolve, reject) => {
                            if (sortable.length > 9) {
                              const url = (ModuleLoader as any).librariesUrls[sortable[9][0]];
                              ModuleLoader.LoadLib(url, sortable[9][0]).then(() => {
                                resolve(null as any);
                              });
                            } else {
                              resolve(null);
                            }
                          })).then(() => {
                            (new Promise(((resolve, reject) => {
                              if (sortable.length > 10) {
                                const url = (ModuleLoader as any).librariesUrls[sortable[10][0]];
                                ModuleLoader.LoadLib(url, sortable[10][0]).then(() => {
                                  resolve(null as any);
                                });
                              } else {
                                resolve(null);
                              }
                            })).then(() => {
                              (new Promise(((resolve, reject) => {
                                if (sortable.length > 11) {
                                  const url = (ModuleLoader as any).librariesUrls[sortable[11][0]];
                                  ModuleLoader.LoadLib(url, sortable[11][0]).then(() => {
                                    resolve(null as any);
                                  });
                                } else {
                                  resolve(null);
                                }
                              })).then(() => {
                                (new Promise(((resolve, reject) => {
                                  if (sortable.length > 12) {
                                    const url = (ModuleLoader as any).librariesUrls[sortable[12][0]];
                                    ModuleLoader.LoadLib(url, sortable[12][0]).then(() => {
                                      resolve(null as any);
                                    });
                                  } else {
                                    resolve(null);
                                  }
                                })).then(() => {
                                  (new Promise(((resolve, reject) => {
                                    if (sortable.length > 13) {
                                      const url = (ModuleLoader as any).librariesUrls[sortable[13][0]];
                                      ModuleLoader.LoadLib(url, sortable[13][0]).then(() => {
                                        resolve(null as any);
                                      });
                                    } else {
                                      resolve(null);
                                    }
                                  })).then(() => {
                                    (new Promise(((resolve, reject) => {
                                      if (sortable.length > 14) {
                                        const url = (ModuleLoader as any).librariesUrls[sortable[14][0]];
                                        ModuleLoader.LoadLib(url, sortable[14][0]).then(() => {
                                          resolve(null as any);
                                        });
                                      } else {
                                        resolve(null);
                                      }
                                    })).then(() => {
                                      (new Promise(((resolve, reject) => {
                                        if (sortable.length > 15) {
                                          const url = (ModuleLoader as any).librariesUrls[sortable[15][0]];
                                          ModuleLoader.LoadLib(url, sortable[15][0]).then(() => {
                                            resolve(null as any);
                                          });
                                        } else {
                                          resolve(null);
                                        }
                                      })).then(() => {
                                        (new Promise(((resolve, reject) => {
                                          if (sortable.length > 16) {
                                            const url = (ModuleLoader as any).librariesUrls[sortable[16][0]];
                                            ModuleLoader.LoadLib(url, sortable[16][0]).then(() => {
                                              resolve(null as any);
                                            });
                                          } else {
                                            resolve(null);
                                          }
                                        })).then(() => {
                                          (new Promise(((resolve, reject) => {
                                            if (sortable.length > 17) {
                                              const url = (ModuleLoader as any).librariesUrls[sortable[17][0]];
                                              ModuleLoader.LoadLib(url, sortable[17][0]).then(() => {
                                                resolve(null as any);
                                              });
                                            } else {
                                              resolve(null);
                                            }
                                          })).then(() => {
                                            (new Promise(((resolve, reject) => {
                                              if (sortable.length > 18) {
                                                const url = (ModuleLoader as any).librariesUrls[sortable[18][0]];
                                                ModuleLoader.LoadLib(url, sortable[18][0]).then(() => {
                                                  resolve(null as any);
                                                });
                                              } else {
                                                resolve(null);
                                              }
                                            })).then(() => {
                                              (new Promise(((resolve, reject) => {
                                                if (sortable.length > 19) {
                                                  const url = (ModuleLoader as any).librariesUrls[sortable[19][0]];
                                                  ModuleLoader.LoadLib(url, sortable[19][0]).then(() => {
                                                    resolve(null as any);
                                                  });
                                                } else {
                                                  resolve(null);
                                                }
                                              })).then(() => {
                                                (new Promise(((resolve, reject) => {
                                                  if (sortable.length > 20) {
                                                    const url = (ModuleLoader as any).librariesUrls[sortable[20][0]];
                                                    ModuleLoader.LoadLib(url, sortable[20][0]).then(() => {
                                                      resolve(null as any);
                                                    });
                                                  } else {
                                                    resolve(null);
                                                  }
                                                })).then(() => {
                                                  (new Promise(((resolve, reject) => {
                                                    if (sortable.length > 21) {
                                                      const url = (ModuleLoader as any).librariesUrls[sortable[21][0]];
                                                      ModuleLoader.LoadLib(url, sortable[21][0]).then(() => {
                                                        resolve(null as any);
                                                      });
                                                    } else {
                                                      resolve(null);
                                                    }
                                                  })).then(() => {
                                                    (new Promise(((resolve, reject) => {
                                                      if (sortable.length > 22) {
                                                        const url = (ModuleLoader as any).librariesUrls[sortable[22][0]];
                                                        ModuleLoader.LoadLib(url, sortable[22][0]).then(() => {
                                                          resolve(null as any);
                                                        });
                                                      } else {
                                                        resolve(null);
                                                      }
                                                    })).then(() => {
                                                      (new Promise(((resolve, reject) => {
                                                        if (sortable.length > 23) {
                                                          const url = (ModuleLoader as any).librariesUrls[sortable[23][0]];
                                                          ModuleLoader.LoadLib(url, sortable[23][0]).then(() => {
                                                            resolve(null as any);
                                                          });
                                                        } else {
                                                          resolve(null);
                                                        }
                                                      })).then(() => {
                                                        (new Promise(((resolve, reject) => {
                                                          if (sortable.length > 24) {
                                                            const url = (ModuleLoader as any).librariesUrls[sortable[24][0]];
                                                            ModuleLoader.LoadLib(url, sortable[24][0]).then(() => {
                                                              resolve(null as any);
                                                            });
                                                          } else {
                                                            resolve(null);
                                                          }
                                                        })).then(() => {
                                                          (new Promise(((resolve, reject) => {
                                                            if (sortable.length > 25) {
                                                              const url = (ModuleLoader as any).librariesUrls[sortable[25][0]];
                                                              ModuleLoader.LoadLib(url, sortable[25][0]).then(() => {
                                                                resolve(null as any);
                                                              });
                                                            } else {
                                                              resolve(null);
                                                            }
                                                          })).then(() => {
                                                            (new Promise(((resolve, reject) => {
                                                              if (sortable.length > 26) {
                                                                const url = (ModuleLoader as any).librariesUrls[sortable[26][0]];
                                                                ModuleLoader.LoadLib(url, sortable[26][0]).then(() => {
                                                                  resolve(null as any);
                                                                });
                                                              } else {
                                                                resolve(null);
                                                              }
                                                            })).then(() => {
                                                              (new Promise(((resolve, reject) => {
                                                                if (sortable.length > 27) {
                                                                  const url = (ModuleLoader as any).librariesUrls[sortable[27][0]];
                                                                  ModuleLoader.LoadLib(url, sortable[27][0]).then(() => {
                                                                    resolve(null as any);
                                                                  });
                                                                } else {
                                                                  resolve(null);
                                                                }
                                                              })).then(() => {
                                                                (new Promise(((resolve, reject) => {
                                                                  if (sortable.length > 28) {
                                                                    const url = (ModuleLoader as any).librariesUrls[sortable[28][0]];
                                                                    ModuleLoader.LoadLib(url, sortable[28][0]).then(() => {
                                                                      resolve(null as any);
                                                                    });
                                                                  } else {
                                                                    resolve(null);
                                                                  }
                                                                })).then(() => {
                                                                  (new Promise(((resolve, reject) => {
                                                                    if (sortable.length > 29) {
                                                                      const url = (ModuleLoader as any).librariesUrls[sortable[29][0]];
                                                                      ModuleLoader.LoadLib(url, sortable[29][0]).then(() => {
                                                                        resolve(null as any);
                                                                      });
                                                                    } else {
                                                                      resolve(null);
                                                                    }
                                                                  })).then(() => {
                                                                    (new Promise(((resolve, reject) => {
                                                                      if (sortable.length > 30) {
                                                                        const url = (ModuleLoader as any).librariesUrls[sortable[30][0]];
                                                                        ModuleLoader.LoadLib(url, sortable[30][0]).then(() => {
                                                                          resolve(null as any);
                                                                        });
                                                                      } else {
                                                                        resolve(null);
                                                                      }
                                                                    })).then(() => {

                                                                      const url = ModuleLoader.librariesUrls[moduleName];
                                                                      if (isLib) {
                                                                        /*  const fileStr = Encoding.UTF8.GetString(scriptJSONBytes);
                                                                         const jsStringBuffer = Convert.FromBase64String(fileStr);
                                                                         const url = Convert.ToBlobUrl(jsStringBuffer, ''); */

                                                                        ModuleLoader.LoadLib(url, moduleName).then(() => {
                                                                          _resolve(null as any);
                                                                        });
                                                                      } else {

                                                                        /*  const fileStr = Encoding.UTF8.GetString(scriptJSONBytes);
                                                                         const jsStringBuffer = Convert.FromBase64String(fileStr);
                                                                         const url = Convert.ToBlobUrl(jsStringBuffer, ''); */

                                                                        ModuleLoader.Load(url, moduleName).then((moduleInfo: ModuleInfo) => {
                                                                          _resolve(moduleInfo.module);
                                                                        });
                                                                      }
                                                                    }));
                                                                  }));
                                                                }));
                                                              }));
                                                            }));
                                                          }));
                                                        }));
                                                      }));
                                                    }));
                                                  }));
                                                }));
                                              }));
                                            }));
                                          }));
                                        }));
                                      }));
                                    }));
                                  }));
                                }));
                              }));
                            }));
                          }));
                        }));
                      }));
                    }));
                  }));
                }));
              }));
            }));
          }));
        }));
      });
    });
  }

  public static FireModuleLoadedEvent(moduleName: string, module: any) {
    var scripts = document.getElementsByTagName("script"),
      src = scripts[scripts.length - 1].src;
    ModuleLoader.LoadedModules[src] = moduleName;

    const eventBus = EventBus.Default;
    eventBus.fire(`module.${moduleName}`, {
      name: moduleName,
      module: module
    });
  }
}

//exportToGlobal('tuval$core','ModuleLoader', ModuleLoader);