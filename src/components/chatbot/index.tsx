import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openai from 'openai';

const API_KEY = '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';

function ChatGPT() {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');

  

  return (
    <div className="App">
      <h1>ChatGPT Clone</h1>
      <input
        type="text"
        placeholder="Enter your prompt here"
        onChange={(event) => setPrompt(event.target.value)}
      />
      <button>Generate</button>
      <p>Response: {response}</p>
    </div>
  );
}
export default ChatGPT;