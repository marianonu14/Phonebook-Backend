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

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
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
	});

	person.save().then(savedPerson => {
		response.json(savedPerson);
	});
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;
  
	const newPerson = {
		name: body.name,
		number: body.number,
	};
  
	Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
		.then(updatedNote => {
			response.json(updatedNote);
		})
		.catch(error => next(error));
});

app.use((request, response, next) => {
	response.status(404).end();
});

app.use((error, request, response, next) => {
	console.error(error.message);
  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} 
  
	next(error);
});

  
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});