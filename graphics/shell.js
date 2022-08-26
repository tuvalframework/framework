var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
}

shell.cp('-Rf', './dist/*', '../forms/node_modules/@tuval/graphics');
shell.cp('-Rf', './dist/*', '../gui/node_modules/@tuval/graphics');
shell.cp('-Rf', './dist/*', '../diagram/node_modules/@tuval/graphics');
shell.cp('-Rf', './dist/*', '../winforms/node_modules/@tuval/graphics');
shell.cp('-Rf', './dist/*', '../../Tuval_Test_v2/node_modules/@tuval/graphics');

shell.cp('-Rf', './dist/*', '../../DemoApp/node_modules/@tuval/graphics');
//shell.cp('-Rf', './dist/tuval-graphics-wp.js', '../../Tuval_Test_v_1/dist/webworker');