import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Navigation } from './components/Navigation';
import { FeedbackListPage } from './pages/FeedbackListPage';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <header className="App-header">
          <h1>Feedback App</h1>
          <p>Welcome to our feedback application!</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feedback-list" element={<FeedbackListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;