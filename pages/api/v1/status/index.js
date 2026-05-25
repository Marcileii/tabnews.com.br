function status(resquest, response) {
  response
    .status(200)
    .json({ chave: "Alunos do curso.dev são acimas da média" });
}

export default status;
