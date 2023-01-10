/* asic usage
import JsFileDownloader from 'js-file-downloader';

const fileUrl = 'http://...';

new JsFileDownloader({
    url: fileUrl
  })
  .then(function () {
    // Called when download ended
  })
  .catch(function (error) {
    // Called when an error occurred
  });

Use without a package manager
Download this library from https://github.com/AleeeKoi/js-file-downloader/releases

<script src="/path/to/js-file-downloader.min.js"></script>
<script>
  // Then somewhere in your code
  new jsFileDownloader({ url: 'https://github.alessandropellizzari.it/test/apedesign-bg.png' })
    .then(function () {
      // Called when download ended
    })
    .catch(function (error) {
      // Called when an error occurred
    });
</script>
Options:
process (for checking download status)
A function to call every time a process event is called. Function receive an Event Object as input.

function process (event) {
  if (!event.lengthComputable) return; // guard
  var downloadingPercentage = Math.floor(event.loaded / event.total * 100);
  // what to do ...
};

new JsFileDownloader({
  url: '...',
  process: process
})

headers (of request)
If you need to customize request header data you can pass an array of objects like following example:

new JsFileDownloader({
  url: '...',
  headers: [
    { name: 'Authorization', value: 'Bearer ABC123...' }
  ]
})
filename
Setting this String you can force output file name

mobileDisabled
Boolean value (default false) to enable/disable library on mobile browsers.

timeout (ms)
Integer value (default 40000) defining how much ms attend before stop download action.

autoStart
Boolean value (default true) to enable/disable automatically starting the download. When the value is true the constructor returns a Promise, however when it's set to false, the constructor doesn't return anything and the download can be started by calling the start() method on the object.

Example with autoStart set to true

new JsFileDownloader({
  url: '...',
  autoStart: true
})
Example with autoStart set to false

const download = new JsFileDownloader({
  url: '...',
  autoStart: false
});

download.start()
  .then(function(){
      // success
  })
  .catch(function(error){
      // handle errors
  });
forceDesktopMode
Boolean value (default false) to force desktop mode even on mobile devices for downloading files.

new JsFileDownloader({
  url: '...',
  forceDesktopMode: true
})
withCredentials
This is a Boolean that indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.

new JsFileDownloader({
  url: '...',
  withCredentials: true
})
method
The HTTP request method to use, such as "GET", "POST", "PUT", etc. (default "GET") Ignored for non-HTTP(S) URLs.

new JsFileDownloader({
  url: '...',
  method: 'POST'
})
nameCallback
You could pass a callback to customize final name, the function receive as 1st argument the name automatically extracted.

new JsFileDownloader({
  url: '...',
  nameCallback: function(name) {
    return 'i-am-prefix-' + name;
  }
}) */

import { is } from "../is";


interface IDownloadParams {
    timeout: number;
    mobileDisabled: boolean;
    headers: any[];
    forceDesktopMode: boolean;
    autoStart: boolean;
    withCredentials: boolean;
    method: string;
    url: string;
    nameCallback: Function;
    process: any;
    filename: string;
    includeCredentials: boolean
}

const defaultParams: IDownloadParams = {
    timeout: 40000,
    mobileDisabled: true,
    headers: [],
    forceDesktopMode: false,
    autoStart: true,
    withCredentials: false,
    method: 'GET',
    url: '',
    nameCallback: name => name,
    process: null,
    filename: '',
    includeCredentials: null as any
};

export class UserFileDownloader {
    private params: IDownloadParams;
    private link: any;
    private request: any = null;
    /**
     * You need to define a {String} "url" params and optionally others
     * * {String} filename
     * * {Int} timeout in ms
     * * {Boolean} mobileDisabled
     * * {Function} process call on request event
     * @param {Object} customParams
     */
    constructor(customParams = {}) {
        this.params = Object.assign({}, defaultParams, customParams);
        this.link = this.createLink();
        this.request = null;

        if (this.params.autoStart) {
            return this.downloadFile() as any;
        }

        return this;
    }

    start() {
        return this.downloadFile();
    }

    downloadFile() {
        return new Promise((resolve, reject) => {
            this.initDonwload(resolve, reject);
        });
    }

    initDonwload(resolve, reject) {
        // fallback for old browsers
        if (!('download' in this.link) || this.isMobile()) {
            this.link.target = '_blank';
            this.link.href = this.params.url;
            this.clickLink();
            return resolve();
        }

        this.request = this.createRequest();

        if (!this.params.url) {
            return reject('Downloader error: url param not defined!');
        }

        this.request.onload = () => {
            if (parseInt(this.request.status, 10) !== 200) {
                return reject(new Error(`status code [${this.request.status}]`));
            }
            this.startDownload();
            return resolve(this);
        };

        this.request.ontimeout = () => {
            reject(new Error('Downloader error: request timeout'));
        };

        this.request.onerror = (e) => {
            reject(e);
        };

        this.request.send();

        return this;
    }

    isMobile() {
        return !this.params.forceDesktopMode &&
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    createRequest() {
        let request = new XMLHttpRequest();

        request.open(this.params.method, this.params.url, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.params.headers.forEach(header => {
            request.setRequestHeader(header.name, header.value);
        });
        request.responseType = 'arraybuffer';
        if (this.params.process && typeof this.params.process === 'function') {
            request.addEventListener('progress', this.params.process);
        }
        request.timeout = this.params.timeout;
        request.withCredentials = !!this.params.withCredentials || !!this.params.includeCredentials;
        return request;
    }

    getFileName() {
        // Forcing file name
        if (is.string(this.params.filename) && !is.nullOrEmpty(this.params.filename)) {
            return this.params.filename;
        }
        // Trying to get file name from response header
        let content = this.request.getResponseHeader('Content-Disposition');
        let contentParts = [];

        if (content) {
            contentParts = content.replace(/["']/g, '').match(/filename\*?=([^;]+)/);
        }

        const extractedName = contentParts && contentParts.length >= 1 ?
            contentParts[1] :
            (this.params.url.split('/') as any).pop().split('?')[0];

        return this.params.nameCallback(extractedName);
    }

    createLink() {
        let link = document.createElement('a');

        link.style.display = 'none';
        return link;
    }

    clickLink() {
        let event;

        try {
            event = new MouseEvent('click');
        } catch (e) {
            event = document.createEvent('MouseEvent');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }

        this.link.dispatchEvent(event);
    }

    getFile(response, fileName) {
        let file: any = null;
        let options = { type: 'application/octet-stream' };

        try {
            file = new File([response], fileName, options);
        } catch (e) {
            file = new Blob([response], options);
            file.name = fileName;
            file.lastModifiedDate = new Date();
        }
        return file;
    }

    startDownload() {
        let fileName = this.getFileName();
        let file = this.getFile(this.request.response, fileName);

        // native IE
        if ('msSaveOrOpenBlob' in window.navigator) {
            return (window as any).navigator.msSaveOrOpenBlob(file, fileName);
        }

        let objectUrl = window.URL.createObjectURL(file);

        this.link.href = objectUrl;
        this.link.download = fileName;
        this.clickLink();

        setTimeout(() => {
            (window.URL || window.webkitURL || window).revokeObjectURL(objectUrl);
        }, 1000 * 40);

        return this;
    }

}