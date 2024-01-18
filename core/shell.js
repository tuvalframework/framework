var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}
if (shell.exec('npm run bundle').code !== 0) {
    shell.echo('Bundlet failed');
    shell.exit(1);
}

