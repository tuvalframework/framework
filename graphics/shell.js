var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
}

shell.cp('-Rf', './dist/index.js', '../../../realmocean/realm-runtime/src/portal/static/bios/tuval-graphics.js');