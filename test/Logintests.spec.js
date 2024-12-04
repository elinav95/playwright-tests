import { test, expect } from '@playwright/test';

// First test case: Successful login test
test('login with standard_user - valid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    expect(await page.url()).toBe('https://www.saucedemo.com/inventory.html');
});

// Second test case: Invalid credentials
test('login with valid username standard_user and null password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // Step 1: Enter valid username and null password
    await page.fill('#user-name', 'standard_user');  // Valid username
    await page.fill('#password', '');  // Null password
    await page.click('#login-button');
    
    // Step 2: Verify that an error message is displayed
    const errorMessage = await page.locator('.error-message-container').textContent();
    expect(errorMessage).toContain('Epic sadface: Password is required');
});

// Third test case: Verify error message and red X disappear when invalid credentials are removed
test('verify error message and red X disappear when invalid credentials are removed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // Step 1: Enter invalid credentials
    await page.fill('#user-name', 'invalid_user');  // Invalid username
    await page.fill('#password', 'wrong_password'); // Invalid password
    await page.click('#login-button');
    
    // Step 2: Verify that the error message and red "X" symbol appear
    const errorMessage = await page.locator('.error-message-container').textContent();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    
    const usernameFieldError = await page.locator('#user-name + svg').isVisible(); // Check for red X symbol near username
    const passwordFieldError = await page.locator('#password + svg').isVisible(); // Check for red X symbol near password
    expect(usernameFieldError).toBe(true);  // Expect red "X" symbol to be visible next to username
    expect(passwordFieldError).toBe(true);  // Expect red "X" symbol to be visible next to password
    
    // Step 3: Clear the invalid credentials
    await page.fill('#user-name', ''); // Clear username field
    await page.fill('#password', ''); // Clear password field
    
    // Step 4: Enter valid credentials
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Step 5: Verify that the error message and red "X" symbols are removed
    const errorMessageAfter = await page.locator('.error-message-container').textContent();
    expect(errorMessageAfter).not.toContain('Epic sadface');  // Error message should not be present

    const usernameFieldErrorAfter = await page.locator('#user-name + svg').isVisible();  // Red "X" after clearing
    const passwordFieldErrorAfter = await page.locator('#password + svg').isVisible();  // Red "X" after clearing
    expect(usernameFieldErrorAfter).toBe(false);  // Red "X" should no longer be visible next to username
    expect(passwordFieldErrorAfter).toBe(false);  // Red "X" should no longer be visible next to password
});
