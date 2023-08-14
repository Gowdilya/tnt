import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/app';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom'
import history from './components/Shared/components/history';
import Auth from './auth/auth';
import { RecoilRoot } from 'recoil';
import {Provider} from 'react-redux'; 
import { store } from './app/store';

const auth = new Auth();

ReactDOM.render(
    <RecoilRoot>
        <Router history={history}>
            <Provider store={store}>
                 <App auth={auth} />
            </Provider>
        </Router>
    </RecoilRoot>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

