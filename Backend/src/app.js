const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

function validateProjectId(request, response, next){
  const { id } = request.params;
  if (!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID.'});
  }
  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url , techs } = request.body;
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id",validateProjectId, (request, response) => {
  const {id} = request.params;
  const { title, url , techs } = request.body;
  const position = repositories.findIndex( repository => repository.id === id);
  
  if(position < 0){
    return response.status(400).json({ error: "Project not found" })
  }

  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[position].likes
  }

  repositories[position] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const position = repositories.findIndex( repository => repository.id === id);

  if(position < 0){
    return response.status(400).json({ error: "Project not found" })
  }

  repositories.splice(position, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const position = repositories.findIndex( repository => repository.id === id);

  if(position < 0){
    return response.status(400).json({ error: "Project not found" })
  }

  repositories[position].likes += 1;

  return response.json(repositories[position])

});

module.exports = app;
