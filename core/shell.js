var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}
if (shell.exec('npm run bundle').code !== 0) {
    shell.echo('Bundlet failed');
    shell.exit(1);
}

//shell.cp('-Rf', './dist/*', '../diagram/node_modules/@tuval/core');
shell.cp('-Rf', './dist/*', '../core-graphics/node_modules/@tuval/core');
shell.cp('-Rf', './dist/*', '../coreplus/node_modules/@tuval/core');
shell.cp('-Rf', './dist/*', '../graphics/node_modules/@tuval/core');
shell.cp('-Rf', './dist/*', '../forms/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../winforms/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../gui/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../gui/node_modules/@tuval/core');

shell.cp('-Rf', './dist/*', '../../Tuval_Test_v2/node_modules/@tuval/core');
shell.cp('-Rf', './dist/*', '../../../DemoApp/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/tuval-core-wp.js', '../../Tuval_Test_v_1/dist');