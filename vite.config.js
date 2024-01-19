import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@composables': path.resolve(__dirname, './src/composables'),
			'@helpers': path.resolve(__dirname, './src/helpers'),
			'@models': path.resolve(__dirname, './src/models'),
			'@router': path.resolve(__dirname, './src/router'),
			'@layouts': path.resolve(__dirname, './src/router/layouts'),
			'@pages': path.resolve(__dirname, './src/router/pages'),
			'@services': path.resolve(__dirname, './src/services'),
			'@store': path.resolve(__dirname, './src/store'),
			'@style': path.resolve(__dirname, './src/style'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@vendor': path.resolve(__dirname, './src/vendor'),
			'@docs': path.resolve(__dirname, './docs')
		}
    }
});