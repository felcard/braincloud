import './App.css';
import { Route, Routes } from 'react-router-dom';
import Board from './components/Board';


function App() {

  return (
    <div id="app">
      <Routes>
        <Route path='/' element={<Board />} />
      </Routes>
    </div>
  );
}

export default App;