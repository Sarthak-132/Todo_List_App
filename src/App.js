import { useState, useEffect } from "react";
import List from "./components/List";
import Alert from "./components/Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIdEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show: false, msg: '', type: ''});

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name){
      showAlert(true, "danger", "Please Enter Value")
    }
    else if(name && isEditing){
      setList(
        list.map((item) => {
          if(item.id === editID){
            return {...item, title: name}
          }
          return item
        })
      );
      setName("");
      setEditID(null);
      setIdEditing(false);
      showAlert(true, "success", "Item Edited")
    }else{
      showAlert(true, "success", "Item Added to List")
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({show, type, msg});
  }

  const removeItem = (id) => {
    showAlert(true, "danger", "Item Removed");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIdEditing(true);
    setEditID(id);
    setName(editItem.title);
  };
  const clearList = () => {
    showAlert(true, "danger", "List cleared add new list");
    setList([]);
  };

  return (
    <>
      <section className="section-center">
        <form onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} 
            list={list} />}
          <h3 style={{marginBottom: '2rem', textAlign: 'center', color: 'rgb(5 134 244)'}}>To Do List App</h3>
          <div className="mb-3">
            <input type="text" className="form-control my-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="add item" />
          </div>
          <button type="submit" className="btn btn-sm px-4 btn-dark">
            {isEditing ? 'Edit' : 'Submit'}
          </button>
        </form>
        { list.length > 0 && (
          <div style={{marginTop: '2rem'}}>
            <List items={list} removeItem={removeItem} editItem={editItem}/>
            <div className="text-center">
              <button onClick={clearList} className="my-3 px-4  btn btn-sm btn-warning">
                Clear Items
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default App;