const fs = require("fs");
const path = require("path");
const readline = require("readline");

const RANKING_PATH = path.join(__dirname, "ranking.json");
const MAX_ERROS = 6;

const bancoDePalavras = {
  Tecnologia: [
    { palavra: "JAVASCRIPT", dica: "Linguagem muito usada no desenvolvimento web." },
    { palavra: "NODE", dica: "Ambiente que permite executar JavaScript fora do navegador." },
    { palavra: "ALGORITMO", dica: "Sequência de passos para resolver um problema." },
    { palavra: "INTERNET", dica: "Rede mundial de computadores." },
    { palavra: "SERVIDOR", dica: "Computador ou sistema que fornece serviços para outros." },
    { palavra: "VARIAVEL", dica: "Espaço usado para armazenar valores em um programa." },
    { palavra: "FUNCAO", dica: "Bloco de código que executa uma tarefa." },
    { palavra: "GITHUB", dica: "Plataforma usada para hospedar repositórios de código." }
  ],

  Animais: [
    { palavra: "CACHORRO", dica: "Animal doméstico conhecido como melhor amigo do homem." },
    { palavra: "ELEFANTE", dica: "Animal grande que possui tromba." },
    { palavra: "TARTARUGA", dica: "Animal conhecido por seu casco e movimentos lentos." },
    { palavra: "GIRAFA", dica: "Animal com pescoço muito comprido." },
    { palavra: "LEAO", dica: "Animal conhecido como rei da selva." },
    { palavra: "BORBOLETA", dica: "Inseto colorido que passa por metamorfose." },
    { palavra: "PINGUIM", dica: "Ave que não voa e vive em regiões frias." },
    { palavra: "JACARE", dica: "Réptil parecido com o crocodilo." }
  ],

  Frutas: [
    { palavra: "BANANA", dica: "Fruta amarela muito comum no Brasil." },
    { palavra: "MORANGO", dica: "Fruta pequena, vermelha e muito usada em sobremesas." },
    { palavra: "ABACAXI", dica: "Fruta tropical com casca espinhosa." },
    { palavra: "MELANCIA", dica: "Fruta grande, verde por fora e vermelha por dentro." },
    { palavra: "LARANJA", dica: "Fruta cítrica rica em vitamina C." },
    { palavra: "UVA", dica: "Fruta pequena que pode ser usada para fazer suco e vinho." },
    { palavra: "MANGA", dica: "Fruta tropical doce e suculenta." },
    { palavra: "GOIABA", dica: "Fruta muito usada para fazer goiabada." }
  ],

  Paises: [
    { palavra: "BRASIL", dica: "País conhecido pelo futebol e pelo carnaval." },
    { palavra: "CANADA", dica: "País da América do Norte conhecido pelo frio." },
    { palavra: "JAPAO", dica: "País asiático conhecido por tecnologia e animes." },
    { palavra: "PORTUGAL", dica: "País europeu que fala português." },
    { palavra: "ARGENTINA", dica: "País vizinho do Brasil." },
    { palavra: "MEXICO", dica: "País conhecido pelos tacos e pela cultura asteca." }
  ]
};

const desenhosForca = [
`
  +---+
  |   |
      |
      |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
      |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========
`,
`
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========
`
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filaDeRespostas = [];
let resolverPendente = null;

rl.on("line", (linha) => {
  const resposta = linha.trim();

  if (resolverPendente) {
    const resolver = resolverPendente;
    resolverPendente = null;
    resolver(resposta);
  } else {
    filaDeRespostas.push(resposta);
  }
});

function perguntar(texto) {
  process.stdout.write(texto);

  return new Promise((resolve) => {
    if (filaDeRespostas.length > 0) {
      resolve(filaDeRespostas.shift());
    } else {
      resolverPendente = resolve;
    }
  });
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function ehLetraValida(texto) {
  return /^[A-Z]$/.test(normalizar(texto));
}

function sortearItem(lista) {
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

function obterCategorias() {
  return Object.keys(bancoDePalavras);
}

async function escolherCategoria() {
  const categorias = obterCategorias();

  while (true) {
    console.log("\nCategorias disponíveis:");
    console.log("0 - Aleatória");

    categorias.forEach((categoria, indice) => {
      console.log(`${indice + 1} - ${categoria}`);
    });

    const escolha = await perguntar("\nEscolha uma categoria pelo número: ");
    const numero = Number(escolha);

    if (numero === 0) {
      return sortearItem(categorias);
    }

    if (numero >= 1 && numero <= categorias.length) {
      return categorias[numero - 1];
    }

    console.log("Opção inválida. Tente novamente.");
  }
}

function exibirPalavraOculta(palavra, letrasCertas) {
  return Array.from(palavra)
    .map((letra) => {
      const letraNormalizada = normalizar(letra);

      if (!/^[A-Z]$/.test(letraNormalizada)) {
        return letra;
      }

      return letrasCertas.has(letraNormalizada) ? letra : "_";
    })
    .join(" ");
}

function palavraFoiDescoberta(palavra, letrasCertas) {
  const palavraNormalizada = normalizar(palavra);

  for (const letra of palavraNormalizada) {
    if (/^[A-Z]$/.test(letra) && !letrasCertas.has(letra)) {
      return false;
    }
  }

  return true;
}

function calcularPontuacao(venceu, palavra, letrasCertas, errosRestantes, usouDica) {
  const tamanhoDaPalavra = normalizar(palavra).replace(/[^A-Z]/g, "").length;
  const quantidadeDeAcertos = letrasCertas.size;
  const penalidadeDica = usouDica ? 10 : 0;

  let pontuacao;

  if (venceu) {
    pontuacao = (quantidadeDeAcertos * 10) + (errosRestantes * 20) + tamanhoDaPalavra - penalidadeDica;
  } else {
    pontuacao = (quantidadeDeAcertos * 5) - penalidadeDica;
  }

  return Math.max(0, pontuacao);
}

function carregarRanking() {
  if (!fs.existsSync(RANKING_PATH)) {
    return [];
  }

  try {
    const conteudo = fs.readFileSync(RANKING_PATH, "utf8");
    const ranking = JSON.parse(conteudo);
    return Array.isArray(ranking) ? ranking : [];
  } catch (erro) {
    return [];
  }
}

function salvarResultado(resultado) {
  const ranking = carregarRanking();
  ranking.push(resultado);

  fs.writeFileSync(RANKING_PATH, JSON.stringify(ranking, null, 2), "utf8");
}

function exibirRanking() {
  const ranking = carregarRanking()
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .slice(0, 5);

  console.log("\n🏆 Ranking - Top 5");

  if (ranking.length === 0) {
    console.log("Ainda não há resultados salvos.");
    return;
  }

  ranking.forEach((item, indice) => {
    console.log(
      `${indice + 1}. ${item.nome} - ${item.pontuacao} pontos - ${item.resultado} - Palavra: ${item.palavra}`
    );
  });
}

function mostrarStatus(categoria, palavra, letrasCertas, letrasTentadas, erros) {
  const letras = Array.from(letrasTentadas).sort().join(", ") || "Nenhuma";
  const errosRestantes = MAX_ERROS - erros;

  console.log("\n====================================");
  console.log(`Categoria: ${categoria}`);
  console.log(desenhosForca[erros]);
  console.log(`Palavra: ${exibirPalavraOculta(palavra, letrasCertas)}`);
  console.log(`Letras já tentadas: ${letras}`);
  console.log(`Erros restantes: ${errosRestantes}`);
  console.log("Digite uma letra ou escreva !dica para pedir uma dica.");
  console.log("====================================");
}

async function jogarRodada(nomeJogador) {
  const categoria = await escolherCategoria();
  const item = sortearItem(bancoDePalavras[categoria]);
  const palavra = item.palavra;
  const palavraNormalizada = normalizar(palavra);

  const letrasTentadas = new Set();
  const letrasCertas = new Set();

  let erros = 0;
  let usouDica = false;

  while (erros < MAX_ERROS && !palavraFoiDescoberta(palavra, letrasCertas)) {
    mostrarStatus(categoria, palavra, letrasCertas, letrasTentadas, erros);

    const entrada = await perguntar("\nSua jogada: ");
    const entradaNormalizada = normalizar(entrada);

    if (entradaNormalizada === "!DICA" || entradaNormalizada === "DICA") {
      if (usouDica) {
        console.log("\nVocê já usou a dica nesta rodada.");
      } else {
        usouDica = true;
        console.log(`\nDica: ${item.dica}`);
        console.log("Penalidade: -10 pontos na pontuação final.");
      }
      continue;
    }

    if (entradaNormalizada.length !== 1 || !ehLetraValida(entradaNormalizada)) {
      console.log("\nEntrada inválida. Digite apenas uma letra.");
      continue;
    }

    if (letrasTentadas.has(entradaNormalizada)) {
      console.log("\nVocê já tentou essa letra. Escolha outra.");
      continue;
    }

    letrasTentadas.add(entradaNormalizada);

    if (palavraNormalizada.includes(entradaNormalizada)) {
      letrasCertas.add(entradaNormalizada);
      console.log("\nBoa! A palavra possui essa letra.");
    } else {
      erros++;
      console.log("\nOps! A palavra não possui essa letra.");
    }
  }

  const venceu = palavraFoiDescoberta(palavra, letrasCertas);
  const errosRestantes = MAX_ERROS - erros;
  const pontuacao = calcularPontuacao(venceu, palavra, letrasCertas, errosRestantes, usouDica);
  const resultado = venceu ? "Venceu" : "Perdeu";

  console.log("\n========== Fim da Rodada ==========");
  console.log(desenhosForca[erros]);
  console.log(`Jogador: ${nomeJogador}`);
  console.log(`Resultado: ${resultado}`);
  console.log(`Palavra correta: ${palavra}`);
  console.log(`Pontuação obtida: ${pontuacao}`);
  console.log("===================================");

  salvarResultado({
    nome: nomeJogador,
    resultado,
    palavra,
    categoria,
    pontuacao,
    data: new Date().toISOString()
  });

  exibirRanking();

  return pontuacao;
}

async function iniciarJogo() {
  console.log("====================================");
  console.log("Bem-vindo ao Jogo da Forca!");
  console.log("====================================");

  const nomeDigitado = await perguntar("\nDigite o nome do jogador: ");
  const nomeJogador = nomeDigitado || "Jogador";

  let pontuacaoTotal = 0;
  let quantidadeRodadas = 0;
  let jogarNovamente = true;

  while (jogarNovamente) {
    const pontosDaRodada = await jogarRodada(nomeJogador);
    pontuacaoTotal += pontosDaRodada;
    quantidadeRodadas++;

    const resposta = await perguntar("\nDeseja jogar novamente? (s/n): ");
    jogarNovamente = normalizar(resposta).startsWith("S");
  }

  console.log("\nObrigado por jogar!");
  console.log(`Jogador: ${nomeJogador}`);
  console.log(`Rodadas jogadas: ${quantidadeRodadas}`);
  console.log(`Pontuação total nesta sessão: ${pontuacaoTotal}`);

  rl.close();
}

iniciarJogo();
