import {React, useState} from 'react'
import '../phonebook.css'

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

function getInputs2(state, setState){
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
    inputs.foreach( ({name}) => {
        copy[name] = values[name];
    })
    return copy;
} 

const UpdateForm = ({selectedContacts, updateContact}) => {
    const initialState = selectedContacts.reduce( (state, contact) => {
       state[contact.id] = initState(contact);
       return state; 
    }, {});
    const [values, setValues] = useState(initialState);

    function update(contact){
        const values = values[contact.id];
        const copy = copyContact(values, contact);
        
        updateContact(copy);
    }
    const inputs = getInputs2(values, setValues);
    const onSubmit = (e) => {
        e.preventDefault();
        selectedContacts.foreach(contact => {
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