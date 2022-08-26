function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

var __extends = (undefined && undefined.__extends) || (function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] }
                instanceof Array && function(d, b) { d.__proto__ = b; }) ||
            function(d, b) {
                for (var p in b)
                    if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };
    return function(d, b) {
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
            if ( /* subP.hasOwnProperty(n) && */ (typeof supP[n] == "function")) {
                subP[prefix + n] = supP[n];
            }
        }
    }
    return subclass;
};

function _Extends(superClass, newClass, classContent) {

    return (function(_super) {

        __extends(newClass, _super);

        function newClass() {
            var _this = _super.call(this) || this;
            classContent(_this, arguments);

            return _this;

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
        Extends: function(superClass) {

            return {
                name: className,
                superClass: superClass,
                Constructor: function(ctor) {

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
with(Tuval) {
    _Class('test').Extends(TModule).Constructor((self, console) => {

        self.console = console;

        /*   DynamicModule.prototype.PreRun = () => {
              self.AddRunDependency("test");
              TLoader.LoadImage('1.jpg').then(image => {
                  self.m_Image = image;
                  self.RemoveRunDependency("test");
              });
          }; */
        test.prototype.CallMain = () => {
            self.console.WriteLine(moduleId);
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
        utf8.prototype.CallMain = (args) => {
            self.console.Clear();
            self.console.WriteLine(moduleId);
            self.console.Pen(5);
            self.console.Center('UTF UYGULAMASINA HOŞGELDİNİZ...');
            self.console.Pen(1);
            //alert(this.m_Image);
            self.console.WriteLine('Çıkmak için x yazın.');
            self.console.Task(() => {
                debugger;
                if (args.length === 0) {
                    self.console.StartLoop();
                    self.console.ReadLine('Bir text girin:', (input) => {
                        const bytes = Encoding.UTF8.GetBytes(input);
                        self.console.WriteHex(bytes);
                        if (input === 'x') {
                            self.console.ExitLoop();
                        }
                    });
                    self.console.EndLoop();
                } else {
                    const bytes = Encoding.UTF8.GetBytes(args.join(' '));
                    self.console.WriteHex(bytes);
                }
            });

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

    _Class('pen').Extends(TModule).Constructor((self, console) => {
        self.console = console;
        pen.prototype.CallMain = (args) => {
            debugger;
            self.console.Pen(args[0]);
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
        self.console = console;
        if (state.modules == null) {
            state.modules = new Dictionary();
            EventBus.Default.on('moduleLoaded', (moduleInfo) => {
                state.modules.Add(moduleInfo.name, true);
            });

            EventBus.Default.on('console.key.ArrowUp', () => {
                //debugger;
                self.console.tvc.SetInputStringInternal('dsdfsdf');
            });
        }

        dir.prototype.CallMain = (args) => {
            copyTextToClipboard('dfsdfsd');
            foreach(state.modules, (pair) => {
                self.console.WriteLine(pair.Key);
            });
            self.console.Wait(1);
        };
    });
    /*  _Class('guid').Extends(TModule).Constructor((self, console) => {
        self.console = console;

        guid.prototype.CallMain = (args) => {
            copyTextToClipboard(Guid.NewGuid().toString());

            self.console.WriteLine('Kopyalandı.');

            self.console.Wait(1);
        };
    });
 */


    _Class('keystate').Extends(TModule).Constructor((self, console) => {
        self.console = console;

        keystate.prototype.CallMain = (args) => {
            with(self.console) {
                debugger
                SetPalette(New.IntArray([0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0xFFFFFF, 0xFF7700, 0x0077FF, 0x7700FF, 0xFF0077, 0x333333, 0x666666, 0x999999, 0xCCCCCC, 0xFFFFFF]));
                Clear(0).Paper(0).Pen(6);
                Pen(1).Locate(0, 3).Center("PRESS ANY KEY(s)");
                Pen(5).Locate(0, 24).Center("PRESS ESCAPE KEY TO QUIT")
                Pen(2).Locate(28, 8).WriteLine("Inkey$=");
                Pen(3).Locate(28, 11).WriteLine("Scancode=")
                Pen(4).Locate(28, 14).WriteLine("Key State=");
                StartLoop();
                Task(() => {
                    if (KeyState(27)) {
                        debugger;
                        ExitLoop();
                    }
                    const k = Inkey;
                    const s = KeyCode;
                    const b = KeyStatus;
                    if (k !== '') {
                        Pen(2).Locate(36, 8).Write(k);
                        Pen(3).Locate(37, 11).Write(s);
                    }
                    if (b > 0) {
                        Pen(4).Locate(38, 14);
                        //debugger;
                        const a = TString.PadLeft(Convert.ToString(b, 2), 8, '0');
                        Write(a);
                    }
                });
                EndLoop();


            }
        };
    });

    _Class('file').Extends(TModule).Constructor((self, console) => {
        self.console = console;

        file.prototype.CallMain = (args) => {
            debugger;
            const fs = new FileStream('C:\\test\\son\\myfile.ext', FileMode.Create, FileAccess.Write);
            const array1 = Encoding.UTF8.GetBytes('😃 😄 😁 😆 😅 😂 🤣 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾');
            fs.Write(array1, 0, array1.length);
            fs.Flush();
            fs.Close();
            FS.syncfs();

            using(new StreamReader('C:\\test\\son\\myfile.ext'), (sr) => {
                console.WriteLine(sr.ReadToEnd());
            });


            console.WriteLine('yazıldı.');
            console.Wait(1);
        };
    });

    _Class('image').Extends(TModule).Constructor((self, console) => {
        self.console = console;
        let currentTime = 0;
        let deltaTime = 0;
        let lastTime = 0;
        let PosXB = 0;
        image.prototype.CallMain = function(args) {
            let index = 0;
            with(self.console) {
                //  debugger;
                LoadImage('100.png');
                LoadImage('110.png');
                LoadImage('10.png');

                ScreenOpen(1, 225, 400);
                Screen(1);


                const yAspect = ScreenHeight(0) / 400;
                ScreenScale(1, yAspect, yAspect);
                ScreenCenter(1, true, true);
                ScreenToFront(1);
                //SetTransparent(0);
                //Screen(0);

                StartLoop();

                Task(() => {
                    currentTime = Timer;
                    deltaTime = currentTime - lastTime;
                });

                Clear(3);
                Task(() => {
                    this.updateForeground();
                });

                Task(() => {
                    index -= 3;;
                    PasteBob(index, 350, 110);
                    PasteBob(index + 243, 350, 110);
                    // ScreenDisplay(1, index, 320);
                    if (index < -243) {
                        index = 0;
                    }
                });

                Task(() => {
                    PasteBob(deltaTime * 1000, 0, 10);
                });

                Task(() => {
                    lastTime = currentTime;
                    // debugger;
                });

                this.checkExit();
                EndLoop();
            }
        };

        image.prototype.updateForeground = function() {
            with(self.console) {
                PosXB += -25 * deltaTime;
                PasteBob(PosXB, 0, 100);
                PasteBob(PosXB + 223, 0, 100);
                if (PosXB < -225) {
                    PosXB = 0;
                }
            }
        }
        image.prototype.checkExit = function() {
            with(self.console) {
                Task(() => {
                    if (KeyState(27)) {
                        ScreenClose(1);
                        ExitLoop();
                    }
                });
            }
        }
    });

    _Class('game').Extends(TModule).Constructor((self, console) => {
        self.console = console;
        pos = lazy(new CGRectangle(2, 2, 700, 400));
        borderPen = lazy(new Pen(CGColor.Yellow, 2));
        brush = lazy(new SolidBrush(CGColor.Yellow));
        grayBrush = lazy(new SolidBrush(CGColor.Gray));

        game.prototype.CallMain = (args) => {
            with(self.console) {
                //debugger;
                StartLoop();
                pos.Value.Width = ScreenWidth();
                pos.Value.Height = ScreenHeight();
                FillRectangle(grayBrush, pos);

                ScreenOpen(1, ScreenWidth(), ScreenHeight());
                FillRectangle(brush, pos);
                Wait(2);
                ScreenClose(1);
                EndLoop();
            }
        };
    });


    _Class('gui').Extends(TModule).Constructor((self, console) => {

        self.console = console;
        pos = lazy(new CGRectangle(50, 150, 10, 10));
        borderPen = lazy(new Pen(CGColor.Yellow, 2));
        //console.log(pos);
        gui.prototype.CheckTask = () => {
            if (pos.Value.X > 1500) {
                self.console.ReadLine('Başa Dönmel istermisiniz. Y/N :', (input) => {
                    if (input === 'y') {
                        gui.prototype.pos = null;
                        self.console.ExitLoop();
                    } else {
                        pos.Value.X = 0;
                        const _pos = lazy(new CGRectangle(50, 150, 100, 100));
                        self.console.StartLoop();
                        self.console.Clear();
                        self.console.FillRectangle(lazy(Brushes.Red), _pos);
                        self.console.DrawRectangle(borderPen, _pos);
                        self.console.Task(() => {
                            _pos.Value.X = _pos.Value.X + 5
                            if (_pos.Value.X > 1500) {
                                self.console.ExitLoop();
                            }
                        });
                        console.EndLoop();
                    }
                });
            }
        }
        gui.prototype.CallMain = (args) => {
            const rectangles = lazy(new ArrayList());
            //self.console.Wait(1);
            self.console.HideMouse();
            self.console.StartLoop();
            self.console.Clear();
            self.console.Center("TEST");
            self.console.WriteLine("This is a rectangle");
            self.console.Task(() => {
                if (rectangles.Value.Count > 0) {
                    foreach(rectangles.Value, (rect) => {
                        self.console.FillRectangle(lazy(Brushes.White), rect);
                        self.console.DrawRectangle(borderPen, rect);
                    });
                }
            });

            self.console.FillRectangle(lazy(Brushes.White), pos);
            self.console.DrawRectangle(borderPen, pos);
            self.console.Task(() => {
                //pos.Value.X = pos.Value.X + 5;
                pos.Value.X = self.console.MouseX;
                pos.Value.Y = self.console.MouseY;
                if (self.console.MouseKey === 1) {
                    rectangles.Value.Add(pos.Value.clone());

                }
            });
            self.console.Task(() => {
                if (self.console.MouseKey === 2) {
                    console.ShowMouse();
                    console.ExitLoop();
                }
            });

            //self.console.Task(self.CheckTask);
            self.console.EndLoop();
        };
    });

    _Class('move').Extends(TModule).Constructor((self, console) => {

        self.console = console;
        pos = lazy(new CGRectangle(350, 350, 100, 100));
        borderPen = lazy(new Pen(CGColor.Yellow, 2));
        //console.log(pos);
        /*   move.prototype.CheckTask = () => {
              if (pos.Value.X > 1500) {
                  self.console.ReadLine('Başa Dönmel istermisiniz. Y/N :', (input) => {
                      if (input === 'y') {
                          gui.prototype.pos = null;
                          self.console.ExitLoop();
                      } else {
                          pos.Value.X = 0;
                          const _pos = lazy(new CGRectangle(50, 150, 100, 100));
                          self.console.StartLoop();
                          self.console.Clear();
                          self.console.FillRectangle(lazy(Brushes.Red), _pos);
                          self.console.DrawRectangle(borderPen, _pos);
                          self.console.Task(() => {
                              _pos.Value.X = _pos.Value.X + 5
                              if (_pos.Value.X > 1500) {
                                  self.console.ExitLoop();
                              }
                          });
                          console.EndLoop();
                      }
                  });
              }
          } */
        move.prototype.CallMain = (args) => {
            const rectangles = lazy(new ArrayList());
            //self.console.Wait(1);
            self.console.StartLoop();
            self.console.Clear();
            self.console.Center("USE LEFT, RIGHT, UP AND DOWN KEYS");
            self.console.FillRectangle(lazy(Brushes.White), pos);
            self.console.DrawRectangle(borderPen, pos);
            self.console.Task(() => {
                //self.console.Locate(10, 10);
                if (self.console.KeyState(38)) {
                    pos.Value.Y = pos.Value.Y - 5;
                } else if (self.console.KeyState(40)) {
                    pos.Value.Y = pos.Value.Y + 5;
                } else if (self.console.KeyState(37)) {
                    pos.Value.X = pos.Value.X - 5;
                } else if (self.console.KeyState(39)) {
                    pos.Value.X = pos.Value.X + 5;
                } else if (self.console.KeyState(38) && self.console.KeyState(39)) {
                    pos.Value.Y = pos.Value.Y - 5;
                    pos.Value.X = pos.Value.X + 5;
                }

                //pos.Value.Y = pos.Value.Y + 5;
            });
            self.console.Task(() => {
                if (self.console.KeyState(27)) {
                    self.console.Clear();
                    self.console.ExitLoop();
                }
            });

            //self.console.Task(self.CheckTask);
            self.console.EndLoop();
        };
    });

    _Class('ellipse').Extends(TModule).Constructor((self, console) => {

        self.console = console;
        const pos = lazy(new CGRectangle(350, 350, 100, 100));
        const pen = lazy(new Pen(CGColor.Yellow, 3));
        const brush = lazy(Brushes.Green);
        ellipse.prototype.CallMain = (args) => {
            const rectangles = lazy(new ArrayList());
            //self.console.Wait(1);
            self.console.StartLoop();
            self.console.Clear();
            self.console.Center("USE LEFT, RIGHT, UP AND DOWN KEYS");
            self.console.FillEllipse(brush, pos);
            self.console.DrawEllipse(pen, pos);
            self.console.Task(() => {
                if (self.console.KeyState(38)) {
                    pos.Value.Y = pos.Value.Y - 5;
                } else if (self.console.KeyState(40)) {
                    pos.Value.Y = pos.Value.Y + 5;
                } else if (self.console.KeyState(37)) {
                    pos.Value.X = pos.Value.X - 5;
                } else if (self.console.KeyState(39)) {
                    pos.Value.X = pos.Value.X + 5;
                } else if (self.console.KeyState(38) && self.console.KeyState(39)) {
                    pos.Value.Y = pos.Value.Y - 5;
                    pos.Value.X = pos.Value.X + 5;
                }

                //pos.Value.Y = pos.Value.Y + 5;
            });
            self.console.Task(() => {
                if (self.console.KeyState(27)) {
                    self.console.Clear();
                    self.console.ExitLoop();
                }
            });

            //self.console.Task(self.CheckTask);
            self.console.EndLoop();
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

class guid extends Tuval.TModule {
    constructor(console) {
        super(); // dont forget call super
        this.console = console;
    }
    CallMain() {
        const g = Tuval.Guid.NewGuid().toString();
        copyTextToClipboard(g);
        this.console.WriteLine('Kopyalandı.');
        this.console.Wait(1);
    }
}

//alert('Son yüklendi.');