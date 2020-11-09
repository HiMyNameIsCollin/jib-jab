import React from 'react';
import './App.sass'
import AppContainer from './AppContainer'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useRouteMatch
} from "react-router-dom"


function App() {
  return (
    <div className="App">
    <Router>
      <AppContainer Link={Link} Switch={Switch} Route={Route} useLocation={useLocation} />
    </Router>
    </div>
  );
}

export default App;
