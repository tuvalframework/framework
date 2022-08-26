import { Context } from '../Context';
import { TVC } from './TVC';

export class Filesystem {
    tvc: TVC;
    currentPath: string;
    assigns: any;
    noCase: boolean;
    driveToFilesystem: any;
    fileSystems: any;
    nextDescriptor: any;
    driveList: any[] = undefined as any;
    nextDrive: number = undefined as any;
    static files: any; // başka dosyada

    public constructor(tvc: TVC) {
        this.tvc = tvc;
        this.currentPath = 'application:';
        this.assigns = {};
        this.noCase = true;
        if (this.tvc.manifest.filesystem && this.tvc.manifest.filesystem.caseSensitive)
            this.noCase = !this.tvc.manifest.filesystem.caseSensitive;

        this.driveToFilesystem = {};
        var list =
            [
                { className: 'Filesystem_Application', token: 'application' },
                { className: 'Filesystem_Atom', token: 'atom' },
                { className: 'Filesystem_GoogleDrive', token: 'googledrive' },
                { className: 'Filesystem_Server', token: 'server' },
                { className: 'Filesystem_Python', token: 'python' },
                //{ className: 'Filesystem_HTTP', token: 'http' },
            ];
        var drivesToAdd =
            [

            ];

        var self = this;
        this.fileSystems = {};
        this.tvc.loadingMax++;
        var count = 0;
        for (var f = 0; f < list.length; f++) {
            if (Context.Current.get(list[f].className)) {
                count++;
            }
        }
        setTimeout(function () {
            for (var f = 0; f < list.length; f++) {
                var info = list[f];

                if (Context.Current.get(info.className)) {
                    Context.Current.get(info.className).isActive(tvc, function (response, data, extra) {
                        if (response) {
                            self.fileSystems[extra.token] = new ((Context as any).Current.get(info.className))(self.tvc, self.noCase);
                            self.fileSystems[extra.token].className = extra.className;
                        }

                        count--;
                        if (count == 0) {
                            // Make the drives / file system table
                            var count2 = 0;
                            for (var ff in self.fileSystems)
                                count2++;
                            for (var ff in self.fileSystems) {
                                self.fileSystems[ff].getDriveList({ noErrors: true }, function (response, data, extra) {
                                    console.log('Filesystem: ' + ff + ', response: ' + response);
                                    if (response) {
                                        for (var d = 0; d < data.length; d++) {
                                            self.driveToFilesystem[data[d].toLowerCase()] = self.fileSystems[ff];
                                        }
                                    }
                                    count2--;
                                    if (count2 == 0) {
                                        // Add the Resource Drive folders
                                        for (var rd = 0; rd < drivesToAdd.length; rd++) {
                                            const dr: any = drivesToAdd[rd];
                                            for (var fff in self.driveToFilesystem) {
                                                if (dr.className == self.driveToFilesystem[fff].className) {
                                                    self.driveToFilesystem[dr.token] = self.driveToFilesystem[fff];
                                                    break;
                                                }
                                            }
                                        }
                                        // If under ATOM, add the default TVC folders
                                        try {
                                            if (window.parent != null && (window.parent as any).atom != null) {
                                                var found = false;
                                                for (var fff in self.driveToFilesystem) {
                                                    if (self.driveToFilesystem[fff].className == 'Filesystem_Atom') {
                                                        found = true;
                                                        break;
                                                    }
                                                }
                                                const setDrive = (token) => {
                                                    var path = (window.parent as any).atom.tvcAPI.getInstallationPath(token);
                                                    if (path) {
                                                        var fs = new window['Filesystem_Atom'](self.tvc, self.noCase);
                                                        fs.className = 'Filesystem_Atom';
                                                        fs.replaceDrive = path;
                                                        self.driveToFilesystem[token] = fs;
                                                    }
                                                }
                                                setDrive('help');
                                                setDrive('tutorials');
                                                setDrive('documentation');
                                                setDrive('accessories');
                                                setDrive('applications');
                                                setDrive('my tvc applications');
                                            }
                                        }
                                        catch (err) {
                                        }
                                        self.tvc.loadingCount++;
                                    }
                                }, f);
                            }
                        }
                    }, info);
                }
            }
        }, 1);
    }
    public getFile(path, options?) {
        path = typeof path == 'undefined' ? this.currentPath : path;

        options = typeof options == 'undefined' ? {} : options;
        var result: any =
        {
            fileSystem: null,
            path: '',
            drive: '',
            dir: '',
            filename: '',
            extension: '',
            error: false
        };
        if (options.asset) {
            if (path.indexOf('/') >= 0)
                result.path = path;
            else
                result.path = 'resources/assets/' + path;
            result.extension = this.tvc.utilities.getFilenameExtension(path);
            return result;
        }

        // Extract drive
        var drive = '';
        path = this.tvc.utilities.replaceStringInText(path, '\\', '/');
        while (true) {
            var column = path.indexOf(':');
            if (column >= 0) {
                drive = path.substring(0, column);
                path = path.substring(column + 1);
                var temp;
                if ((temp = this.tvc.utilities.getPropertyCase(this.assigns, drive, this.noCase)))
                    result.drive = temp;
            }
            else {
                if (path.indexOf('/') == 0) {
                    drive = 'application';
                }
                else {
                    path = this.currentPath + path;
                    continue;
                }
            }
            break;
        };

        // Assign filesystem
        if (drive.toLowerCase() == 'http' || result.drive.toLowerCase() === 'https') {
            result.fileSystem = (this as any).fileSystem('html');
        }
        else if (drive.toLowerCase() == 'assets') {
            result.fileSystem = (this as any).fileSystem('html');
        }
        else {
            if (this.driveToFilesystem[drive.toLowerCase()]) {
                result.fileSystem = this.driveToFilesystem[drive.toLowerCase()];
                result.drive = drive;
                if (result.fileSystem.replaceDrive)
                    result.path = result.fileSystem.replaceDrive + '/' + path;
                else
                    result.path = result.drive + ':' + path;
                result.filename = this.tvc.utilities.getFilename(result.path);
                result.extension = this.tvc.utilities.getFilenameExtension(result.path);
                result.dir = this.tvc.utilities.getDir(result.path);
            }
            else {
                if (!options.noErrors)
                    throw 'filesystem_not_supported';
                result.error = 'filesystem_not_supported';
            }
        }
        return result;
    };
    private getDescriptor(descriptor) {
        if (!descriptor)
            descriptor = this.getFile(this.currentPath);
        if (typeof descriptor == 'string')
            descriptor = this.getFile(descriptor);
        return descriptor;
    };

    private saveFile(descriptor, source, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        descriptor.fileSystem.write(descriptor.path, source, options, callback, extra);
    };

    public loadFile(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        descriptor.fileSystem.read(descriptor.path, options, callback, extra);
    }

    public saveBinary(descriptor, options, callback, extra?) {
        descriptor = this.getDescriptor(descriptor);
        var memoryBlock = this.tvc.getMemoryBlockFromAddress(options.start);
        let arrayBuffer;
        if (options.end)
            arrayBuffer = memoryBlock.extractArrayBuffer(options.start, options.end);
        else
            arrayBuffer = memoryBlock.extractArrayBuffer(options.start, options.length);
        if (arrayBuffer) {
            this.saveFile(descriptor, arrayBuffer, { encoding: null }, callback, extra);
            return;
        }
    };

    private saveBank(index, descriptor, tags, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        var bank = this.tvc.Banks.getBank(index);
        bank.save(descriptor, tags, function (response, data, extra) {
            callback(response, data, extra);
        }, extra);
    };
    private loadBinary(descriptor, start, callback, extra) {
        descriptor = this.getDescriptor(descriptor);

        var self = this;
        descriptor.fileSystem.read(descriptor.path, { binary: true }, function (response, data, extra) {
            if (response) {
                var info = self.tvc.getMemory(start);
                try {
                    info.block.pokeArrayBuffer(info.start, data);
                }
                catch (error) {
                    callback(false, error, extra);
                    return;
                }
                callback(true, info, extra);
            }
            else {
                callback(false, 'cannot_load_file', extra);
            }
        }, extra);
    };

    private fileLength(descriptor, callback, extra, options /*options sonradan eklendi.*/) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.stat(descriptor.path, options, callback, extra);
    };
    private getFilter(path) {
        var result: any = undefined;
        var filename = this.tvc.utilities.getFilenameAndExtension(path);
        if (filename) {
            if (filename.indexOf('*') >= 0 || filename.indexOf('?') >= 0) {
                result =
                {
                    filter: filename,
                    path: path.substring(0, path.length - (filename.length))
                }
            }
        }
        return result;
    };
    private dirFirst(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        this.nextDescriptor = descriptor;
        var filter = this.getFilter(descriptor.path);
        var path = descriptor.path;
        if (filter) {
            options.filters = [filter.filter];
            path = filter.path;
        }
        return descriptor.fileSystem.dirFirst(path, options, callback, extra);
    }

    private dirNext(options, callback, extra) {
        if (!this.nextDescriptor)
            throw { error: 'illegal_function_call', parameter: '(Call Dir First$ first!)' };

        var result = this.nextDescriptor.fileSystem.dirNext({}, function (response, data, extra) {
            if (response) {
                if (!data)
                    this.nextDescriptor = null;
                callback(true, data, extra);
            }
            else {
                callback(false, data, extra);
            }
        }, extra);
        return result;
    };
    private driveFirst(options, callback, extra) {
        //descriptor = this.getDescriptor( descriptor );
        //this.nextDescriptor = descriptor;
        if (!callback)
            throw 'illegal_function_call';

        this.driveList = [];
        var count = 0;
        for (var f in this.fileSystems)
            count++;
        var self = this;
        for (var f in this.fileSystems) {
            this.fileSystems[f].getDriveList({ noErrors: true }, function (response, data, extra) {
                if (response) {
                    for (var d = 0; d < data.length; d++) {
                        self.driveList.push(data[d]);
                    }
                }
                count--;
                if (count == 0) {
                    self.nextDrive = 0;
                    return self.driveNext(options, callback, extra);
                }
            }, f);
        }
    };
    private driveNext(options, callback, extra) {
        if (!this.driveList)
            throw { error: 'illegal_function_call', parameter: 'Call Drive First$ first!)' };

        var result = '';
        if (this.nextDrive < this.driveList.length) {
            result = this.driveList[this.nextDrive++];
        }
        else {
            this.driveList = null as any;
        }

        if (callback)
            callback(true, result, extra);
        return result;
    };
    private mkDir(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.mkDir(descriptor.path, options, callback, extra);
    };
    private exist(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.exist(descriptor.path, options, callback, extra);
    };
    private rename(srcDescriptor, destPath, options, callback, extra) {
        srcDescriptor = this.getDescriptor(srcDescriptor);
        return srcDescriptor.fileSystem.rename(srcDescriptor.path, destPath, options, callback, extra);
    };
    private kill(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.kill(descriptor.path, options, callback, extra);
    };
    private dFree(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.dFree(descriptor.path, options, callback, extra);
    };
    private stat(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.stat(descriptor.path, options, callback, extra);
    };
    private chDir(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        return descriptor.fileSystem.chDir(descriptor.path, options, callback, extra);
    };
    private openFileRequester(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        descriptor.fileSystem.openFileRequester(descriptor.drive + ':' + descriptor.dir, options, function (response2, result, extra) {
            callback(response2, result, extra);
        }, extra);
        return '';
    };
    private openFolderRequester(descriptor, options, callback, extra) {
        descriptor = this.getDescriptor(descriptor);
        descriptor.fileSystem.openFolderRequester(descriptor.drive + ':' + descriptor.dir, options, function (response2, result, extra) {
            callback(response2, result, extra);
        }, extra);
        return '';
    };


    private setDir$(path, callback, extra) {
        path = this.tvc.utilities.replaceStringInText(path, '\\', '/');
        var end = path.charAt(path.length - 1);
        if (end != ':' && end != '/')
            path += '/';
        this.getFile(path, { mustExist: true, onlyDirectory: true });		// Genrates errors...
        this.currentPath = path;
        if (callback)
            callback(true, {}, extra);
    };
    private getDir$(callback, extra) {
        var result = this.currentPath;
        if (callback)
            callback(true, result, extra);
        return result;
    };
    private assign(from, to, callback, extra) {
        if (from.charAt(from.length - 1) == ':')
            from = from.substring(0, from.length - 1);
        if (to.charAt(to.length - 1) == ':')
            to = to.substring(0, to.length - 1);
        if (!Filesystem.files[to])
            throw 'drive_not_found';
        this.assigns[from] = to;
        if (callback)
            callback(true, {}, extra);
    };
    private parent(callback, extra) {
        var pos = this.currentPath.lastIndexOf('/');
        if (pos >= 0) {
            pos = this.currentPath.lastIndexOf('/', pos - 1);
            if (pos < 0) {
                pos = this.currentPath.indexOf(':');
                if (pos < 0)
                    pos = 0;
            }
            this.currentPath = this.currentPath.substring(0, pos + 1);
        }
        if (callback)
            callback(true, {}, extra);
    };
}