/**
 * A simple component test to verify that our setup works
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a simple test component
const TestComponent = () => (
  <div>
    <h1>Test Component</h1>
    <p>This is a simple test component</p>
  </div>
);

describe('Simple Component Test', () => {
  it('should render a component', () => {
    render(<TestComponent />);
    
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('This is a simple test component')).toBeInTheDocument();
  });
}); 