import{test, expect} from '@playwright/test';
import HomePage from '../pages/home.page';

test.describe('Home', () => {
let homePage;

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
})


    test('Open Homepage and veryfing title', async ({ page }) => {
       
        //homePage = new HomePage(page);
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        await expect(page).toHaveTitle('Practice E-Commerce Site – SDET Unicorns');

    });
    
    test.skip('Open Aboutpage and veryfing title', async ({ page }) => {
       
        await page.goto('https://practice.sdetunicorns.com/about/');

        await expect(page).toHaveTitle('About – Practice E-Commerce Site');
    });
    
    test('Click get started', async ({ page }) => {
       
        // homePage = new HomePage(page);
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        //await page.locator('#get-started').click();
        await homePage.getStartedBtn.click();

        await expect(page).toHaveURL('https://practice.sdetunicorns.com/#get-started');

    });


      test('Click get started alter', async ({ page }) => {
       
        // homePage = new HomePage(page);
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        //await page.locator('#get-started').click();
        await homePage.getStartedBtn.click();

        await expect(page).toHaveURL(/.#get-started/);

    });


     test('Click get started button using CSS Selector', async ({ page }) => {
    
        // homePage = new HomePage(page);
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        await expect(page).not.toHaveURL(/.*#get-started/);

        // click
        //await page.locator('#get-started').click();
        await homePage.getStartedBtn.click();

        // verify url 
        await expect(page).toHaveURL(/.*#get-started/);
    });

    
      test('Verify title text is visible', async ({ page }) => {
       
        //homePage = new HomePage(page);
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        const headingText = homePage.headingText; //page.locator('text=Think different. Make different.');


        await expect(headingText).toBeVisible();

    });

    
      test.skip('Verify search button', async ({ page }) => {
       
        await page.goto('https://practice.sdetunicorns.com/');

       // const searchIcon = await page.locator('//*div[@class='zak-header-actions zak-header-actions--desktop']//a[@class='zak-header-search__toggle']');

       // await expect(searchIcon).toBeVisible();

    });

    test('Verify text of Menu', async ({ page }) => {
       
        //homePage = new HomePage(page);

        const expectedLinks = [
            "Home",
            "About",
            "Shop",
            "Blog",
            "Contact",
            "My account",
        ];

         
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        const navLinks = await homePage.navLinks; //page.locator('#zak-primary-menu li[id*=menu]');

       expect(await navLinks.allTextContents()).toEqual(expectedLinks);

    });

    test('Verify text of item in Menu', async ({ page }) => {
       

        // homePage = new HomePage(page);
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        const navLinks = homePage.navLinks.nth(3);

       expect(await navLinks.allTextContents()).toEqual(["Blog"]);

    });

    test('Print elements log', async ({ page }) => {
       
        //homePage = new HomePage(page);
        const expectedLinks = [
            "Home",
            "About",
            "Shop",
            "Blog",
            "Contact",
            "My account",
        ];

         
        //await homePage.navigate();
        //await page.goto('https://practice.sdetunicorns.com/');

        const navLinks = homePage.navLinks; //page.locator('#zak-primary-menu li[id*=menu]');

        for (const element of await navLinks.elementHandles()) {
            
            console.log(element.textContent());
        }

    });


//#zak-primary-menu li[id*=menu]
//everest_forms[form_fields][ys0GeZISRs-1]
});
