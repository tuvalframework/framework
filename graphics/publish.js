var shell = require('shelljs');
/*
if (shell.exec('git commit -m "."').code !== 0) {

}

if (shell.exec('npm run buildprod').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}

if (shell.exec('rm index.js.map').code !== 0) {
    shell.echo('Bundle failed');

}

if (shell.exec('npm version patch -m "Upgrade to new version"').code !== 0) {
    shell.echo('Bundle failed');
    shell.exit(1);
}

if (shell.exec('git commit -m "version updated"').code !== 0) {

}


if (shell.exec('cp package.json dist').code !== 0) {
    shell.echo('Bundle failed');
    shell.exit(1);
}
*/

if (shell.exec('./publish.sh').code !== 0) {
    shell.echo('Bundle failed');
    shell.exit(1);
}

