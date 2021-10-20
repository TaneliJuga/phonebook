import {React, useState, useEffect} from 'react'
import axios from 'axios'
import './phonebook.css'
import UpdateForm from './components/UpdateForm'
import InputWithLabel from './components/InputWithLabel'


function getTextValue(value, event){
    return event.target.value;
}

const inputs = [
    [
        'name', 
        ['value', ''], 
        'text',
        getTextValue
    ],
    [
        'number', 
        ['value', ''], 
        'text',
        getTextValue
    ]
].map(([name, [stateAttribute, initialValue], type, getValue]) => {
    return {
        name,
        stateAttribute: {
            name: stateAttribute,
            initialValue
        },
        type,
        getValue
    }
})

const fields = inputs.map(({name}) => {
    return {
        key: name
    }
})

function getInputs(state, setState){
    return inputs
    .map((input) => {
        const {name, getValue} = input;
        const onChange = (e) => {
            const oldValue = state[name];
            const value = getValue(oldValue, e);
            setState({
                ...state,
                [name]: value
            })
        }
        return {
            ...input,
            onChange
        }
    })
}

const initialState = inputs.reduce( (obj, input) => {
    const {name, stateAttribute} = input;
    obj[name] = stateAttribute.initialValue;
    return obj;
}, {})

const ContactForm = ({addContact}) => {
    const [values, setValues] = useState(initialState)
    const inputs = getInputs(values, setValues);
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(values);
        addContact(values).then(contact => {
            setValues(initialState);
        })
    }

    return (
        <form onSubmit={onSubmit} className={'contact-form'}>
        {
            inputs.map(input => {
                const {name, type, onChange, stateAttribute} = input;
                const attributes = {
                    name,
                    type,
                    onChange,
                    [stateAttribute.name]: values[name],
                    key: name
                }
                return (
                    <InputWithLabel {...attributes}/>
                )
            })
        }
        <button type="submit">save</button>
        </form>
    )
}

const RemoveButton = ({selectedContacts, removeContact}) => {
    const onClick = () => {
        selectedContacts.forEach(contact => {
            removeContact(contact);
        })
    }

    const disabled = selectedContacts.length === 0;

    return (
        <button onClick={onClick} disabled={disabled}>Remove</button>
    )
}

const Contacts = ({contacts, removeContact, updateContact}) => {
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    function formatHeader(text){
        const first = text.slice(0, 1);
        const rest = text.slice(1);
        return first.toUpperCase() + rest.toLowerCase();
    }

    function getRowClickHandler(id){
        return () => {
            const index = selectedContacts.indexOf(id);
            const isSelected = index !== -1;

            if(isSelected){
                const copy = selectedContacts.slice();
                copy.splice(index, 1);
                setSelectedContacts(copy);
            }else{
                setSelectedContacts([
                    ...selectedContacts,
                    id
                ]);
            }
        }
    }

    const toggleUpdate = () => {
        setShowUpdateForm(!showUpdateForm); 
    }

    const buttonText = showUpdateForm ? 'cancel' : 'update';
    const canUpdate = selectedContacts.length > 0;
    const showForm = canUpdate && showUpdateForm;

    const updateButton = (
        <button onClick={toggleUpdate}>{buttonText}</button>
    )
    const contactsToUpdate = selectedContacts.map(id => {
        return contacts.find(contact => contact.id == id)
    })

    return (
        <div>
            {
                showForm && (
                    <UpdateForm selectedContacts={contactsToUpdate}
                    updateContact={updateContact}></UpdateForm>
                )
            }
            <table>
            <caption>Contacts</caption>
          <thead>
            <tr>
              {
                  fields.map(({key}) => {
                      return (
                        <th key={key}>{formatHeader(key)}</th>
                      )
                  })
              }
          </tr>
          </thead>
          <tbody>
              {
                contacts.map((contact) => {
                    const {id} = contact;
                    const isSelected = selectedContacts.indexOf(id) !== -1;
                    const className = isSelected ? 'checked' : '';
                  return (
                  <tr key={id} className={className}
                  onClick={getRowClickHandler(id)}>
                    {
                        fields.map( ({key}) => {
                            return (
                                <td>{contact[key]}</td>
                            )
                        })
                    }
                  </tr>
                  )
                })
              }
          </tbody>
        </table>
        <RemoveButton  selectedContacts={selectedContacts}
        removeContact={removeContact}/>
        {updateButton}
        </div>
          )
}

const App = () => {
    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        updateContacts();
    }, [])

    function updateContacts() {
        axios.
        get('http://localhost:3001/api/contacts')
        .then(response => {
            setContacts(response.data);
        })
    }

    const addContact = (contact) => {
        const promise = axios.
        post('http://localhost:3001/api/contacts', contact)
        .then(response => {
            updateContacts();
        })
        return promise;
    }

    const removeContact = (id) => {
        const promise = axios.
        delete(`http://localhost:3001/api/contacts/${id}`)
        .then(response => {
            updateContacts();
        })
        return promise;
    }

    const updateContact = (contact) => {
        console.log('updateContact');
        const {id} = contact;

        const promise = axios.
        put(`http://localhost:3001/api/contacts/${id}`, contact)
        .then(response => {
            updateContacts();
        })
        return promise;
    }

    return  (
        <div>
            <Contacts 
            contacts={contacts} 
            removeContact={removeContact}
            updateContact={updateContact}/>
            <h2>Add contact</h2>
            <ContactForm 
            addContact={addContact} />
        </div>
    )
}

export default App