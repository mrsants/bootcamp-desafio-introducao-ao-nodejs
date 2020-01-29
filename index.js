const express = require('express');

let count = 0;

const app = express();

app.use(express.json());

const projects = [
    { id: 0, name: "Angular" },
    { id: 1, name: "React" },
    { id: 2, name: "Reactive Native" }
];

app.use((req, res, next) => {
    console.timeEnd('Request');
    console.log(`Method: ${req.method}, Url: ${req.url}`);
    count === 0 && count++;
    console.log(`total requests ${count}`)
    next();
    console.timeEnd('Request');
    count++;
});

const checkByIdBody = (req, res, next) => {
    const { id } = req.body;
    console.log(id);
    if (projects.find(project => project.id === parseInt(id))) {
      return res.status(400).json({ error: 'Project id already exists' })
    }
    return next();
};

const checkById = (req, res, next) => {
    const { id } = req.params;
    const auxVal = projects.findIndex(project => project.id === parseInt(id));
    if (auxVal < 0) {
      return res.status(401).json({ error: 'project id not exists' })
    }
    return next();
};

app.get('/projects', (req, res) => {
    return res.status(201).json(projects);
});

app.get('/projects/:id', checkById, (req, res) => {
    const project = projects.find(project => project.id === req.params.id);
    return res.json(project);
});

app.post('/projects', checkByIdBody, (req, res) => {
    const { id, name } = req.body;
    const project = {
      id,
      name
    };
    projects.push(project);
  
    return res.json(projects);
});

app.listen(3002);
