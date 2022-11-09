import './App.css';
import {BrowserRouter as Router, Routes,Route,} from 'react-router-dom';
import HomePage from './pages/home page/HomePage';
import Chats from './pages/chats page/Chats';
function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' exact element={<HomePage/>}/>
          <Route path='/chats' element={<Chats/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
