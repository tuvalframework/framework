var shell = require('shelljs');
if (shell.exec('npm run buildweb').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}

//shell.cp('-Rf', './dist/index.js', '../../../realmocean/new-enterprise-bios/node_modules/@tuval/forms');

shell.cp('-Rf', './dist/index.js', '../../../realmocean/realm-runtime/src/portal/static/bios/tuval-forms.js');
shell.cp('-Rf', './dist/index.js', '../../../realmocean/realmocean-console/src/portal/static/tuval-forms.js');

shell.cp('-Rf', './dist/index.d.ts', '../../../realmocean/realmocean-console-bios/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/index.js', '../../../celmino/web-app/public/bios/tuval-forms.js');