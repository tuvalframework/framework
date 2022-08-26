import { EventBus } from '../../Events/EventBus';
import { int } from '../../float';
import { EventBusObject } from './EventBusObject';

function getWindowWidth() {
    return (
      window.innerWidth ||
      (document.documentElement && document.documentElement.clientWidth) ||
      (document.body && document.body.clientWidth) ||
      0
    );
  }

  function getWindowHeight() {
    return (
      window.innerHeight ||
      (document.documentElement && document.documentElement.clientHeight) ||
      (document.body && document.body.clientHeight) ||
      0
    );
  }


export class EnvorimentObject {
    private eventBus: EventBusObject;
    public get DisplayWidth(): int {
        return screen.width;
    }
    public get DisplayHeight(): int {
        return screen.height;
    }
    public get WindowWidth():int {
        return getWindowWidth();
    }
    public get WindowHeight():int {
        return getWindowHeight();
    }
    public constructor(eventBus: EventBusObject) {
        this.eventBus = eventBus;
        window.addEventListener("resize", this._onresize.bind(this));
    }
    public fullscreen(val) {

        if (typeof val === 'undefined') {
          return (
            (document as any).fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
          );
        } else {
          // otherwise set to fullscreen or not
          if (val) {
            this._launchFullscreen(document.documentElement);
          } else {
            this._exitFullscreen();
          }
        }
      }
      private _launchFullscreen(element) {
        const enabled =
          (document as any).fullscreenEnabled ||
          (document as any).webkitFullscreenEnabled ||
          (document as any).mozFullScreenEnabled ||
          (document as any).msFullscreenEnabled;
        if (!enabled) {
          throw new Error('Fullscreen not enabled in this browser.');
        }
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      public _exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }

    private _onresize(e) {
        //this._setProperty('windowWidth', getWindowWidth());
        //this._setProperty('windowHeight', getWindowHeight());
        this.eventBus.fire('window.resized', {
            width: getWindowWidth(),
            height: getWindowHeight(),
        });
        const context =  window;
        let executeDefault;
        if (typeof (context as any).windowResized === 'function') {
          executeDefault = (context as any).windowResized(e);
          if (executeDefault !== undefined && !executeDefault) {
            e.preventDefault();
          }
        }
      };
}
(EnvorimentObject as any).$inject = ["eventBus"];