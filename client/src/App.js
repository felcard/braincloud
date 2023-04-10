import './App.css';
import { Route, Routes } from 'react-router-dom';
import Board from './components/Board';
import Login from './components/Login';


function App() {

  return (
    <div id="app">
      <Routes>
        <Route path='/' element={<Board />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;