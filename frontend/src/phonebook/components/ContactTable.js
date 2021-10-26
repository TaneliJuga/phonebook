import {React, useState} from 'react'
import UpdateForm from './UpdateForm'
import {fields} from '../Contact'
import '../phonebook.css'

//A button that will be disabled when no contacts are selected
const TableActionButton = ({selectedContacts, text, ...rest}) => {
    const disabled = selectedContacts.length === 0;

    return (
        <button {...rest} disabled={disabled}>{text}</button>
    )
}


const RemoveButton = ({selectedContacts, removeContact}) => {
    const onClick = () => {
        selectedContacts.forEach(contact => {
            removeContact(contact);
        })
    }

    return (
        <TableActionButton 
        onClick={onClick}
        selectedContacts={selectedContacts}
        text={'Remove'}/>
    )
}

const UpdateButton = ({selectedContacts, text, onClick}) => {

    const props = {
        selectedContacts,
        text,
        onClick
    }

    return (
        <TableActionButton {...props}/>
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

    const onSuccessfullUpdate = () => {
        setShowUpdateForm(false); 
    }

    const handleUpdateClick = () => {
        setShowUpdateForm(!showUpdateForm); 
    }

    const buttonText = showUpdateForm ? 'cancel' : 'update';
    const canUpdate = selectedContacts.length > 0;
    const showForm = canUpdate && showUpdateForm;

    return (
    <div>
        <div>
        {
            showForm && (
                <UpdateForm selectedContacts={selectedContacts}
                updateContact={updateContact}
                onSuccessfullUpdate={onSuccessfullUpdate}></UpdateForm>
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
            <RemoveButton 
                selectedContacts={selectedContacts}
                removeContact={removeContact}
            />
            <UpdateButton 
                selectedContacts={selectedContacts}
                onClick={handleUpdateClick} 
                text={buttonText} 
            />
        </div>
    </div>
    </div>
          )
}


export default ContactTable