import { test, expect } from '@playwright/test';
import ContactPage from '../pages/contact.page';
import {faker} from '@faker-js/faker';

test.describe('Contact', () => {
  
  let contactPage;
  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navigate();
  });

  test('should fill all fields and submit successfully', async ({ page }) => {
    
      //await page.goto('https://practice.sdetunicorns.com/contact/');

    // Rellenar campos usando selectores accesibles (labels). Son tolerantes a variaciones de texto.
    //await page.locator('.contact-name input').fill('Test Name')
    //await page.locator('.contact-email input').fill('test@mail.com')
    //await page.locator('.contact-phone input').fill('134567864')
    //await page.locator('.contact-message textarea').fill('This is a test message')

    // Enviar
    //await page.getByRole('button', { name: /submit/i }).click();
    
    // Rellenar y enviar usando el método del Page Object
    await contactPage.submitForm(faker.person.fullName(), faker.internet.exampleEmail(), faker.phone.number(), faker.lorem.paragraph());

    // Aserción: mensaje de éxito visible
    const successMessage = page.getByText(
      /Thanks for contacting us! We will be in touch with you shortly/i,
      { exact: false }
    );
    await expect(successMessage).toBeVisible({ timeout: 5_000 });
  });
});