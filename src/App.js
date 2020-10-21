import React from 'react';
import Router from './Router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import "./assets/style.css"
import store from './Redux/store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router />
      </div>
    </Provider>
  );
}

export default App;
