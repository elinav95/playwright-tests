import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'test', // Specify the folder where your test files are located
    use: {
        baseURL: 'https://www.saucedemo.com',
    },
    reporter: [['html', { outputFolder: 'playwright-report' }]], // HTML report output
});
