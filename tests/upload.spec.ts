import{test, expect} from '@playwright/test';
import CartPage from '../pages/cart.page';
import path from 'path';
import { fileURLToPath } from 'url';

test.describe('Upload', () => {

  let cartPage: CartPage;
  const fileName = ['test.jpg', 'test.webp'];

  for(const name of fileName)
    {
      test(`should upload a test file ${name}`, async ({ page }) => {
        cartPage = new CartPage(page);
        await page.goto('https://practice.sdetunicorns.com/cart/');

        // path del archivo
        const filePath = fileURLToPath(new URL(`../data/${name}`, import.meta.url));
        //const filePath = path.join(__dirname, `../data/${name}`);

        // subida
        await page.setInputFiles('input#upfile_1', filePath);

        // click botón subir
        await page.locator('#upload_1').click();

        // espera para que tenga tiempo de subir, muestra error eslint
        await page.waitForTimeout(3000);

        // check
        // await expect(page.locator('wfu_messageblock_header_1_label_1')).toContainText('uploaded successfully');
        await expect(cartPage.uploadComponent().successTxt).toContainText('uploaded successfully');

  });  
  }
  

   test.skip('should upload a test file in hidden input field', async ({ page }) => {

     cartPage = new CartPage(page);

    await page.goto('https://practice.sdetunicorns.com/cart/');

    // path del archivo
    const filePath = path.join(__dirname, '../data/test.jpg');


    // editar el dominio para que aparezca el hidden input field
    await page.evaluate(()=> {
      const selector = document.querySelector('input#upfile_1')
     
      if(selector) selector.className = '';
    })


    // subida
    await page.setInputFiles('input#upfile_1', filePath);

    // click botón subir
    await page.locator('#upload_1').click();

    // espera para que tenga tiempo de subir
    await page.waitForTimeout(3000);

     // check
   // await expect(page.locator('wfu_messageblock_header_1_label_1')).toContainText('uploaded successfully');
    await expect(cartPage.uploadComponent().successTxt).toContainText('uploaded successfully');

  });  


test('Cart: botón Upload File se habilita tras elegir archivo', async ({ page }) => {
  const cartPage = new CartPage(page);
  await page.goto('/cart');

  // inicialmente deshabilitado
  await expect(cartPage.uploadComponent().submitBtn).toBeDisabled();

  // al seleccionar archivo se habilita (no click)
  const filePath = fileURLToPath(new URL('../data/test.jpg', import.meta.url));
  await page.setInputFiles(cartPage.uploadComponent().uploadInput, filePath);

  await expect(cartPage.uploadComponent().submitBtn).toBeEnabled();
});

test('Cart: Products enlaces válidos byRole', async ({ page, request }) => {
  await page.goto('/cart');

  const sidebar = page.getByRole('complementary');
  const productsBox = sidebar.getByRole('heading', { name: /^products$/i }).locator('..');
  const links = productsBox.locator('li a');

  const count = await links.count();
  expect(count).toBeGreaterThan(0);

  const hrefs = await links.evaluateAll(as => as.map(a => (a as HTMLAnchorElement).href));
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), `Link ${href} debe responder 200`).toBe(200);
  }
});

test('Cart: Products enlaces válidos locator', async ({ page, request }) => {
  await page.goto('/cart');

  // Caja del sidebar que contiene el h2 "Products"
  const productsBox = page
    .locator('aside')
    .filter({ has: page.locator('h2:has-text("Products")') })
    .first();

  const links = productsBox.locator('li a');

  const count = await links.count();
  expect(count).toBeGreaterThan(0);

  const hrefs = await links.evaluateAll(els => els.map(a => (a as HTMLAnchorElement).href));
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), `Link ${href} debe responder 200`).toBe(200);
  }
});

test('Cart: Products categories válidos locator', async ({ page, request }) => {
  await page.goto('/cart');

  // Caja del sidebar que contiene el h2 "Product categories"
  const categoriesBox = page
    .locator('aside')
    .filter({ has: page.locator('h2:has-text("Product categories")') })
    .first();

  const links = categoriesBox.locator('li a');

  const count = await links.count();
  expect(count).toBeGreaterThan(0);

  const hrefs = await links.evaluateAll(els => els.map(a => (a as HTMLAnchorElement).href));
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), `Categoría ${href} debe responder 200`).toBe(200);
  }

  // Navega a la primera categoría y comprueba que la página carga con heading visible
  await links.first().click();
  await expect(page.locator('h1, h2').first()).toBeVisible();
});
})