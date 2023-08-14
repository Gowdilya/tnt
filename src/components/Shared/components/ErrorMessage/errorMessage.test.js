import React from 'react';
import ReactDOM from 'react-dom';
import ErrorMessage from './index';

//Smoke Testing
describe('<ErrorMessage/>', ()=> {
    it('renders <ErrorMessage/> without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ErrorMessage />, div);
      });
});