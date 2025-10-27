import { Page, Locator } from '@playwright/test';

class HomePage {
  page: Page;
  getStartedBtn: Locator;
  headingText: Locator;
  homeLink: Locator;
  searchIcon: Locator;
  navLinks: Locator;
  posts: Locator;
  courses: Locator;
  



  constructor(page: Page) {
    this.page = page;
    this.getStartedBtn = page.locator('#get-started')
    this.headingText = page.locator('text=Think different. Make different.')
    this.homeLink = page.locator('#primary-menu:has-text("Home")')
    this.searchIcon = page.locator('.zak-header-actions--desktop a.zak-header-search__toggle');
    this.navLinks = page.locator('#zak-primary-menu li[id*=menu]')
    this.posts = page.getByRole('link', { name: /.*/, exact: false }).locator('xpath=ancestor::ul[preceding::h2[normalize-space()="Latest Posts"]][1]/li//a');
    this.courses = page.getByRole('link', { name: 'Courses' });


  }

  async navigate() {
    await this.page.goto('/'); 
  }

  getNavLinksText() {
    return this.navLinks.allTextContents()
  }

  async openMenu(name: 'Home'|'About'|'Shop'|'Blog'|'Contact'|'My account') {
    await this.page.getByRole('link', { name }).click();
  }
}

export default HomePage;