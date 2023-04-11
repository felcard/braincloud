import './App.css';
import { Route, Routes } from 'react-router-dom';
import Board from './components/Board';
import Login from './components/Login';
import Admin from './components/Admin';
import Session from './components/Session';


function App() {

  return (
    <div id="app">
      <Routes>
        <Route path='/' element={<Board />} />
        <Route path='/session' element={<Session />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;