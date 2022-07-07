import './App.css';
import Login from './paginas/Login';
import Inicio from './paginas/Inicio';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio/*" element={<Inicio />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
