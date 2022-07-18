const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

let persons = [
	{
		'name': 'Ada Lovsdelace',
		'number': '39-44-5323523',
		'id': 2
	},
	{
		'name': 'Roberto',
		'number': '1111111',
		'id': 1658000100381
	},
	{
		'name': 'Julian',
		'number': '23131',
		'id': 1658002542437
	},
	{
		'name': 'Santi',
		'number': '23123423424',
		'id': 1658002564141
	},
	{
		'name': 'Marcos',
		'number': '454545',
		'id': 1658002715229
	},
	{
		'name': 'Raul',
		'number': '32424',
		'id': 1658002794513
	},
	{
		'name': 'Alberto',
		'number': '3242423',
		'id': 1658002962533
	},
	{
		'name': 'Alejandro',
		'number': '4545454',
		'id': 1658003112053
	}
];

app.get('/', (request, response) => {
	response.send('<h1>Api Persons</h1>');
});

app.get('/api/persons', morgan('combined'), (request, response) => {
	response.json(persons);
});


app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);
	console.log(persons);
	response.status(204).end();
});

const generateId = () => {
	const maxId = persons.length > 0
		? Math.max(...persons.map(n => n.id))
		: 0;
	return maxId + 1;
};
  
app.post('/api/persons', morgan('tiny'), (request, response) => {
	const body = request.body;
  
	if (!body.name) {
		return response.status(400).json({ 
			error: 'name missing' 
		});
	}

	const personFilter = persons.find(person => person.name === body.name);

	if (personFilter) {
		return response.status(400).json({ 
			error: 'Name Repeat' 
		});
	}
  
	const person = {
		name: body.name,
		number: body.number,
		id: generateId()
	};
  
	persons = persons.concat(person);
	response.json(person);
});
  
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});