import { httpDo } from "./httpDo";


export function using(packageNames: string[], callback: Function) {
  /*   const url = 'https://tuvalframework.github.io/js/packages/';
    const packageUrl = url + packageNames[0] + '/index.js';
    var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = false;
        dsq.src = packageUrl;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq); */

     let countOfWillLoadPackages = packageNames.length;
    for (let i = 0; i < packageNames.length; i++) {
        const url = 'https://tuvalframework.github.io/js/packages/';
        const packageUrl = url + packageNames[i] + '/index.js';

       /*  httpDo(packageUrl, 'GET', (data: string) => {
            eval(data);
            countOfWillLoadPackages--;
            if (countOfWillLoadPackages === 0) {
                callback();
            }
        }); */
    }

}
