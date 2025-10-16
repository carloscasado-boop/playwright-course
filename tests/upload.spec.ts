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
})