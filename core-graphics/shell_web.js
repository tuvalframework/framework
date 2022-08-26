var shell = require('shelljs');
 if (shell.exec('npm run webbuild').code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
  }
