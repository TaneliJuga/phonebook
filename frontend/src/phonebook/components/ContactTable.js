import {React, useState} from 'react'
import UpdateForm from './UpdateForm'
import {fields} from '../Contact'
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

const ContactTable = ({contacts, removeContact, updateContact}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const selectedContacts = selectedRows.map(id => {
        return contacts.find(contact => contact.id == id)
    }).filter(contact => contact !== undefined)

    function formatHeader(text){
        const first = text.slice(0, 1);
        const rest = text.slice(1);
        return first.toUpperCase() + rest.toLowerCase();
    }

    function getRowClickHandler(id){
        return () => {
            const index = selectedRows.indexOf(id);
            const isSelected = index !== -1;

            if(isSelected){
                const copy = selectedRows.slice();
                copy.splice(index, 1);
                setSelectedRows(copy);
            }else{
                setSelectedRows([
                    ...selectedRows,
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

    return (
    <div>
        <div>
        {
            showForm && (
                <UpdateForm selectedContacts={selectedContacts}
                updateContact={updateContact}></UpdateForm>
            )
        }
    </div>
    <div className={'table-container'}>
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
                    const isSelected = selectedRows.indexOf(id) !== -1;
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
        <div className={'actions'}>
            <RemoveButton  selectedContacts={selectedContacts}
            removeContact={removeContact}/>
            {updateButton}
        </div>
    </div>
    </div>
          )
}


export default ContactTable