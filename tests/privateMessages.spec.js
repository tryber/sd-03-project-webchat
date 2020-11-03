require('dotenv').config();
require('@testing-library/jest-dom');
const faker = require('faker');
const puppeteer = require('puppeteer');
const _ = require('lodash');

const BASE_URL = 'http://localhost:3000/';
const { MongoClient } = require('mongodb');

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

describe('Permita que usuários troquem mensagens particulares', () => {
  let browser;
  let page;
  let connection;
  let db;

  beforeEach(async () => {
    connection = await MongoClient.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(process.env.DB_NAME);
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
    await db.collection('messages').deleteMany({});
    page = await browser.newPage();
    await page.goto(BASE_URL);
  });

  afterEach(async () => {
    browser.close();
    await db.collection('messages').deleteMany({});
    await connection.close();
  });

  it('Será validado que existe o botão para entrar em um chat privado e para voltar ao chat principal.', async () => {
    const page2 = await browser.newPage();
    await page.goto(BASE_URL);

    await page2.goto(BASE_URL);
    await page.waitForSelector(dataTestid('private'));

    const privateButton = await page.$(dataTestid('private'));
    const publicButton = await page.$(dataTestid('public'));

    expect(privateButton).not.toBeNull();
    expect(publicButton).not.toBeNull();
    page2.close();
  });

  it('Será validado que é possível enviar uma mensagem privada para um usuário.', async () => {
    const chatMessage = faker.lorem.sentence();
    await page.goto(BASE_URL);

    const page2 = await browser.newPage();
    await page2.goto(BASE_URL);
    wait(1000);
    await page.bringToFront();
    let privButtons = await page.$$(dataTestid('private'));
    await _.last(privButtons).click();

    const messageBox = await page.$(dataTestid('message-box'));
    await messageBox.type(chatMessage);

    const sendButton = await page.$(dataTestid('send-button'));
    await sendButton.click();

    wait(1000);
    await page2.bringToFront();

    privButtons = await page2.$$(dataTestid('private'));
    await _.last(privButtons).click();

    const page2Messages = await page2.$$eval(dataTestid('message'), (nodes) => nodes.map((n) => n.innerText));

    expect(_.last(page2Messages)).toMatch(chatMessage);
    await page2.close();
  });

  it('Será validado que é possível transitar entre o chat particular e o chat global.', async () => {
    const privateMessage = faker.lorem.sentence();
    const publicMessage = faker.lorem.sentence();
    await page.goto(BASE_URL);

    const page2 = await browser.newPage();
    await page2.goto(BASE_URL);

    wait(1000);
    await page.bringToFront();

    let messageBox = await page.$(dataTestid('message-box'));
    await messageBox.type(publicMessage);

    let sendButton = await page.$(dataTestid('send-button'));
    await sendButton.click();

    let privButtons = await page.$$(dataTestid('private'));
    await _.last(privButtons).click();

    messageBox = await page.$(dataTestid('message-box'));
    await messageBox.type(privateMessage);

    sendButton = await page.$(dataTestid('send-button'));
    await sendButton.click();

    wait(1000);
    await page2.bringToFront();

    privButtons = await page2.$$(dataTestid('private'));
    await _.last(privButtons).click();

    const page2Messages = await page2.$$eval(dataTestid('message'), (nodes) => nodes.map((n) => n.innerText));

    expect(_.last(page2Messages)).toMatch(privateMessage);

    const publicButton = await page2.$(dataTestid('public'));
    await publicButton.click();

    const page2PublicMessages = await page2.$$eval(dataTestid('message'), (nodes) => nodes.map((n) => n.innerText));

    expect(_.last(page2PublicMessages)).toMatch(publicMessage);

    await page2.close();
  });
});
