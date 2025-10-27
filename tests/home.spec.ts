import { test, expect } from '@playwright/test';
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

    test('Open Aboutpage and veryfing title', async ({ page }) => {

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


    test('Verify search button', async ({ page }) => {

        //await page.goto('https://practice.sdetunicorns.com/');

        // CSS: botón de búsqueda en acciones del header 
        const searchIcon = homePage.searchIcon;

        await expect(searchIcon).toBeVisible();

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

    test('Home: Latest Posts muestra 3 items y responden 200', async ({ page, request }) => {
        await page.goto('/');
        const posts = homePage.posts;
        await expect(posts).toHaveCount(3);

        const hrefs = await posts.evaluateAll(as => as.map(a => (a as HTMLAnchorElement).href));
        for (const href of hrefs) {
            const res = await request.get(href);
            expect(res.status(), `Link ${href} debe responder 200`).toBe(200);
        }
    });

    test('Home: Quick Links del footer navegan correctamente', async ({ page }) => {
        await page.goto('/');

        // Acotar al footer y al bloque "Quick Links"
        const footer = page.getByRole('contentinfo');
        const quickLinksBox = footer.getByRole('heading', { name: 'Quick Links' }).locator('..'); // contenedor padre del h2

        const expected = new Map<string, RegExp>([
            ['Home', /^https:\/\/practice\.sdetunicorns\.com\/$/],
            ['About', /\/about\/$/],
            ['Blog', /\/blog\/$/],
            ['Contact', /\/contact\/$/],
            ['Support Form', /\/support-form\/$/],
        ]);

        for (const [name, pattern] of expected) {
            const link = quickLinksBox.getByRole('link', { name, exact: true }); // ahora solo el del bloque
            await expect(link).toBeVisible();

            await Promise.all([
                page.waitForURL(pattern, { timeout: 10_000 }),
                link.click(),
            ]);

            // volver a Home para probar el siguiente enlace
            await page.goto('/');
        }
    });

    test('Home: enlace Courses abre nueva pestaña al dominio de cursos', async ({ page, context }) => {
        //await page.goto('/');

        //Localiza el enlace “Courses” por su nombre accesible
        const courses = homePage.courses;

        // El HTML tiene target=""_blank"" porque: "regex tolerara comillas duplicadas"
        await expect(courses).toHaveAttribute('target', /_blank/);

        // Verificar que abre una nueva pestaña y apunta al dominio correcto
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            courses.click(),
        ]);

        //Espera a que la página nueva cargue el DOM mínimo
        await newPage.waitForLoadState('domcontentloaded');

        await expect(newPage).toHaveURL(/sdetunicorns\.com\/courses/);
        await newPage.close();
    });

    test('Home: sin errores de consola al cargar', async ({ page }) => {
        const errors: string[] = [];

        //Escucha consola ANTES de navegar
        page.on('console', msg => {

            //Filtrar por tipo de mensaje, si es error, incluir en errors
            if (msg.type() === 'error') errors.push(msg.text());
        });

        //NAVEGAR
        //await page.goto('/');

        //Positivo si errors es 0
        expect(errors, `Errores de consola: \n${errors.join('\n')}`).toHaveLength(0);
    });

    test('Home: comprobar imgs', async ({ page }) => {
        // await page.goto('/');

        // Espera que la página esté “en reposo”
        await page.waitForLoadState('networkidle');

        // Recorre la web hasta abajo cargando imagenes
        await page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForLoadState('networkidle');


        const broken = await page.evaluate(async () => {
            //helper que es positivo si la URL de la imagen es raster
            const isRaster = (src: string) => /\.(png|jpe?g|webp|gif)$/i.test(src);

            //helper que es positivo si tamaño mayor que 1×1 píxeles y no oculto
            const visible = (el: Element) => {
                const r = el.getBoundingClientRect();
                const style = getComputedStyle(el as HTMLElement);
                return r.width > 1 && r.height > 1 && style.visibility !== 'hidden' && style.display !== 'none';
            };

            //Toma todas las imagenes y las filtra segun los helpers
            const imgs = Array.from(document.images)
                .filter(img => isRaster(img.currentSrc || img.src))
                .filter(img => visible(img));

            // Fuerza a que el navegador decodifique (si falla, no para)
            await Promise.all(imgs.map(img => (img as HTMLImageElement).decode?.().catch(() => { })));

            // Devuelve imgs de anchura 0 con un array con sus urls
            return imgs
                .filter(img => (img as HTMLImageElement).naturalWidth === 0)
                .map(img => (img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src);
        });

        //Positivo si hay 0 imgs rotas
        expect(broken, `Imágenes rotas:\n${broken.join('\n')}`).toHaveLength(0);
    });

    test('Home: caracteristicas principales', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded'); // da tiempo a pintar estructura

        // Header (banner) y navegación del header
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.getByRole('navigation')).toBeVisible();

        // Check si hay main
        if (await mains.count()) {
            await expect(mains.first()).toBeVisible();
        } else {
            // Fallback si la página no define main/role="main"
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        }

        // Footer (contentinfo)
        await expect(page.getByRole('contentinfo')).toBeVisible();
    });


    //#zak-primary-menu li[id*=menu]
    //everest_forms[form_fields][ys0GeZISRs-1]
});
