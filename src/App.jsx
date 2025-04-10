import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';
import SignupForm from './SLV Components/signup';  
import LoginForm from './SLV Components/login';
import Verification from './SLV Components/verification';
import SuperUser from './Superuser/superuser';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SidemailVerification from './Mail-Verification/mailverification';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/verification" element={<Verification/>}/>
        <Route path='/superuser'  element={<SuperUser/>} />
        <Route path='/Verify' element={<SidemailVerification/>}/>
      </Routes>
    </Router>
  );
}

export default App;
