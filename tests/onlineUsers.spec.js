require('dotenv').config();

const faker = require('faker');
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

const BASE_URL = 'http://localhost:3000/';

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

function wait(time) {
  const start = Date.now();
  while (true) {
    if (Date.now() - start >= time) {
      return true;
    }
  }
}

describe('Informe a todos os clientes quem está online no momento', () => {
  let browser;
  let page;
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(process.env.DB_NAME);
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--window-size=1920,1080'], headless: true });
  });

  beforeEach(async () => {
    await db.collection('messages').deleteMany({});
    page = await browser.newPage();
  });

  afterEach(() => {
    page.close();
  });

  afterAll(async () => {
    await connection.close();
    browser.close();
  });
  
  it('Será validado que quando um usuário se conecta, seu nome aparece no frontend de todos', async () => {
    const nickname = faker.internet.userName();
    const secondNickname = faker.internet.userName();

    await page.goto(BASE_URL);
    let nicknameBox = await page.$(dataTestid('nickname-box'));
    let nicknameSave = await page.$(dataTestid('nickname-save'));

    await page.$eval('[data-testid="nickname-box"]', el => el.value = '');
    await nicknameBox.type(nickname);
    await nicknameSave.click();
    await page.waitForTimeout(1000)
    await page.waitForSelector(dataTestid('online-user'));
    let usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));
    
    expect(usersOnline).toContain(nickname);

    const numberOfUsersOnline = usersOnline.length;
    const newPage = await browser.newPage();
    
    await newPage.goto(BASE_URL);
    nicknameBox = await newPage.$(dataTestid('nickname-box'));
    nicknameSave = await newPage.$(dataTestid('nickname-save'));
    await page.$eval('[data-testid="nickname-box"]', el => el.value = '');
    await nicknameBox.type(secondNickname);
    await nicknameSave.click();
    await page.waitForTimeout(1000);
    await page.waitForSelector(dataTestid('online-user'));
    usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));
    
    expect(numberOfUsersOnline).toBe(usersOnline.length - 1);
    await newPage.close();
  });

  it('Será validado que qunado um usuário se desconecta, seu nome desaparece do frontend dos outros usuários.', async () => {
    const nickname = faker.internet.userName();
    const secondNickname = faker.internet.userName();

    await page.goto(BASE_URL);
    let nicknameBox = await page.$(dataTestid('nickname-box'));
    let nicknameSave = await page.$(dataTestid('nickname-save'));

    await page.$eval('[data-testid="nickname-box"]', el => el.value = '');
    await nicknameBox.type(nickname);
    await nicknameSave.click();
    wait(1000);
    await page.waitForSelector(dataTestid('online-user'));
    let usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));

    expect(usersOnline).toContain(nickname);

    const numberOfUsersOnline = usersOnline.length;
    const newPage = await browser.newPage();

    await newPage.goto(BASE_URL);
    nicknameBox = await newPage.$(dataTestid('nickname-box'));
    nicknameSave = await newPage.$(dataTestid('nickname-save'));

    await page.$eval('[data-testid="nickname-box"]', el => el.value = '');
    await nicknameBox.type(secondNickname);
    await nicknameSave.click();
    await page.waitForSelector(dataTestid('online-user'));
    usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));

    expect(numberOfUsersOnline).toBe(usersOnline.length - 1);
    await newPage.close();
    wait(1000);
    usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));

    expect(numberOfUsersOnline).toBe(usersOnline.length);
  });
});
