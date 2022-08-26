var shell = require('shelljs');

if (shell.exec('publish.sh').code !== 0) {
    shell.echo('Bundle failed');
    shell.exit(1);
}