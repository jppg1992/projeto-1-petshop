var express = require("express");
var app = express();

// Node.js body parsing middleware.
var bodyParser = require("body-parser");
//configuracao de uso do body-parser
//parse application/x-www-form-urlencoded (dados vem no body da req. HTTP)
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json (se os dados viessem em formato JSON na requisição)
//app.use(bodyParser.json())

//declara um diretório padrão
//para o node carregar arquivos estáticos
app.use(express.static("public"));

//configurando acesso ao banco de dados
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "petshop",
  password: "postgres",
  port: 5432,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/pages/home.html");
});

app.get("/sobre", (req, res) => {
  res.sendFile(__dirname + "/public/pages/sobre.html");
});

app.get("/cadastro", (req, res) => {
  res.sendFile(__dirname + "/public/pages/cadastro.html");
});

app.get("/produtos", (req, res) => {
  pool.query(
    `SELECT codigo,nome,preco,qtd_estoque FROM produtos
   ORDER BY codigo asc`,
    (error, results, fields) => {
      if (error) throw error;

      var htmlProds = `<!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="../css/base.css" />
          <link rel="stylesheet" href="../css/produtos.css" />
          <title>Produtos</title>
        </head>
        <body>
          <header class="navbar">
            <nav>
              <a href="/">
                <img
                  class="logo"
                  src="../assets/logo4.png"
                  style="height: 50px; width: 50px"
                  alt="logo-da-pagina"
                />
              </a>
      
              <ul>
                <li><a href="/">Página Inicial</a></li>
                <li><a href="/Sobre">Sobre</a></li>
                <li><a href="/produtos">Produtos</a></li>
              </ul>
            </nav>
          </header>
          <main class="container">`;

      htmlProds += "<h1>Lista de produtos</h2>";

      htmlProds += `<table > 
                    <tr> 
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Preço</th>
                      <th>Estoque</th>
                    </tr>`;
      Object.keys(results.rows).forEach(function (key) {
        var row = results.rows[key];

        htmlProds += `<tr>  
                      <td>${row.codigo}</td>
                      <td><a class="name" href="/produto/${row.codigo}">${row.nome}</a></td>
                      <td>${row.preco}</td>
                      <td>${row.qtd_estoque}</td>
                    </tr>`;
      });
      htmlProds += `</table>`;
      htmlProds += `</main>

      <footer>
        <a href="https://jppg1992.github.io/dev-links/" target="_blank">
          © 2023 João Paulo Godinho</a>
      </footer>
    </body>
    
    </html>`;

      res.send(htmlProds);
    }
  );
});

app.get("/produto/:codigo", (req, res) => {
  const cod = req.params.codigo;
  pool.query(
    `SELECT codigo,nome,preco,qtd_estoque,descricao FROM produtos
   where codigo = ${cod}`,
    (error, results, fields) => {
      if (error) throw error;

      var htmlProds = `<!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="../css/base.css" />
          <link rel="stylesheet" href="../css/produtos.css" />
          <title>Dados Produto</title>
        </head>
        <body>
          <header class="navbar">
            <nav>
              <a href="/">
                <img
                  class="logo"
                  src="../assets/logo4.png"
                  style="height: 50px; width: 50px"
                  alt="logo-da-pagina"
                />
              </a>
      
              <ul>
                <li><a href="/">Página Inicial</a></li>
                <li><a href="/Sobre">Sobre</a></li>
                <li><a href="/produtos">Produtos</a></li>
              </ul>
            </nav>
          </header>
          <main class="container">`;

      Object.keys(results.rows).forEach(function (key) {
        var row = results.rows[key];

        htmlProds += `<div class="dados">  
                      <br/><br/>
                      <h1>Dados do produto de código: ${cod}</h2>
                      <p><strong>Código:</strong> ${row.codigo}</p>
                      <p><strong>Nome:</strong> ${row.nome} </p>
                      <p><strong>Preço:</strong> ${row.preco}</p>
                      <p><strong>Qtd. Estoque:</strong> ${row.qtd_estoque}</p>
                      <p><strong>Descrição:</strong> ${row.descricao}</p>
                      </div>`;
      });
      htmlProds += `</table>`;
      htmlProds += `</main>

      <footer>
        <a href="https://jppg1992.github.io/dev-links/" target="_blank">
          © 2023 João Paulo Godinho</a>
      </footer>
    </body>
    
    </html>`;

      res.send(htmlProds);
    }
  );
});

app.post("/salvarProduto", (req, res) => {
  var nome = req.body.nome;
  var preco = parseFloat(req.body.preco).toFixed(2);
  var qtd = parseFloat(req.body.qtd).toFixed(3);
  var descricao = req.body.descricao;
  //console.log(req.body.preco, req.body.qtd);
  pool.query(
    `INSERT INTO produtos (nome, preco, qtd_estoque,descricao) 
  VALUES ( '${nome}', ${preco}, ${qtd},'${descricao}')`,
    (error, results, fields) => {
      if (error) throw error;
      //senao esta conectado!
    }
  );
  res.redirect("/produtos");
});

app.listen(3000, () => {
  console.log("App rodando na url http://localhost:3000 !");
});
