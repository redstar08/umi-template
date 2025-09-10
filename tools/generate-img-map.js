'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const projectPath = path.resolve(__dirname, '..'); // 跟目录
const { walkDirSync } = require('./tools-common');

function nameWithoutExt(name) {
    return name.split('.').slice(0, -1).join('-');
}

const generateMap = (map, assetDir, theme = true) => {
    let result = '';
    Object.keys(map).forEach((item) => {
        if (theme) {
            result += `\t'${item}': {\n\t\tlight: urlPath() + '${assetDir}${map[item]}',\n\t\tdark: urlPath() + '${assetDir}${map[item]}',\n\t},\n`;
        } else {
            result += `\t'${item}': urlPath() + '${assetDir}${map[item]}',\n`;
        }
    });
    return `{\n${result}}`;
};

function updateAssetsMap({ targetFilePath, assetDir, mapName, theme = true }) {
    const assetPath = path.resolve(projectPath, 'public', assetDir);
    const map = {};

    walkDirSync(assetPath, (filePath, name) => {
        const relativePath = path.relative(assetPath, filePath);

        const key = nameWithoutExt(relativePath).replace(/\//g, '-');
        if (!key) return;
        map[key] = relativePath;
    });

    const mapNameUpperCase = mapName[0].toUpperCase() + mapName.slice(1);

    // 写入文件
    fs.writeFileSync(
        targetFilePath,
        `/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/indent */
// 本文件为自动生成，不要手动修改
// npm run update:assets
import { urlPath } from './cdn';

export type ${mapNameUpperCase}NameType = keyof typeof ${mapNameUpperCase};

export const ${mapNameUpperCase} = ${generateMap(map, assetDir, theme)};
`,
    );

    console.log(chalk.cyan(`成功生成资源映射文件 (共${Object.keys(map).length} 项): ${targetFilePath}\n`));
}

updateAssetsMap({
    mapName: 'images',
    assetDir: 'images/',
    targetFilePath: path.resolve(projectPath, 'config/images.ts'),
});

updateAssetsMap({
    theme: false,
    mapName: 'fonts',
    assetDir: 'fonts/',
    targetFilePath: path.resolve(projectPath, 'config/fonts.ts'),
});
