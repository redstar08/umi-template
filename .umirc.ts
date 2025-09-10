import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { defineConfig } from '@umijs/max';
import { proxy } from './config/proxy';
import { routes } from './config/routes';

const isProd = process.env.NODE_ENV === 'production';

const TerserPlugin = require('terser-webpack-plugin');

export default defineConfig({
    alias: {
        '@': path.resolve(__dirname, 'src'),
        config: path.resolve(__dirname, 'config'),
        public: path.resolve(__dirname, 'public'),
    },
    links: [],
    metas: [
        {
            httpEquiv: 'Cache-Control',
            content: 'no-cache',
        },
        {
            httpEquiv: 'referrer',
            content: 'no-referrer',
        },
        {
            httpEquiv: 'Pragma',
            content: 'no-cache',
        },
        {
            httpEquiv: 'Expires',
            content: '0',
        },

        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
        },
    ],
    headScripts: [],
    jsMinifier: 'terser',
    codeSplitting: {
        jsStrategy: 'granularChunks',
    },
    lessLoader: {
        modifyVars: {
            hack: 'true; @import "src/variable.less";',
        },
    },
    hash: true,
    outputPath: `dist`,
    chainWebpack(memo, {}) {
        // 压缩配置
        memo.optimization.minimizer('terser').use(TerserPlugin, [
            {
                terserOptions: {
                    compress: { pure_funcs: ['console.log', 'console.warn'] },
                },
            },
        ]);

        return memo;
    },

    publicPath: isProd ? '/' : undefined,
    antd: {
        configProvider: {},
    },
    access: {},
    model: {},
    title: 'Umi Demo',
    initialState: {},
    request: {},
    npmClient: 'pnpm',
    esbuildMinifyIIFE: true,
    routes,
    proxy,
    plugins: [],
    inlineLimit: 10,
    tailwindcss: {},
});
