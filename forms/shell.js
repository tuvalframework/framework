var shell = require('shelljs');
if (shell.exec('npm run wbuild').code !== 0) {
    shell.echo('Build failed');
    shell.exit(1);
}
/* if (shell.exec('npm run bundle').code !== 0) {
    shell.echo('Bundlet failed');
    shell.exit(1);
} */

//shell.cp('-Rf', './dist/*', '../diagram/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../core-graphics/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../coreplus/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../graphics/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../forms/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../winforms/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../gui/node_modules/@tuval/core');
//shell.cp('-Rf', './dist/*', '../gui/node_modules/@tuval/core');

shell.cp('-Rf', './dist/*', '../../DemoApp/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Realms/realmocean/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Platforms/BPMGenesisSite/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Applications/BPMGenesis/Aristo/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Applications/BPMGenesis/ProcessMining/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Applications/BPMGenesis/IconLibrary/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Applications/BPMGenesis/TenantManager/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../../Applications/BPMGenesis/RealmManager/node_modules/@tuval/forms');

shell.cp('-Rf', './dist/*', '../components/buttons/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/popups/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/navigations/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/charts/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/diagram/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/layouts/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/file-manager/node_modules/@tuval/forms');
shell.cp('-Rf', './dist/*', '../components/grids/node_modules/@tuval/forms');




//shell.cp('-Rf', './dist/tuval-core-wp.js', '../../Tuval_Test_v_1/dist');