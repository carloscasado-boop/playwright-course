import { test, expect } from '@playwright/test';
import ContactPage from '../pages/contact.page';
import { faker } from '@faker-js/faker';

test.describe('Contact', () => {

  let contactPage;
  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navigate();
  });

  test('should fill all fields and submit successfully', async ({ page }) => {

    // Rellenar y enviar usando el método del Page Object
    await contactPage.submitForm(faker.person.fullName(), faker.internet.exampleEmail(), faker.phone.number(), faker.lorem.paragraph());

    // Aserción: mensaje de éxito visible
    const successMessage = page.getByText(
      /Thanks for contacting us! We will be in touch with you shortly/i,
      { exact: false }
    );
    await expect(successMessage).toBeVisible({ timeout: 5_000 });
  });

  test('Contact: contiene los textos de contacto esperados', async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.navigate();

    //texto encontado
    const contactText = await page.locator('footer p').allTextContents();

    //texto que debe ser
    const expectedText = [
      'Ph. : +(123) 456-7890',
      'Email : first.last@demos.com',
      'Loc : Moon Street , 446 Jupiter',
      'Open : 9AM – 6PM (Mon – Fri)',
    ];

    expect(contactText).toEqual(expect.arrayContaining(expectedText));
  });

  test('Contact: submitBtn visible, habilitado y con type=submit', async ({ page }) => {
    await expect(contactPage.submitBtn).toBeVisible();
    await expect(contactPage.submitBtn).toBeEnabled();
    await expect(contactPage.submitBtn).toHaveAttribute('type', 'submit');
  });

  test('Contact: submit campos inválidos', async ({ page }) => {

    await contactPage.submitBtn.click();

    // Comprueba invalidación nativa en los campos clave
    const invalidStates = await Promise.all([
      contactPage.nameInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing),
      contactPage.emailInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing || el.validity.typeMismatch),
      contactPage.messageTextArea.evaluate((el: HTMLTextAreaElement) => el.validity.valueMissing),
    ]);

    // Al menos uno debe ser inválido al enviar sin datos
    expect(invalidStates.some(Boolean)).toBe(true);

    // Y no debe mostrarse el mensaje de éxito
    await expect(contactPage.successTxt).not.toBeVisible({ timeout: 1000 });
  });
});