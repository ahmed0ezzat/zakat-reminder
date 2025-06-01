import Navbar from './Navbar';
import Home from './Home';
import Calculator from './Calculator';
import Reminder from './Reminder';
import Distribution from './Distribution';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/distribution" element={<Distribution />} />
      </Routes>
    </>
  );
}

export default App;
