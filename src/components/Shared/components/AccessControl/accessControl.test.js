import React from 'react';
import AccessControl from './index';
import {mount} from 'enzyme';

test('Required permissions satisfied', () => {
    const wrapper = mount(<AccessControl  userPermissions={["read:box","write:paper","delete:entry"]} requiredPermissions={["read:box", "delete:entry", ]}>
            <div>testchild</div>
        </AccessControl>)
    expect(wrapper.children()).toContainEqual(<div>testchild</div>);
  })

  test('Missing a required permission', () => {
    const wrapper = mount(<AccessControl   userPermissions={["read:box","write:paper","delete:entry"]} requiredPermissions={["read:box", "create:cars"]}>
            <div>testchild</div>
        </AccessControl>)
    expect(wrapper.children() == null); 
  })

  test('Missing userPermissions', () => {
    const wrapper = mount(<AccessControl   userPermissions={null} requiredPermissions={["read:box", "create:cars"]}>
            <div>testchild</div>
        </AccessControl>)
    expect(wrapper.children() == null);
  })