import React from 'react';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';
import { UsersAPI } from '../../../api';
import {
  mountWithContexts,
  waitForElement,
} from '../../../../testUtils/enzymeHelpers';
import UserAccessList from './UserAccessList';

jest.mock('../../../api/models/Users');
describe('<UserAccessList />', () => {
  let wrapper;
  let history;
  beforeEach(async () => {
    UsersAPI.readRoles.mockResolvedValue({
      data: {
        results: [
          {
            id: 2,
            name: 'Admin',
            type: 'role',
            url: '/api/v2/roles/257/',
            summary_fields: {
              resource_name: 'template delete project',
              resource_id: 15,
              resource_type: 'job_template',
              resource_type_display_name: 'Job Template',
              user_capabilities: { unattach: true },
            },
          },
          {
            id: 3,
            name: 'Admin',
            type: 'role',
            url: '/api/v2/roles/257/',
            summary_fields: {
              resource_name: 'template delete project',
              resource_id: 16,
              resource_type: 'workflow_job_template',
              resource_type_display_name: 'Job Template',
              user_capabilities: { unattach: true },
            },
          },
          {
            id: 4,
            name: 'Execute',
            type: 'role',
            url: '/api/v2/roles/258/',
            summary_fields: {
              resource_name: 'Credential Bar',
              resource_id: 75,
              resource_type: 'credential',
              resource_type_display_name: 'Credential',
              user_capabilities: { unattach: true },
            },
          },
          {
            id: 5,
            name: 'Update',
            type: 'role',
            url: '/api/v2/roles/259/',
            summary_fields: {
              resource_name: 'Inventory Foo',
              resource_id: 76,
              resource_type: 'inventory',
              resource_type_display_name: 'Inventory',
              user_capabilities: { unattach: true },
            },
          },
          {
            id: 6,
            name: 'Admin',
            type: 'role',
            url: '/api/v2/roles/260/',
            summary_fields: {
              resource_name: 'Smart Inventory Foo',
              resource_id: 77,
              resource_type: 'smart_inventory',
              resource_type_display_name: 'Inventory',
              user_capabilities: { unattach: true },
            },
          },
        ],
        count: 4,
      },
    });

    UsersAPI.readRoleOptions.mockResolvedValue({
      data: { actions: { POST: { id: 1, disassociate: true } } },
    });

    history = createMemoryHistory({
      initialEntries: ['/users/18/access'],
    });

    await act(async () => {
      wrapper = mountWithContexts(
        <Route path="/users/:id/access">
          <UserAccessList />
        </Route>,
        {
          context: {
            router: {
              history,
              route: {
                location: history.location,
                match: { params: { id: 18 } },
              },
            },
          },
        }
      );
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    wrapper.unmount();
  });
  test('should render properly', async () => {
    expect(wrapper.find('UserAccessList').length).toBe(1);
  });

  test('should create proper detailUrl', async () => {
    waitForElement(wrapper, 'ContentEmpty', el => el.length === 0);

    expect(wrapper.find(`Link#userRole-2`).prop('to')).toBe(
      '/templates/job_template/15/details'
    );
    expect(wrapper.find(`Link#userRole-3`).prop('to')).toBe(
      '/templates/workflow_job_template/16/details'
    );
    expect(wrapper.find('Link#userRole-4').prop('to')).toBe(
      '/credentials/75/details'
    );
    expect(wrapper.find('Link#userRole-5').prop('to')).toBe(
      '/inventories/inventory/76/details'
    );
    expect(wrapper.find('Link#userRole-6').prop('to')).toBe(
      '/inventories/smart_inventory/77/details'
    );
  });
});
