import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../SLV Components/login';

vi.mock('axios');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui) => render(ui, { wrapper: BrowserRouter });

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the login form correctly', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText('CodinoHub.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument(); 
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter valid password')).toBeInTheDocument();
    expect(screen.getByLabelText('SuperUser')).toBeInTheDocument();
    expect(screen.getByLabelText('User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText('Signup here')).toBeInTheDocument();
  });

  it('updates form inputs on change', () => {
    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter valid password');
    const superUserRadio = screen.getByLabelText('SuperUser');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(superUserRadio);

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
    expect(superUserRadio).toBeChecked();
  });

  it('shows an alert when userType is not selected', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter valid password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Please select a user type.');
    alertSpy.mockRestore();
  });

  it('submits form and navigates to /user for regular user', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { username: 'testuser' },
    });

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter valid password');
    const userRadio = screen.getByLabelText('User');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(userRadio);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://192.168.1.12:9000/login', {
        username: 'testuser',
        password: 'password123',
        userType: 'user',
      });
      expect(localStorage.getItem('userDetails')).toBe(
        JSON.stringify({ username: 'testuser' })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/user');
    });
  });

  it('submits form and navigates to /superuser for superuser', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { username: 'superuser' },
    });
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        username: 'superuser',
        email: 'superuser@example.com',
        companyName: 'TestCorp',
      },
    });

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter valid password');
    const superUserRadio = screen.getByLabelText('SuperUser');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'superuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(superUserRadio);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://192.168.1.12:9000/login', {
        username: 'superuser',
        password: 'password123',
        userType: 'superuser',
      });
      expect(axios.get).toHaveBeenCalledWith(
        'http://192.168.1.12:9000/superUser/getSuperUser?username=superuser'
      );
      expect(localStorage.getItem('userDetails')).toBe(
        JSON.stringify({
          username: 'superuser',
          email: 'superuser@example.com',
          companyName: 'TestCorp',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/superuser');
    });
  });

  it('displays error message on login failure', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter valid password');
    const userRadio = screen.getByLabelText('User');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(userRadio);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Something went wrong. Please try again.');
    });

    alertSpy.mockRestore();
  });

  it('displays error message on superuser data fetch failure', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { username: 'superuser' },
    });
    axios.get.mockResolvedValue({
      status: 400,
      data: { message: 'Superuser not found' },
    });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithRouter(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter valid password');
    const superUserRadio = screen.getByLabelText('SuperUser');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'superuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(superUserRadio);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Superuser not found');
    });

    alertSpy.mockRestore();
  });
});