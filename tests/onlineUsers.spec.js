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
    console.log(1);
    const nickname = faker.internet.userName();
    const secondNickname = faker.internet.userName();

    await page.goto(BASE_URL);
    console.log(2);
    let nicknameBox = await page.$(dataTestid('nickname-box'));
    console.log(3);
    let nicknameSave = await page.$(dataTestid('nickname-save'));
    console.log(4);
    await page.$eval('[data-testid="nickname-box"]', el => el.value = '');
    console.log(5);
    await nicknameBox.type(nickname);
    console.log(6);
    await nicknameSave.click();
    console.log(7);
    await page.waitForTimeout(5000)
    console.log(8);
    await page.waitForSelector(dataTestid('online-user'));
    console.log(9);
    let usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));
    console.log(10);
    expect(usersOnline).toContain(nickname);

    const numberOfUsersOnline = usersOnline.length;
    const newPage = await browser.newPage();
    console.log(11);
    await newPage.goto(BASE_URL);
    console.log(12);
    nicknameBox = await newPage.$(dataTestid('nickname-box'));
    console.log(13);
    nicknameSave = await newPage.$(dataTestid('nickname-save'));
    console.log(14);
    await page.$eval('[data-testid="nickname-box"]', el => el.value = '');
    console.log(15);
    await nicknameBox.type(secondNickname);
    console.log(16);
    await nicknameSave.click();
    console.log(17);
    await page.waitForTimeout(1000);
    console.log(18);
    await page.waitForSelector(dataTestid('online-user'));
    console.log(19);
    usersOnline = await page.$$eval(dataTestid('online-user'), (nodes) => nodes.map((n) => n.innerText));
    console.log(20);
    expect(numberOfUsersOnline).toBe(usersOnline.length - 1);
    await newPage.close();
    console.log(21);
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
