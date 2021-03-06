import {React, useState, useEffect} from 'react'
import InputWithLabel from './InputWithLabel'
import '../phonebook.css'
import {inputs} from '../Contact'

function getInputs(state, setState){
    return inputs
    .map((input) => {
        const {name, getValue} = input;
        const onChange = (e, id) => {
            const oldValue = state[name];
            const value = getValue(oldValue, e);
            const copy = {...state};
            copy[id][name] = value;
            setState(copy);
        }
        return {
            ...input,
            onChange
        }
    })
}

function initState(contact){
    return inputs.reduce( (obj, input) => {
        const {name} = input;
        obj[name] = contact[name];
        return obj;
    }, {})
}

function copyContact(values, contact){
    const copy = {...contact};
    inputs.forEach( ({name}) => {
        copy[name] = values[name];
    })
    return copy;
} 

const UpdateForm = ({selectedContacts, updateContact, 
    onSuccessfullUpdate, allContacts}) => {
    const initialState = selectedContacts.reduce( (state, contact) => {
       state[contact.id] = initState(contact);
       return state; 
    }, {});
    const [values, setValues] = useState(initialState);

    function update(contact){
        const value = values[contact.id];
        const copy = copyContact(value, contact);
        
        updateContact(copy)
        .then(result => {
            onSuccessfullUpdate();
        })
    }
    const inputs = getInputs(values, setValues);
    const onSubmit = (e) => {
        e.preventDefault();
        selectedContacts.forEach(contact => {
            update(contact);
        })
    }
    return (
        <form onSubmit={onSubmit} className={'update-form'}>
        {
            Object.entries(values).map(([key, value]) => {
                return (
                    <fieldset>
                        {
                            inputs.map(input => {
                                const {name, type, onChange, stateAttribute} = input;
                                const wrapper = (e) =>{
                                    onChange(e, key);
                                }
                                const attributes = {
                                    name,
                                    type,
                                    onChange: wrapper,
                                    [stateAttribute.name]: value[name],
                                    key: name
                                }
                                return (
                                    <InputWithLabel {...attributes}/>
                                )
                            })
                        }
                    </fieldset>
                )
            })
        }
        <button type="submit">save</button>
        </form>
    )
}

export default UpdateForm