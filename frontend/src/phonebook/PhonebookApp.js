import {React, useState, useEffect} from 'react'
import axios from 'axios'
import './phonebook.css'
import InputWithLabel from './components/InputWithLabel'
import ContactTable from './components/ContactTable'
import {initialState, getInputs} from './Contact'

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

    const removeContact = (contact) => {
        const id = contact.id;
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
            <ContactTable 
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