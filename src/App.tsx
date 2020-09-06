import React, { useState, useCallback } from 'react';
import './App.css';
import { UserSearchInput } from './components';
import { IUser } from './components/searchInput/utils';
import { users } from './userList';

function App() {
  const [selectedUser, setSelectedUser] = useState<IUser>({});
  const onSelect = useCallback((user) => {
    setSelectedUser(user);
    console.log(user)
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <h1>{selectedUser.name  && `Selected:  ${selectedUser.name}`}</h1>
      </header>
      <section className="user-search-container">
        <UserSearchInput
          users={users}
          onSelect={onSelect}
        />
      </section>
    </div>
  );
}

export default App;
