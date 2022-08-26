var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
}

// shell.cp('-Rf', './dist/*', '../graphics/node_modules/@tuval/core-graphics');
shell.cp('-Rf', './dist/*', '../graphics/node_modules/@tuval/cg');
shell.cp('-Rf', './dist/*', '../winforms/node_modules/@tuval/cg');
shell.cp('-Rf', './dist/*', '../forms/node_modules/@tuval/cg');
shell.cp('-Rf', './dist/*', '../../Tuval_Test_v2/node_modules/@tuval/cg');
shell.cp('-Rf', './dist/*', '../../DemoApp/node_modules/@tuval/cg');
//shell.cp('-Rf', './dist/tuval-core-graphics-wp.js', '../../Tuval_Test/dist/webworker');