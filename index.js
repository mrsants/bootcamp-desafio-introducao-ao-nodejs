const express = require('express');

let count = 0;

const app = express();

app.use(express.json());

const projects = [
    {
        id: 1,
        title: 'react',
        tasks: []
    }
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

function checkExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) {
        return res.status(400).json({ error: 'Project not found' });
    }

    return next();
}

const checkById = (req, res, next) => {
    const { id } = req.params;
    if (projects.find(project => project.id === parseInt(id))) {
        return res.status(400).json({ error: 'Project id already exists' })
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

function validateExistsArray(req, res, next) {
    const { id } = req.body;

    let index = projects.findIndex(project => project.id == id);

    if (index >= 0) {
        return res.status(400).json({
            error: 'project already exists'
        });
    }
    return next();
}

app.post('/projects', validateExistsArray, (req, res) => {
    const { id, title } = req.body;

    const newProject = {
        id,
        title,
        tasks: []
    };

    projects.push(newProject);
    return res.status(201).json({
        message: 'project create success'
    });
});

app.put('/projects/:id', checkExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

app.delete('/projects/:id', checkExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

app.post('/projects/:id/tasks', checkExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
});
app.listen(3002);