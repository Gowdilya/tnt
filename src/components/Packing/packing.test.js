import React from 'react';
import ReactDOM from 'react-dom';
import Packing from './index';
import TextField from "@material-ui/core/TextField";
import Spinner from '../Shared/components/Loading/Spinner';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createShallow } from '@material-ui/core/test-utils'


configure({adapter: new Adapter()});

//Smoke Testing
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Packing />, div);
});

describe('<Packing>', ()=>{
  let shallow;
  let wrapper;
  beforeEach(() => {
    shallow = createShallow(); // Need to do this for material UI component
    wrapper = shallow(<Packing/>);
  });

  it('should display One(Carton) Search Box only by default', ()=> {
      expect(wrapper.dive(TextField)).toHaveLength(1);
  });

  it('no Spinner displayed by default', ()=> {
    expect(wrapper.find(Spinner)).toHaveLength(0);
  });

  it('should display Spinner when loadingshipment is true', ()=> {
    wrapper.setState({ loadingshipment: true });
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it('should display Two Search Box when shipment is loaded', ()=> {
    wrapper.setState({ shipment: {id: "5d58acf99e158ec2313e4486", userShipmentId: "123123", products: Array(22), dateCreated: "2019-08-18T01:42:17.122Z", dateModified: "2019-09-11T04:55:20.363Z"} });
    expect(wrapper.find(TextField)).toHaveLength(2);
  });

});