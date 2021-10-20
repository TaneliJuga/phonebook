import {React, useState, useEffect} from 'react'
import '../phonebook.css'

const Component = ({name, onChange, type, ...rest}) => {
    const inputAttributes = {
        ...rest,
        id: name, 
        onChange,
        type
    }
    return (
        <div className={'form-column'}>
            <label htmlFor={name}>{name}</label>
            <input {...inputAttributes}></input>
        </div>
    )
}


export default Component