import './App.css';
// import 'fontsource-roboto';
import {BrowserRouter, Route, Switch}  from 'react-router-dom';
import Header from './components/common/Header';
import Survey from './components/Survey';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
          <Switch>
            <Route path='/' component={Survey} exact/>
            <Route path='/Survey' component={Survey} exact/>
          </Switch>
        {/* <Survey surveyId = {new URLSearchParams(location.search).get('surveyId')}/>  */}
      </BrowserRouter>
    </div>
  );
}

export default App;
