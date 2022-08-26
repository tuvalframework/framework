
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/* var DynamicModule =  (function (_super) {
    __extends(DynamicModule, _super);
    function DynamicModule() {
        var _this = _super.call(this) || this;

        return _this;
    }
    DynamicModule.prototype.Run = ()=>{
        alert('');
    }

    return DynamicModule;
}(tuval$core.TModule)); */

function promote(subclass, prefix) {
    "use strict";

    var subP = subclass.prototype;
    var supP = (Object.getPrototypeOf && Object.getPrototypeOf(subP)) || subP.__proto__;
    if (supP) {
        subP[(prefix += "_") + "constructor"] = supP.constructor; // constructor is not always innumerable
        for (var n in supP) {
            if (/* subP.hasOwnProperty(n) && */ (typeof supP[n] == "function")) {
                subP[prefix + n] = supP[n];
            }
        }
    }
    return subclass;
};

function _Extends(superClass, newClass, classContent) {
    return (function (_super) {
        __extends(newClass, _super);
        function newClass() {
            var _this = _super.call(this) || this;
            const result = classContent(_this, arguments);
            if (result != null) {
                return result;
            } else {
                return _this;
            }
        }
        /*   newClass.prototype.Run = ()=>{
              alert('');
          }
   */

        return promote(newClass, 'TModule');

    }(superClass));
}

function _Class(className) {
    return {
        name: className,
        Extends: function (superClass) {
            return {
                name: className,
                superClass: superClass,
                Constructor: function (ctor) {
                    window[this.name] = _Extends(superClass, window[this.name], (_this, args) => {
                        const _args = [];
                        _args.push(_this);
                        for (let i = 0; i < args.length; i++) {
                            _args.push(args[i]);
                        }
                        ctor.apply(_this, _args);
                        //const a = parseAnnotations(ctor);
                    });
                }
            }
        }
    }
}
with (tuval$core) {
    _Class('test').Extends(TModule).Constructor((self, console) => {
        //debugger;
        self.console = console;

        /*   DynamicModule.prototype.PreRun = () => {
              self.AddRunDependency("test");
              TLoader.LoadImage('1.jpg').then(image => {
                  self.m_Image = image;
                  self.RemoveRunDependency("test");
              });
          }; */
        test.prototype.CallMain = () => {
            //alert(this.m_Image);
            self.console.WriteLine('Test modülünden merhaba.');
            self.console.StartLoop();
            self.console.ReadLine('Bir sayı girin:', (input) => {
                const a = parseInt(input);
                if (a > 10)
                    self.console.WriteLine('10 dan büyük');
                else
                    self.console.WriteLine('10 dan küçük');

                if (a === 10) {
                    self.console.ExitLoop();
                }
            });
            self.console.EndLoop();
        };

    });

    _Class('utf8').Extends(TModule).Constructor((self, console) => {
        self.console = console;
        utf8.prototype.CallMain = () => {
            self.console.Clear();
            self.console.SetPen(5);
            self.console.Center('UTF UYGULAMASINA HOŞGELDİNİZ...');
            self.console.SetPen(1);
            //alert(this.m_Image);
            self.console.WriteLine('Çıkmak için x yazın.');
            self.console.StartLoop();
            self.console.ReadLine('Bir text girin:', (input) => {
                const bytes = Encoding.UTF8.GetBytes(input);
                self.console.WriteHex(bytes);
                if (input === 'x') {
                    self.console.ExitLoop();
                }
            });
            self.console.EndLoop();
        };
    });

    _Class('cls').Extends(TModule).Constructor((self, console) => {
        self.console = console;
        cls.prototype.CallMain = (args) => {
            self.console.Clear();
            EventBus.Default.fire('hook', {});
            //self.console.WriteLine(args[0]);
        };
    });

    _Class('hook').Extends(TModule).Constructor((self, console) => {
        self.console = console;
        hook.prototype.CallMain = (args) => {
            EventBus.Default.on('hook', () => {
                self.console.WriteLine('hook çalıştı.');
                self.console.Wait(1);
            });
        };
    });

    _Class('dir').Extends(TModule).Constructor((self, console) => {
        if (dir.Instance != null) {
            return dir.Instance;
        }

        dir.Instance = self;
        self.console = console;
        self.modules = new Dictionary();
        EventBus.Default.on('moduleLoaded', (moduleInfo) => {
            self.modules.Add(moduleInfo.name, true);
        });
        dir.prototype.CallMain = (args) => {
            foreach(self.modules,(pair)=>{
                self.console.WriteLine(pair.Key);
            });
            self.console.Wait(1);
        };
    });


    /* _DynamicModule.prototype.PreRun = function () {
        this.AddRunDependency("test");
        TLoader.LoadImage('1.jpg').then(image => {
            this.m_Image = image;
            this.RemoveRunDependency("test");
        });
    } */
    /*  _DynamicModule.prototype.CallMain = function () {
         //alert(this.m_Image);
         this.console.WriteLine('image yüklendi.');
     } */
    /*  var DynamicModule = _Extends(TModule, DynamicModule, (s, p) => {
         p.PreRun = function () {
             this.AddRunDependency("test");
             TLoader.LoadImage('1.jpg').then(image => {
                 p.m_Image = image;
                 this.RemoveRunDependency("test");
             });
         }
         p.CallMain = () => {
             alert(p.m_Image);
         }
     }); */
}

//alert('Son yüklendi.');