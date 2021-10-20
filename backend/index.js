const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(cors())
app.use(express.json())
app.use(logger)

function isString(value){
    return typeof value === 'string';
}

function notEmptyString(value){
    return value.length > 0;
}

const fields = [
    [
        "name",
        [isString, notEmptyString]
    ], 
    [
        "number",
        [isString, notEmptyString]
    ]
].map(([key, test, defaultValue]) => {
    return {
        key,
        test,
        defaultValue
    }
})
.map((field) => {
    const {test} = field;
    let newTest = test;
    if(Array.isArray(test)){
        newTest = (value) => {
            return test.reduce((solution, cur) => {
                return solution && cur(value);
            }, true)
        }
    }
    return {
        ...field,
        test: newTest
    }
})
.map(({key, test, defaultValue}) => {
    const hasDefault = defaultValue !== undefined;
    const newTest = (value) => {
        const notDefined = value === undefined;
        if(hasDefault){
            if(notDefined){
                return defaultValue;
            }  
        }else {
            if(notDefined){
                throw {
                    message: `${key} missing`,
                    status: 400
                }
            }  
        }
        if(!test(value)){
            throw {
                message: `invalid ${key}`,
                status: 400
            }
        }
        console.log('test passed!');
        return value;
    }
    return {key, test: newTest}
})


let data = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

function makeItem(item){
    return fields.reduce( (obj, {key, test}) => {
        obj[key] = test(item[key]);
        return obj
    }, {})
}

function generateId(){
    const maxId = data.length > 0
    ? Math.max(...data.map(e => e.id))
    : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/contacts', (req, res) => {
    res.json(data)
})

app.get('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    //console.log(id)
    const item = data.find(item => item.id == id)
    
    //console.log(item)
    
    if(item){
        response.json(item)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(item => item.id != id)

    response.status(204).end()
})

app.post('/api/contacts', (request, response) => {
    const item = makeItem(request.body)

    item.id = generateId()
    item.date = Date.now()

    data = data.concat(item)
    console.log(data)

    response.json(item)
})

app.put('/api/contacts/:id', (request, response) => {
    const id = request.params.id 
    const oldItem = data.find(item => item.id == id);

    if(!oldItem){
        return response.status(404).json({ 
            error: 'no contact with that id' 
        })
    }

    const newItem = makeItem(request.body)
    newItem.id = id
    newItem.date = Date.now()

    console.log("newItem: ", newItem)
    data = data.map(item => {
        if(item.id == id){
            return newItem;
        }
        return item;
    })
    console.log(data)

    response.json(newItem)
})

app.use(function (err, req, res, next) {
    console.log('in error handler')
    console.log('err.status ', err.status)
    console.log(err)
    const status = err.status ? err.status : 500;
    res.status(status).send({
        message: err.message
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unkown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})