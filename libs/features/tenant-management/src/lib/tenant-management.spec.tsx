import { render } from '@testing-library/react';

import BareBodhikaTenantManagement from './tenant-management';

describe('BareBodhikaTenantManagement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaTenantManagement />);
    expect(baseElement).toBeTruthy();
  });
});
