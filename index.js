require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
	Person.find({}).then(people => {
		response.json(people);
	});
});

app.post('/api/persons', (request, response) => {
	const body = request.body;
  
	if (!body.name) {
		return response.status(400).json({ 
			error: 'name missing' 
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savePerson => {
		response.json(savePerson);
	})
})


// app.get('/api/persons/:id', (request, response) => {
// 	const id = Number(request.params.id);
// 	const person = Person.find(person => person.id === id);
// 	if (person) {
// 		response.json(person);
// 	} else {
// 		response.status(404).end();
// 	}
// });

// app.delete('/api/persons/:id', (request, response) => {
// 	const id = Number(request.params.id);
// 	persons = persons.filter(person => person.id !== id);
// 	console.log(persons);
// 	response.status(204).end();
// });

// const generateId = () => {
// 	const maxId = persons.length > 0
// 		? Math.max(...persons.map(n => n.id))
// 		: 0;
// 	return maxId + 1;
// };
  
  
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});