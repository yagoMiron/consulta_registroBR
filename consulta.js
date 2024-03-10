import promptSync from "prompt-sync";
const prompt = promptSync();

export async function perguntaRegistro() {
  console.log("-------------CONSULTA DE REGISTRO.BR:---------------");
  const registro = prompt("Digite um o registro que deseja pesquisar: ");

  if (!registro) {
    console.log("\nResposta invalida");
  } else {
    const respostaObj = await consultaRegistro(registro);
    exibeRegistro(respostaObj);
  }

  console.log("----------------------------------------------------");
  consultarDeNovo();
}

async function consultaRegistro(registro) {
  const resposta = await fetch(
    `https://brasilapi.com.br/api/registrobr/v1/${registro}`
  );
  return resposta.json();
}

function exibeRegistro(registroObj) {
  const { fqdn, hosts } = registroObj;
  const expiraEm = new Date(registroObj["expires-at"]);
  const status = traduzStatus(registroObj.status_code);
  console.log(`\nO registro ${fqdn} se encontra ${status}.`);
  if (hosts) {
    console.log("\nHosts:");
    for (const host of hosts) {
      console.log("  " + host);
    }
  }
  if (expiraEm.toString() !== "Invalid Date") {
    console.log(
      `\nExpira em: ${expiraEm.getDate()}/${expiraEm.getMonth()}/${expiraEm.getFullYear()}`
    );
  }
}
function consultarDeNovo() {
  const resposta = prompt("Deseja consultar outro registro?(y/N) ");
  if (resposta.toUpperCase() === "N" || resposta === "") {
    return 0;
  }
  console.log("\n");
  perguntaRegistro();
}

function traduzStatus(status_code) {
  switch (status_code) {
    case 0:
      return "Disponivel";
    case 1:
      return "Com tickets concorrentes";
    case 2:
      return "Já registrado";
    case 3:
      return "Indisponivel";
    case 4:
      return "Invalido";
    case 5:
      return "Aguardando liberação";
    case 6:
      return "Disponível no processo de liberação em andamento";
    case 7:
      return "Disponível no processo de liberação em andamento com tickets concorrentes";
    case 8:
      return "Erro";
    case 9:
      return "Ddomínio em processo de liberação competitivo";
    case 10:
      return "Desconhecido";
    default:
      return "Erro";
  }
}
