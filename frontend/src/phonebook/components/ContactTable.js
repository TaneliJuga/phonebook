import {React, useState} from 'react'
import '../phonebook.css'

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

const Component = ({contacts, removeContact, updateContact, fields}) => {
    const [selectedContacts, setSelectedContacts] = useState([]);


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

    return (
        <div>
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
        </div>
          )
}

export default Component