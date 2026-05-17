import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { GoalDetailPage } from './pages/GoalDetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals/:id" element={<GoalDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
