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

export {inputs, fields, getInputs, initialState}