import { TVC } from './TVC';
import { Filesystem } from './Filesystem';
import { Utilities } from './Utilities';
declare var localStorage, source;

export class Filesystem_Application {
    tvc: TVC;
    noCase: boolean;
    utilities: Utilities;
    data: any[];
    externalFiles: boolean;
    currentPath: any;
    fileList: any[] = undefined as any;
    fileListPosition: number = undefined as any;
    public constructor(tvc: TVC, noCase: boolean) {
        this.tvc = tvc;
        this.noCase = noCase;
        this.utilities = tvc.utilities;
        this.data = [];

        // Get the content of localStorage
        var currentFiles;
        try {
            currentFiles = JSON.parse(localStorage.getItem('tvc_current_files'));
        }
        catch (error) { }
        if (currentFiles) {
            var toRemove: any[] = [];
            for (var sourcePath in currentFiles.files) {
                var column = sourcePath.indexOf(':');
                var drive = sourcePath.substring(0, column);
                var path = sourcePath.substring(column + 1);
                var filename = this.utilities.getFilenameAndExtension(path);
                var files = Filesystem.files[drive];
                var parent = files;
                if (files) {
                    var slash = path.indexOf('/');
                    while (slash >= 0) {
                        var f = path.substring(0, slash);
                        if (f == '')
                            break;
                        parent = files;
                        files = files[f];
                        if (!files) {
                            files = {};
                            parent[f] = files;
                        }
                        path = path.substring(slash + 1);
                        slash = path.indexOf('/');
                    }
                    files[path] = { name: filename, length: currentFiles.files[sourcePath].l, localStorage: currentFiles.files[sourcePath].n };
                }
                else {
                    // Drive does not exist: delete all files from localStorage
                    for (var pathBad in currentFiles.files) {
                        var driveBad = pathBad.substring(0, pathBad.indexOf(':'));
                        if (driveBad == drive) {
                            localStorage.removeItem('tvc_' + currentFiles.files[pathBad].n);
                            toRemove.push(pathBad);
                        }
                    }
                }
            }
            if (toRemove.length) {
                var temp = { number: currentFiles.number, files: {} };
                for (var f in currentFiles.files) {
                    for (var ff = 0; ff < toRemove.length; ff++) {
                        if (f != toRemove[ff]) {
                            temp.files[f] = currentFiles.files[f];
                        }
                    }
                }
                try {
                    localStorage.setItem('tvc_current_files', JSON.stringify(temp));
                }
                catch (error) { }
            }
        }
        this.externalFiles = true;
    }

    private getFile(path, options?) {
        options = typeof options == 'undefined' ? {} : options;
        var result: any =
        {
            isFileSystem: true,
            isDirectory: false,
            parent: null,
            files: null,
            file: null,
            filename: '',
            path: '',
            filter: '',
            error: false
        };

        path = this.utilities.replaceStringInText(path, '\\', '/');

        while (true) {
            var column = path.indexOf(':');
            if (column >= 0) {
                result.drive = path.substring(0, column);
                path = path.substring(column + 1);
            }
            else {
                if (path.indexOf('/') == 0) {
                    result.drive = 'application';
                }
                else {
                    path = this.currentPath + path;
                    continue;
                }
            }
            break;
        };

        result.files = this.utilities.getPropertyCase(Filesystem.files, result.drive, this.noCase);
        if (!result.files) {
            result.error = 'drive_not_found';
            if (!options.noErrors)
                throw result.error;
        }
        else {
            result.parent = Filesystem;
            result.path = result.drive + ':' + path;

            var slash = path.indexOf('/');
            while (slash >= 0) {
                var f = path.substring(0, slash);
                if (f == '')
                    break;
                result.parent = result.files;
                result.files = this.utilities.getPropertyCase(result.files, f, this.noCase);
                if (!result.files) {
                    result.error = 'directory_not_found';
                    if (!options.noErrors)
                        throw result.error;
                    break;
                }
                path = path.substring(slash + 1);
                slash = path.indexOf('/');
            }

            if (!result.error) {
                result.filename = path;
                result.isDirectory = false;
                if (path != '') {
                    if (path.indexOf('*') >= 0 || path.indexOf('?') >= 0) {
                        result.filter = path;
                        result.path = '';
                    }
                    else {
                        result.file = this.findFileInDirectory(result.files, path, this.noCase);
                        if (result.file) {
                            if (options.askForReplace) {
                                if (!confirm("File already exists, overwrite?")) {
                                    result.error = 'cannot_write_file';
                                    if (!options.noErrors)
                                        throw result.error;
                                }
                            }

                            result.isDirectory = result.file.isDirectory;
                            if (!result.file.isDirectory) {
                                if (options.onlyDirectories) {
                                    result.error = 'cannot_open_file';
                                    if (!options.noErrors)
                                        throw result.error;
                                }
                                else {
                                    result.filename = path;
                                }
                            }
                            else {
                                if (options.onlyFiles) {
                                    result.error = 'cannot_open_file';
                                    if (!options.noErrors)
                                        throw result.error;
                                }
                                else {
                                    result.files = result.file;
                                    result.file = null;
                                }
                            }
                        }
                        else {
                            if (options.mustExist) {
                                result.error = 'file_not_found';
                                if (!options.noErrors)
                                    throw result.error;
                            }
                        }
                    }
                }
                else {
                    if (!options.onlyFiles) {
                        result.isDirectory = true;
                        result.isRoot = true;
                        result.filename = result.drive;
                    }
                    else {
                        result.error = 'cannot_open_file';
                        if (!options.noErrors)
                            throw result.error;
                    }
                }
            }
        }
        return result;
    };
    private findFileInDirectory(directory, filename, noCase) {
        var fname = noCase ? filename.toLowerCase() : filename;
        for (let f in directory) {
            var file = directory[f];
            if (file && this.utilities.isObject(file)) {
                var name = noCase ? file.name.toLowerCase() : file.name;
                if (name == fname) {
                    return file;
                }
            }
        }
        return null;
    };
    private storageAvailable(type) {
        try {
            var storage: any = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && storage.length !== 0;
        }
    };
    private filter(name, filter) {
        if (!filter || filter == '')
            return true;

        name = this.noCase ? name : name.toLowerCase();
        filter = this.noCase ? filter : filter.toLowerCase();

        // Before the dot
        var f = 0;
        for (var n = 0; n < name.length; n++) {
            var char = name.charAt(n);
            if (char == '.')
                break;
            var charFilter = filter.charAt(f);
            if (charFilter == '*') {
                n = name.indexOf('.') >= 0 ? name.indexOf('.') : name.length;
                break;
            }
            if (charFilter != '?') {
                if (char != charFilter)
                    return false;
            }
            f++;
        }
        if (n == name.length)
            return true;
        f = filter.indexOf('.');
        if (f < 0)
            return false;
        for (++n, ++f; n < name.length; n++) {
            var char = name.charAt(n);
            var charFilter = filter.charAt(f);
            if (charFilter == '*')
                return true;
            if (charFilter != '?') {
                if (char != charFilter)
                    return false;
            }
            f++;
        }
        return true;
    };

    public static isActive(tvc, callback, extra) {
        if (callback)
            callback(true, {}, extra);
        return true;
    }
    private getDriveList(options, callback, extra) {
        var drives: any[] = [];
        for (var f in Filesystem.files)
            drives.push(f);
        if (callback)
            callback(true, drives, extra);
        return drives;
    };
    private open(path, options, callback, extra) {
    };
    private close(file, options, callback, extra) {
    };
    private exist(path, options, callback, extra) {
        if (path == '')
            throw { error: 'illegal_function_call', parameter: '(empty path)' };
        var info = this.getFile(path, { mustExist: true, noErrors: true });
        if (callback)
            callback(info.error == false, {}, extra);
        return info.error == false;
    };
    private read(path, options, callback, extra) {
        var descriptor = this.getFile(path, { mustExist: true, noErrors: true });
        if (descriptor.error) {
            callback(false, descriptor.error, extra);
            return;
        }
        const file: any = this.findFileInDirectory(descriptor.files, descriptor.filename, this.noCase);
        if (!file) {
            callback(false, 'file_not_found', extra);
            return;
        }

        if (typeof file.localStorage == 'undefined') {
            var self = this;
            var name = '';
            if (file.context)
                name += file.context + '_';
            name += file.number;
            this.utilities.loadScript('./resources/filesystem/' + name + '.js', {}, function (response, data, extra) {
                if (response) {
                    var data = Filesystem_Application.Filesdata[name];//file.number ];
                    if (options.responseType == 'text') {
                        var arrayBuffer = self.utilities.convertStringToArrayBuffer(data);
                        var view = new Uint8Array(arrayBuffer);
                        data = '';
                        for (var p = 0; p < view.byteLength; p++)
                            data += String.fromCharCode(view[p]);
                    }
                    else {
                        data = self.utilities.convertStringToArrayBuffer(data);
                        //Filesdata[ file.number ] = '';
                    }
                    callback(true, data, extra);
                    return;
                }
                callback(false, 'cannot_load_file', extra);
            }, extra);
        }
        else {
            if (!this.storageAvailable('localStorage'))
                throw 'local_storage_not_available';
            var data = localStorage.getItem('tvc_' + file.localStorage);
            if (options.responseType != 'text') {
                data = this.utilities.convertStringToArrayBuffer(data);
            }
            callback(true, data, extra);
        }
    };
    private write(path, data, options, callback, extra) {
        var descriptor = this.getFile(path);

        if (!this.storageAvailable('localStorage'))
            callback(false, 'local_storage_not_available', extra);

        var currentFiles;
        try {
            currentFiles = JSON.parse(localStorage.getItem('tvc_current_files'));
        }
        catch (error) { }
        if (!currentFiles)
            currentFiles = { number: 0, files: {} };

        var fileNumber, temp;
        if ((temp = this.utilities.getPropertyCase(currentFiles.files, descriptor.path, this.noCase)))
            fileNumber = temp.n;
        else
            fileNumber = currentFiles.number++;

        var length, type;
        if (typeof source == 'string') {
            try {
                localStorage.setItem('tvc_' + fileNumber, source);
                length = source.length;
                type = 't';
            }
            catch (error) {
                callback(false, 'disc_full', extra);
            }
        }
        else {
            var base64 = this.utilities.convertArrayBufferToString(source);
            try {
                localStorage.setItem('tvc_' + fileNumber, base64);
                length = source.byteLength;
                type = 'b';
            }
            catch (error) {
                callback(false, 'disc_full', extra);
            }
        }
        descriptor.files[descriptor.filename] = { name: descriptor.filename, length: length, localStorage: fileNumber, type: type };

        currentFiles.files[descriptor.path] = { n: fileNumber, l: length, t: type };
        localStorage.setItem('tvc_current_files', JSON.stringify(currentFiles));
        callback(true, {}, extra);
    };
    private mkDir(path, options, callback, extra) {
        if (path == '')
            throw { error: 'illegal_function_call', parameter: '(empty path)' };
        var info = this.getFile(path, { mustExist: false });
        info.files[info.name] = { name: info.name, isDirectory: true };
        if (callback)
            callback(true, {}, extra);
    };
    private rename(oldPath, newPath, options, callback, extra) {
        var info = this.getFile(oldPath, { mustExist: true, onlyFiles: true });
        var info2 = this.getFile(newPath, { mustExist: false, onlyFiles: true });
        if (this.findFileInDirectory(info.files, info2.filename, this.noCase))
            throw 'file_already_exist';
        info.file.name = info2.filename;
        if (callback)
            callback(true, {}, extra);
        return true;
    };
    private copy(srcPath, destPath, options, callback, extra) {
    };
    private kill(path, options, callback, extra) {
        var info = this.getFile(path, { mustExist: true, onlyFiles: true });
        info.files = this.utilities.cleanObject(info.files, info.file, this.noCase);
        if (callback)
            callback(true, {}, extra);
        return true;
    };
    private dFree(path, options, callback, extra) {
        if (localStorage) {
            var i = 0;
            try {
                // Test up to 10 MB
                for (i = 1000; i <= 10000; i += 1000) {
                    localStorage.setItem('size_test', new Array((i * 1024) + 1).join('a'));
                }
                localStorage.removeItem('size_test');
            }
            catch (e) {
                localStorage.removeItem('size_test');
            }
            if (callback)
                callback(true, (i - 1000) * 1024, extra);;
            return (i - 1000) * 1024;
        }
        return 0;
    };
    private stat(path, options, callback, extra) {
        var descriptor = this.getFile(path, { mustExist: true, noDirectory: true, noErrors: false });
        const file: any = this.findFileInDirectory(descriptor.files, descriptor.name, this.noCase);
        if (!file) {
            callback(false, 'file_not_found', extra);
            return;
        }
        var stat =
        {
            size: file.length,
            mode: 0,
            isFile: true,
            isDirectory: false
        }
        if (callback)
            callback(true, stat, extra);
        return stat;
    };
    private chMod(path, mode, options, callback, extra) {
        if (callback)
            callback(true, {}, extra);
        return true;
    };
    private chDir(path, options, callback, extra) {
        if (callback)
            callback(true, {}, extra);
        return true;
    };
    private openFileRequester(path, options, callback, extra) {
        if (callback)
            callback(false, undefined, extra);
        return undefined;
    };
    private openFolderRequester(path, options, callback, extra) {
        if (callback)
            callback(false, undefined, extra);
        return undefined;
    };
    private dirFirst(path, options, callback, extra) {
        var info = this.getFile(path, { mustExist: true, onlyDirectory: true });
        this.fileList = [];
        this.fileListPosition = 0;
        for (var f in info.files) {
            var file = info.files[f];
            if (this.utilities.isObject(file)) {
                if (this.filter(file.name, info.filter)) {
                    this.fileList.push(info.files[f]);
                }
            }
        }
        return this.dirNext(options, callback, extra);
    };
    private dirNext(options, callback, extra) {
        if (typeof this.fileList == 'undefined')
            throw { error: 'illegal_function_call', parameter: '' };
        if (this.fileListPosition < this.fileList.length) {
            var file = this.fileList[this.fileListPosition++];
            var stat =
            {
                name: file.name,
                size: typeof file.length == 'undefined' ? 0 : file.length,
                isDirectory: file.isDirectory,
                isFile: !file.isDirectory,
                mode: 0
            }
            if (callback)
                callback(true, stat, extra);
            return stat;
        }
        if (callback)
            callback(true, null, extra);
        return null;
    }
    private static Filesdata: any = {};
}

Filesystem.files =
{
    "application":
    {
        size: 1073741824,
        isDirectory: true,
        isRoot: true,
        "application_0": { length: 48, name: "empty.file", number: 0, context: "application" },
    },

};

