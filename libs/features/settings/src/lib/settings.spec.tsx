import { render } from '@testing-library/react';

import BareBodhikaSettings from './settings';

describe('BareBodhikaSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaSettings />);
    expect(baseElement).toBeTruthy();
  });
});
