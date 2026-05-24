import { render } from '@testing-library/react';

import BareBodhikaUi from './ui';

describe('BareBodhikaUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BareBodhikaUi />);
    expect(baseElement).toBeTruthy();
  });
});
