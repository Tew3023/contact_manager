import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }

  const [list, setList] = useState<Contact[]>([]);
  const [editValue, setEditValue] = useState<Contact | null>(null);
  const [popup, setPopup] = useState(false);

  // Fetch all contacts
  const fetchContact = async () => {
    try {
      const { data } = await axios.get("http://127.0.0.1:5000/contact");
      setList(data.contact);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete a contact
  const deleteContact = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_contact/${id}`);
      setList((prevList) => prevList.filter((contact) => contact.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // Open the edit popup with the selected contact
  const openEditPopup = (contact: Contact) => {
    setEditValue(contact);
    setPopup(true);
  };

  // Update a contact
  const updateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editValue) {
      try {
        await axios.put(`http://127.0.0.1:5000/update_contact/${editValue.id}`, {
          firstName: editValue.firstName,
          lastName: editValue.lastName,
          email: editValue.email,
        });
        setList((prevList) =>
          prevList.map((contact) =>
            contact.id === editValue.id ? editValue : contact
          )
        );
        setPopup(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  let popupElement = null;
  if (popup) {
    popupElement = (
      <div className="popup">
        <div className="popup-content">
          <h2>Edit Contact</h2>
          <form onSubmit={updateContact}>
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={editValue?.firstName || ""}
              onChange={(e) =>
                setEditValue((prev) => ({
                  ...prev!,
                  firstName: e.target.value,
                }))
              }
            />
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={editValue?.lastName || ""}
              onChange={(e) =>
                setEditValue((prev) => ({
                  ...prev!,
                  lastName: e.target.value,
                }))
              }
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={editValue?.email || ""}
              onChange={(e) =>
                setEditValue((prev) => ({
                  ...prev!,
                  email: e.target.value,
                }))
              }
            />
            <div className="popup-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setPopup(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {popupElement}
      {list.length > 0 ? (
        <div>
          {list.map((contact: Contact) => (
            <div key={contact.id} className="contact">
              <h3>
                {contact.firstName} {contact.lastName}
              </h3>
              <p>Email: {contact.email}</p>
              <button onClick={() => openEditPopup(contact)}>Edit</button>
              <button onClick={() => deleteContact(contact.id)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <div>Fetching error!</div>
      )}
    </div>
  );
}

export default App;
