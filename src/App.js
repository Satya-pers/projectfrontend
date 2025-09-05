import Home from './components/Home';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Route,Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';



function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
        <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/task" element={<Home/>}></Route>
        </Routes>
      </HashRouter>
      
    </div>
  );
}

export default App;
