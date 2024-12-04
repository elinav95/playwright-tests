import { test, expect } from '@playwright/test';

// Utility function to get all product names
async function getProductNames(page) {
    const products = await page.locator('.inventory_item_name');
    return await products.allTextContents();
}

// Utility function to get all product prices
async function getProductPrices(page) {
    const prices = await page.locator('.inventory_item_price');
    return await prices.allTextContents();
}
// Utility function to add products to the cart
async function addToCart(page, productIndex) {
    const product = await page.locator(`.inventory_item:nth-child(${productIndex}) .btn_inventory`);
    await product.click();
}

// First Test Case: Verify product sorting functionality
test('Verify sorting of products by name and price', async ({ page }) => {
    // Step 1: Navigate to the login page and log in with valid credentials
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Step 2: Verify that the user is redirected to the inventory page
    expect(await page.url()).toBe('https://www.saucedemo.com/inventory.html');

    // Step 3: Test sorting by Name (A to Z)
    await page.selectOption('.product_sort_container', { label: 'Name (A to Z)' });
    let productNamesAtoZ = await getProductNames(page);
    let sortedProductNamesAtoZ = [...productNamesAtoZ].sort();
    expect(productNamesAtoZ).toEqual(sortedProductNamesAtoZ);

    // Step 4: Test sorting by Name (Z to A)
    await page.selectOption('.product_sort_container', { label: 'Name (Z to A)' });
    let productNamesZtoA = await getProductNames(page);
    let sortedProductNamesZtoA = [...productNamesZtoA].sort().reverse();
    expect(productNamesZtoA).toEqual(sortedProductNamesZtoA);

    // Step 5: Test sorting by Price (low to high)
    await page.selectOption('.product_sort_container', { label: 'Price (low to high)' });
    let productPricesLowToHigh = await getProductPrices(page);
    let sortedProductPricesLowToHigh = [...productPricesLowToHigh].sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')));
    expect(productPricesLowToHigh).toEqual(sortedProductPricesLowToHigh);

    // Step 6: Test sorting by Price (high to low)
    await page.selectOption('.product_sort_container', { label: 'Price (high to low)' });
    let productPricesHighToLow = await getProductPrices(page);
    let sortedProductPricesHighToLow = [...productPricesHighToLow].sort((a, b) => parseFloat(b.replace('$', '')) - parseFloat(a.replace('$', '')));
    expect(productPricesHighToLow).toEqual(sortedProductPricesHighToLow);
});

//Second Test Case: Verify cart is empty after logging in as another user
test('Verify cart is empty when logged in as another user', async ({ page }) => {
    // Step 1: Log in as standard_user and add two products to the cart
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Step 2: Add two products to the cart
    await addToCart(page, 1); // Add first product (index 1)
    await addToCart(page, 2); // Add second product (index 2)
    
    // Step 3: Verify that the cart has 2 items
    const cartCountBeforeLogout = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCountBeforeLogout).toBe('2');
    
    // Step 4: Log out
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    
    // Step 5: Log in as visual_user
    await page.fill('#user-name', 'visual_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Step 6: Verify that the cart is empty (cart count should be 0)
    const cartCountAfterLogin = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCountAfterLogin).toBeNull(); // Cart should be empty and the badge should not appear
});