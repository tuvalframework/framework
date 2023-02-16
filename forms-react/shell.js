var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}

shell.cp('-Rf', './dist/index.js', '../../../realmocean/new-enterprise-bios/node_modules/@tuval/forms');

shell.cp('-Rf', './dist/index.d.ts', '../../../realmocean/new-enterprise-bios/node_modules/@tuval/forms');