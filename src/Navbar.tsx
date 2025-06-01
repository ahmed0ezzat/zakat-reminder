import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded transition-colors duration-200 text-sm font-medium ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white shadow mb-6 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="text-xl font-bold text-blue-600">Zakat Reminder</div>
        <div className="space-x-1 flex flex-wrap">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/calculator" className={linkClass}>Calculator</NavLink>
          <NavLink to="/reminder" className={linkClass}>Reminder</NavLink>
          <NavLink to="/distribution" className={linkClass}>Distribution</NavLink>
        </div>
      </div>
    </nav>
  );
}
