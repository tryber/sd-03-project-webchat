# Boas vindas ao repositório do projeto WebChat!

Você já usa o GitHub diariamente para desenvolver os exercícios, certo? Agora, para desenvolver os projetos, você deverá seguir as instruções a seguir. Fique atento a cada passo, e se tiver qualquer dúvida, nos envie por _Slack_! #vqv 🚀

Aqui você vai encontrar os detalhes de como estruturar o desenvolvimento do seu projeto a partir desse repositório, utilizando uma branch específica e um _Pull Request_ para colocar seus códigos.

---

### Habilidades

- Conseguir desenvolver um server socket usando o socket.io;

- Emitir eventos personalizados usando o socket.io;

- Usar o pacote NET do Node.js para criar aplicações que trafeguem mensagens através de sockets.

## Instruções para entregar seu projeto:

### 🗒ANTES DE COMEÇAR A DESENVOLVER:

1. Clone o repositório

   - `git clone https://github.com/tryber/sd-03-project-webchat.git`.
   - Entre na pasta do repositório que você acabou de clonar:
     - `cd sd-03-project-webchat`

2. Crie uma branch a partir da branch `master`

   - Verifique que você está na branch `master`
     - Exemplo: `git branch`
   - Se não estiver, mude para a branch `master`
     - Exemplo: `git checkout master`
   - Agora, crie uma branch onde você vai guardar os `commits` do seu projeto
     - Você deve criar uma branch no seguinte formato: `nome-de-usuario-nome-do-projeto`
     - Exemplo: `git checkout -b joaozinho-webchat-project`

3. Crie na raiz do projeto os arquivos que você precisará desenvolver:

   - Verifique que você está na raiz do projeto
     - Exemplo: `pwd` -> o retorno vai ser algo tipo _/Users/joaozinho/code/**sd-03-project-webchat**_
   - Crie os arquivos index.html, style.css e script.js
     - Exemplo: `touch index.html style.css script.js`

4. Adicione as mudanças ao _stage_ do Git e faça um `commit`

   - Verifique que as mudanças ainda não estão no _stage_
     - Exemplo: `git status` (devem aparecer listados os novos arquivos em vermelho)
   - Adicione o novo arquivo ao _stage_ do Git
     - Exemplo:
       - `git add .` (adicionando todas as mudanças - _que estavam em vermelho_ - ao stage do Git)
       - `git status` (devem aparecer listados os arquivos em verde)
   - Faça o `commit` inicial
     - Exemplo:
       - `git commit -m 'iniciando o projeto. VAMOS COM TUDO :rocket:'` (fazendo o primeiro commit)
       - `git status` (deve aparecer uma mensagem tipo _nothing to commit_ )

5. Adicione a sua branch com o novo `commit` ao repositório remoto

   - Usando o exemplo anterior: `git push -u origin joaozinho-webchat-project`

6. Crie um novo `Pull Request` _(PR)_

   - Vá até a página de _Pull Requests_ do [repositório no GitHub](https://github.com/tryber/sd-03-project-webchat/pulls)
   - Clique no botão verde _"New pull request"_
   - Clique na caixa de seleção _"Compare"_ e escolha a sua branch **com atenção**
   - Clique no botão verde _"Create pull request"_
   - Adicione uma descrição para o _Pull Request_, um título claro que o identifique, e clique no botão verde _"Create pull request"_
   - **Não se preocupe em preencher mais nada por enquanto!**
   - Volte até a [página de _Pull Requests_ do repositório](https://github.com/tryber/sd-03-project-webchat/pulls) e confira que o seu _Pull Request_ está criado

---

# Entregáveis

Para entregar o seu projeto você deverá criar um Pull Request neste repositório.

Lembre-se que você pode consultar nosso conteúdo sobre [Git & GitHub](https://course.betrybe.com/intro/git/) sempre que precisar!


---

### Data de Entrega

O projeto tem até a seguinte data: `04/11/2020 - 14:00h`. Para ser entregue a avaliação final.

---

## Requisitos do projeto

### 👀 Observações importantes:

- Você tem liberdade para adicionar novos comportamentos ao seu projeto, seja na forma de aperfeiçoamentos em requisitos propostos ou novas funcionalidades, **desde que tais comportamentos adicionais não conflitem com os requisitos propostos**.

  - Em outras palavras, você pode fazer mais do que for pedido, mas nunca menos.

- Contudo, tenha em mente que **nada além do que for pedido nos requisitos será avaliado**. _Esta é uma oportunidade de você exercitar sua criatividade e experimentar com os conhecimentos adquiridos._

#### Leia todo este documento e se inteire de tudo que o projeto pede antes de começar o desenvolvimento. Montar uma estratégia para construir o projeto e atender os seus requisitos faz parte do trabalho.

### Análise Estática 

Usaremos o [ESLint](https://eslint.org/) para fazer a análise estática do seu código.

Este projeto já vem com as dependências relacionadas ao _linter_ configuradas nos arquivos `package.json` nos seguintes caminhos:

- `sd-03-project-webchat/package.json`

Para poder rodar os `ESLint` em um projeto basta executar o comando `npm install` dentro do projeto e depois `npm run lint`. Se a análise do `ESLint` encontrar problemas no seu código, tais problemas serão mostrados no seu terminal. Se não houver problema no seu código, nada será impresso no seu terminal.

Você pode também instalar o plugin do `ESLint` no `VSCode`, bastar ir em extensions e baixar o [plugin `ESLint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Variáveis

Haverá um arquivo no caminho: `sd-03-project-webchat/helpers/db.js`. Neste arquivo, na linha 10, Haverá a seguinte comando:

`.connect(process.env.DB_URL, {`

e na linha 14:

`.then((conn) => conn.db(process.env.DB_NAME))`

**Você irá precisar configurar as variáveis globais do MySQL.** Você pode usar esse [Conteúdo de variáveis de ambiente com NodeJS](https://blog.rocketseat.com.br/variaveis-ambiente-nodejs/) como referência.

**(Neste arquivo e obrigatório deixar o nome do database como `webchat`)**

**Com elas que iremos conseguir conectar ao banco do avaliador automático**

---

## Requisitos Obrigatórios:

### 1 - Crie um backend back-end que permite que várias pessoas se conectem simultâneamente e mandem mensagens em um chat

- Seu backend deve permitir que várias usuários se conectem simultâneamente;

- Seu backend deve permitir que usuários mandem mensagens para todos os outros usuários de forma simultânea;

- Toda mensagem que um cliente recebe deve conter as informações acerca de quem a enviou, data-hora do envio e o conteúdo da mensagem em si. A data-hora das mensagens deve ser determinada pelo momento em que são salvas no banco de dados (ver requisito 3);

 - O evento da mensagem deve ter o nome `message` e deve enviar como parâmetro o objeto `{ chatMessage, nickname }`. O `chatMessage` deve ser o mensagem enviada e o `nickname` o nickname do usuário que a enviou;

 - a data na mensagem deve seguir o padrão 'dd-mm-yyyy' e o horário deve seguir o padrão 'hh:mm:ss' sendo os segundos opcionais;


#### As seguintes verificações serão feitas:

- Será validado que vários clientes conseguem se conectar ao mesmo tempo;

- Será validado que cada cliente conectado ao chat recebe todas as mensagens que já foram enviadas;

- Será validado que toda mensagem que um cliente recebe contém as informações acerca de quem a enviou, data-hora do envio e o conteúdo da mensagem em si

### 2 - Crie um frontend para que as pessoas interajam com o chat.

- As mensagens devem ser renderizadas na tela
 - Cada mensagem deve ser o `data-testid="message"`

- O frontend deve exibir todas as mensagens já enviadas no chat, ordenadas verticalmente da mais antiga para a mais nova

- O frontend deve ter uma caixa de texto através da qual quem usa consiga enviar mensagens para o chat;
  - A caixa de texto deve conter o `data-testid="message-box"`.
  - O botão de enviar mensagem deve conter o `data-testid="send-button"`.

- O front-end deve permitir a quem usa escolher um apelido (_nickname_) para si. Para que o cliente consiga escolher um apelido deve ter um campo de texto e um botão no front-end. O campo de texto será onde o cliente digitará o _nickname_ que deseja. Após escolher o _nickname_, o cliente deverá clicar no botão para que o dado seja salvo.
  - o campo onde o nickname será inserido deve conter o `data-testid="nickname-box"`.
  - o botão que será clicado para salvar o nickname deve conter `data-testid="nickname-save"`.
  - ao entrar, o usuário deve receber um nickname randomico.

#### As seguintes verificações serão feitas:

- Será validado que o frontend tem uma caixa pra enviar mensagens;

- Será validado que o frontend possui um campo onde o usuário pode inserir o nickname e um botão para salvar;

- Será validado que é possível enviar mensagem após alterar o nickname;

### 3 - Elabore o histórico do chat para que as mensagens persistam.

- Você deve configurar um banco de dados MongoDB, onde cada linha contém uma mensagem enviada;

- O seu banco de dados deve salvar o nickname de quem enviou a mensagem, a mensagem em si e uma _timestamp_ com precisão de segundos de quando ela foi salva no banco.

#### As seguintes verificações serão feitas:

- Será validado que todo o histórico de mensagens irá aparecer quando o cliente se conectar;

- Será validado que ao enviar uma mensagem e recarregar a página , a mensagem persistirá; 

### 4 - Informe a todos os clientes quem está online no momento.

- No front-end deve haver uma lista, na tela de cada cliente, que mostra quais clientes estão online em um dado momento. Um cliente é identificado pelo seu _nickname_.
  - O elemento com o nome do cliente deve conter o `data-testid="online-user"`
  - Quando um cliente se conecta, ele deve entrar no final da lista de clientes online

#### As seguintes verificações serão feitas:

- Será validado que quando um usuário se conecta, seu nome aparece no frontend de todos

- Será validado que quando um usuário se desconecta, seu nome desaparece do frontend dos outros usuários.

## Requisitos Bônus

### 5 - Permita que usuários troquem mensagens particulares.

- No frontend deve haver uma lista com todos os clientes e, ao lado de cada identificador, um botão. Um clique nesse botão deve direcionar as pessoas para um chat privado. Além disso, deve existir um botão para entrar no chat público. 
  - O usuário não deve conseguir enviar mensagens privadas para si mesmo.
  - O botão para o chat privado deve ter o `data-testid="private"` 
  - O botão para o chat público deve ter o `data-testid="public"`

- No front-end deve ser possível navegar entre os chats privados ou o chat geral na mesma janela, clicando no botão com `data-testid="private"` para ir ao privado e `data-testid="public"` para voltar para o público.

- Mensagens particulares só devem ser visíveis para as partes pertinentes. Clientes terceiros não devem poder acessar seu conteúdo.


#### As seguintes verificações serão feitas:

- Será validado que quando um usuário se conecta, seu nome aparece no frontend de todos;

- Será validado que quando um usuário se desconecta, seu nome desaparece do frontend dos outros usuários.

---

## Dicas

- Tomar decisões de projeto em prol do bom desenvolvimento faz parte do projeto! Interprete os requisitos, tome suas decisões e, em caso de dúvidas, valide-as conosco no _Slack_!

---

### DURANTE O DESENVOLVIMENTO

- ⚠ **RECOMENDAMOS QUE VOCÊ FIQUE ATENTO ÀS ISSUES DO CODE CLIMATE, PARA RESOLVÊ-LAS ANTES DE FINALIZAR O DESENVOLVIMENTO.** ⚠

- Faça `commits` das alterações que você fizer no código regularmente;

- Lembre-se de sempre após um ~~(ou alguns)~~ `commits` atualizar o repositório remoto (o famoso `git push`);

- Os comandos que você utilizará com mais frequência são:

  1. `git status` _(para verificar o que está em vermelho - fora do stage - e o que está em verde - no stage)_;

  2. `git add` _(para adicionar arquivos ao stage do Git)_;

  3. `git commit` _(para criar um commit com os arquivos que estão no stage do Git)_;

  4. `git push -u nome-da-branch` _(para enviar o commit para o repositório remoto na primeira vez que fizer o `push` de uma nova branch)_;

  5. `git push` _(para enviar o commit para o repositório remoto após o passo anterior)_.

---

### DEPOIS DE TERMINAR O DESENVOLVIMENTO (OPCIONAL)

Para sinalizar que o seu projeto está pronto para o _"Code Review"_ dos seus colegas, faça o seguinte:

- Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas:

  - No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**;

  - No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**;

  - No menu à direita, clique no _link_ **"Reviewers"** e digite `students`, selecione o time `tryber/students-sd-03`.

Caso tenha alguma dúvida, [aqui tem um video explicativo](https://vimeo.com/362189205).

---

### REVISANDO UM PULL REQUEST

Use o conteúdo sobre [Code Review](https://course.betrybe.com/real-life-engineer/code-review/) para te ajudar a revisar os _Pull Requests_.

#VQV 🚀
