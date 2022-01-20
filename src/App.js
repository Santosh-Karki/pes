import './App.css';
// import 'fontsource-roboto';
import {BrowserRouter, Route, Switch}  from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react"
import Header from './components/common/Header';
import Survey from './components/Survey';
import Admin from './components/Admin';

function App({ pca }) {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
          <Switch>
            <Route path='/' component={Survey} exact/>
            <Route path='/Survey' component={Survey} exact/>
            <Route path='/Admin' exact>
              <MsalProvider instance={pca}>
                <Admin/>
              </MsalProvider>
            </Route>
          </Switch>
        {/* <Survey surveyId = {new URLSearchParams(location.search).get('surveyId')}/>  */}
      </BrowserRouter>
    </div>
  );
}

export default App;
