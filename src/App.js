import { useState, useEffect } from "react";
import { db } from "./Firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const [toggleFetch, setToggleFetch] = useState(false);
  const outputs = document.getElementById("outputs-value");

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const clearFields = () => {
    setNewName(null);
    setNewAge(null);
  };
  const createUser = async () => {
    await addDoc(usersCollectionRef, { Name: newName, age: newAge });
    clearFields();
    setToggleFetch((prev) => !prev);
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: Number(age) + 1 };
    await updateDoc(userDoc, newFields);
    setToggleFetch((prev) => !prev);
  };
  const decreaseAge = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: Number(age) - 1 };
    await updateDoc(userDoc, newFields);
    setToggleFetch((prev) => !prev);
  };
  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    setToggleFetch((prev) => !prev);
  };

  useEffect(() => {
    getUsers();
  }, [toggleFetch]);

  return (
    <>
      <div className="App">
        <h1>Add User</h1>
        <br />
        <input
          type="text"
          placeholder="Name"
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age"
          onChange={(event) => {
            setNewAge(event.target.value);
          }}
        />
        <button onClick={createUser}>Create user</button>
        <h1>Users Data</h1>
        {users.map((user, index) => {
          return (
            <div className="main-data-body">
              <div key={index.toString()} id="outputs-value">
                <div className="main-outputs">
                  <div>
                    <h1 className="contents"> Name: {user.Name}</h1>
                    <h1 className="contents">Age: {user.age}</h1>
                  </div>
                  <div>
                    <button onClick={() => updateUser(user.id, user.age)}>
                      Increase age
                    </button>
                    <button
                      onClick={() => {
                        deleteUser(user.id);
                      }}
                    >
                      Delete user
                    </button>
                    <button
                      onClick={() => {
                        decreaseAge(user.id, user.age);
                      }}
                    >
                      Decrase Age
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
