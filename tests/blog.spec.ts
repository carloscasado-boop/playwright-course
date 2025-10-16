import{test, expect} from '@playwright/test';

test.describe('Blog', () => {

   test('should get all recent posts and verify count is 5', async ({ page }) => {
    await page.goto('https://practice.sdetunicorns.com/blog/');

    // Localizar la sección "Recent Posts"
    const recentPostsSection = page.locator('#recent-posts-3 ul li');

    // Obtener todos los elementos de la lista como array
    const posts = await recentPostsSection.all();

    // Comprobar que la longitud es 5 (índices 0 al 4)
    expect(posts.length).toBe(5);

    // Comprobar que el texto de cada elemento es mayor a 10 chars
    for (let i = 0; i < posts.length; i++) {

      expect(((await posts[i].innerText())).length).toBeGreaterThanOrEqual(10);
    }
  });  
})