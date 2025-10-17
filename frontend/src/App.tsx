import './App.css';
import { FeedbackForm } from './components/FeedbackForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Feedback App</h1>
        <p>Welcome to our feedback application!</p>
      </header>
      <main>
        <FeedbackForm />
      </main>
    </div>
  );
}

export default App;