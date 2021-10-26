require('dotenv').config()
const Contact = require('./models/contact')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const errorHandler = (error, request, response, next) => {
    //console.log('error: ', error)
    console.log('error.name: ', error.name)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(cors())
app.use(express.json())
app.use(logger)

app.use(express.static('./backend/build'))

app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/contacts/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findById(id)
    .then(result => {
        if(result){
            response.json(result)
        }else{
            response.status(500).end()
        }
    })
    .catch(error => {
        next(error)
    })
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    Contact.findByIdAndRemove(id)
    .then(result => {
        response.json(result)
    })
})

app.post('/api/contacts', (request, response, next) => {
    const {name, number} = request.body

    const item = new Contact({
      name: name,
      number: number,
      date: new Date(),
    })
  
    item.save().then(savedItem => {
      response.json(savedItem)
    }).catch(error => {
        next(error)
    })
})

app.put('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    const {name, number} = request.body


    Contact.findByIdAndUpdate(id, {name, number}, {new: true})
    .then(result => {
        response.json(result)
    })
})

app.use(errorHandler)

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})