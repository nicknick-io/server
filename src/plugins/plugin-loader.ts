import * as fs from 'fs';
import * as util from 'util';
import { RunePlugin, RunePluginAction } from '@server/plugins/plugin';


export const basicStringFilter = (pluginValues: string | string[], searchValue: string): boolean => {
    if(Array.isArray(pluginValues)) {
        if(pluginValues.indexOf(searchValue) === -1) {
            return false;
        }
    } else {
        if(pluginValues !== searchValue) {
            return false;
        }
    }

    return true;
};

export const basicNumberFilter = (pluginValues: number | number[], searchValue: number): boolean => {
    if(Array.isArray(pluginValues)) {
        if(pluginValues.indexOf(searchValue) === -1) {
            return false;
        }
    } else {
        if(pluginValues !== searchValue) {
            return false;
        }
    }

    return true;
};

export const pluginFilter = (pluginIds: number | number[], searchId: number, pluginOptions?: string | string[], searchOption?: string): boolean => {
    if(pluginIds !== undefined) {
        if(Array.isArray(pluginIds)) {
            if(pluginIds.indexOf(searchId) === -1) {
                return false;
            }
        } else {
            if(pluginIds !== searchId) {
                return false;
            }
        }
    }

    if(pluginOptions !== undefined && searchOption !== undefined) {
        if(Array.isArray(pluginOptions)) {
            return pluginOptions.indexOf(searchOption) !== -1;
        } else {
            return pluginOptions === searchOption;
        }
    } else {
        return true;
    }
};

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const blacklist = ['plugin-loader.js', 'plugin.js'];

async function* getFiles(directory: string): AsyncGenerator<string> {
    const files = await readdir(directory);

    for(const file of files) {
        const invalid = blacklist.some(component => file === component || file.endsWith('.map'));

        if(invalid) {
            continue;
        }

        const path = directory + '/' + file;
        const statistics = await stat(path);

        if(statistics.isDirectory()) {
            for await (const child of getFiles(path)) {
                yield child;
            }
        } else {
            yield path;
        }
    }
}

export const JS_PLUGIN_DIRECTORY = 'plugins';

export async function loadJSPlugins(): Promise<RunePlugin[]> {
    const plugins: RunePlugin[] = [];

    for await(const path of getFiles(JS_PLUGIN_DIRECTORY)) {
        const location = '../../' + path;
        const actions: RunePluginAction | RunePluginAction[] = (require(location));
        plugins.push(new RunePlugin(actions));
    }

    return plugins;
}

export const TS_PLUGIN_DIRECTORY = './dist/plugins';

export async function loadTSPlugins(): Promise<RunePlugin[]> {
    const plugins: RunePlugin[] = [];

    for await(const path of getFiles(TS_PLUGIN_DIRECTORY)) {
        const location = '.' + path.substring(TS_PLUGIN_DIRECTORY.length).replace('.js', '');
        const plugin = require(location);
        plugins.push(plugin.default as RunePlugin);
    }

    return plugins;
}
