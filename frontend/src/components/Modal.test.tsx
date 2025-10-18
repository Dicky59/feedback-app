import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders modal when isOpen is true', () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} type="success">
        <p>Test message</p>
      </Modal>
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
  });

  it('does not render modal when isOpen is false', () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={false} onClose={mockOnClose} type="success">
        <p>Test message</p>
      </Modal>
    );

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} type="success">
        <p>Test message</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} type="success">
        <p>Test message</p>
      </Modal>
    );

    const overlay = screen.getByText('Test message').closest('.modal-overlay');
    if (overlay) {
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('applies correct CSS class for success type', () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} type="success">
        <p>Test message</p>
      </Modal>
    );

    const modalContent = screen.getByText('Test message').closest('.modal-content');
    expect(modalContent).toHaveClass('success');
  });

  it('applies correct CSS class for error type', () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} type="error">
        <p>Test message</p>
      </Modal>
    );

    const modalContent = screen.getByText('Test message').closest('.modal-content');
    expect(modalContent).toHaveClass('error');
  });
});
