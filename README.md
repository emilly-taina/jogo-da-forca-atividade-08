# Jogo da Forca — Atividade #08

## Nome completo

Emilly Tainá da Silva Alves

## Descrição

Este projeto é um **Jogo da Forca** feito em JavaScript para ser executado no terminal utilizando Node.js.

O jogador informa seu nome, escolhe uma categoria de palavras e tenta descobrir a palavra secreta antes de atingir o limite máximo de erros.

## Regras do jogo

- O jogador deve informar seu nome no início.
- O jogador pode escolher uma categoria ou selecionar a opção de categoria aleatória.
- O jogo possui 4 categorias: Tecnologia, Animais, Frutas e Países.
- O banco possui mais de 20 palavras cadastradas.
- A cada rodada, o jogo mostra:
  - A palavra oculta;
  - As letras já tentadas;
  - O desenho da forca em ASCII;
  - A quantidade de erros restantes.
- O jogador tem direito a **6 erros**.
- O jogador vence quando descobre todas as letras da palavra antes de acabar as tentativas.
- O jogador perde quando atinge 6 erros.
- Letras repetidas não geram penalidade.
- Caracteres inválidos, números ou mais de uma letra não geram penalidade.
- O jogo não diferencia letras maiúsculas e minúsculas.
- O jogo normaliza acentos. Exemplo: se a palavra tiver “Á”, o jogador pode digitar “A”.

## Como jogar

1. Execute o jogo no terminal.
2. Digite seu nome.
3. Escolha uma categoria pelo número.
4. Digite uma letra por vez.
5. Para pedir uma dica, digite:

```bash
!dica
```

6. Ao final da rodada, o jogo mostra:
   - Nome do jogador;
   - Resultado;
   - Palavra correta;
   - Pontuação obtida;
   - Ranking;
   - Opção para jogar novamente.

## Como executar

Primeiro, tenha o **Node.js** instalado em seu computador.

Depois, no terminal, entre na pasta do projeto e execute:

```bash
npm start
```

Não é necessário instalar bibliotecas externas, pois o projeto utiliza apenas recursos nativos do Node.js.

## Pontuação

A pontuação foi personalizada da seguinte forma:

### Se o jogador vencer

```text
Pontuação = letras únicas acertadas × 10 + erros restantes × 20 + tamanho da palavra
```

### Se o jogador perder

```text
Pontuação = letras únicas acertadas × 5
```

### Penalidade da dica

Caso o jogador use a dica, são descontados **10 pontos** da pontuação final da rodada.

A pontuação nunca fica negativa. Caso o cálculo fique abaixo de zero, o jogo considera 0 pontos.

## Bônus implementados

### Sistema de dicas

Cada palavra possui uma dica cadastrada.  
O jogador pode solicitar a dica digitando `!dica` durante a rodada.

Penalidade: usar dica reduz **10 pontos** da pontuação final.

### Ranking dos melhores jogadores

Ao final de cada rodada, o resultado do jogador é salvo em um arquivo chamado:

```text
ranking.json
```

O jogo exibe os 5 melhores resultados, ordenados da maior pontuação para a menor.

## Estrutura de arquivos

```text
jogo-da-forca/
├── index.js
├── package.json
├── README.md
└── .gitignore
```

Todo o código do jogo está dentro do arquivo `index.js`.

## Créditos — fontes de referência utilizadas

- Documentação oficial do JavaScript/MDN.
- Documentação oficial do Node.js.
- Conteúdo estudado em aula sobre JavaScript.
- Template `.gitignore` recomendado pelo GitHub para projetos Node.js.
- ChatGPT (OpenAI) utilizado como ferramenta de apoio para esclarecimento de dúvidas, revisão de código e estruturação do projeto.

## Licença do projeto

Este projeto está licenciado sob a licença MIT.

Uso permitido para fins de estudo, aprendizado e prática de programação.
