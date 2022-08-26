var shell = require('shelljs');
if (shell.exec('npm run wpbuild').code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}

  shell.cp('-Rf', './dist_wp/tuval-core-graphics-wp.js', '../../Tuval_Test_v2/dist');