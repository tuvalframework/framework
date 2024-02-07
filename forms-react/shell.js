var shell = require('shelljs');
if (shell.exec('npm run buildweb').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}


//shell.cp('-Rf', './dist/index.js', '../../../realmocean/realm-runtime/src/portal/static/bios/tuval-forms.js');
shell.cp('-Rf', './dist/index.js', '/Users/selimtan/Organizations-New/realmocean/runtime/app/realmocean/bios/tuval-forms.js');

//shell.cp('-Rf', './dist/index.js', '../../../realmocean_new/runtime/app/realmocean/bios/tuval-forms.js');

/* shell.cp('-Rf', './dist/index.d.ts', '../../../realmocean/realmocean-console-bios/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/index.js', '../../../celmino/web-app/public/bios/tuval-forms.js');
shell.cp('-Rf', './dist/index.js', '../../../celmino_new/web-app/app/realm/bios/tuval-forms.js'); */

shell.echo(`Exposing to docker`);
shell.exec(`docker cp  ./dist/index.js  realmocean-dev:/usr/src/code/app/realmocean/bios/tuval-forms.js`);
shell.echo(`Expose complated.`);

shell.echo(`Restarting`);
shell.cd('/Users/selimtan/Organizations-New/celmino');
shell.exec(`docker-compose restart`);

shell.echo(`All done.`);