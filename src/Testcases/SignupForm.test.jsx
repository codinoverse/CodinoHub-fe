import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../SLV Components/signup';
import { BrowserRouter as Router } from 'react-router-dom'; 
import axios from 'axios';


vi.mock('axios');

describe('SignupForm', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('renders form inputs correctly', () => {
        render(
            <Router>
                <SignupForm />
            </Router>
        );

        expect(screen.getByPlaceholderText('Enter firstname')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter lastname')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter company name')).toBeInTheDocument();
    });

    test('handles input change correctly', () => {
        render(
            <Router>
                <SignupForm />
            </Router>
        );

        const firstNameInput = screen.getByPlaceholderText('Enter firstname');
        fireEvent.change(firstNameInput, { target: { value: 'John' } });

        expect(firstNameInput.value).toBe('John');
    });

    test('submits form successfully', async () => {
        axios.post.mockResolvedValueOnce({ status: 200 });

        render(
            <Router>
                <SignupForm />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter firstname'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Enter lastname'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'johndoe' } });
        fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'johndoe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter company name'), { target: { value: 'TechCorp' } });

        const signupButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(signupButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

        expect(screen.getByText('User created successfully!')).toBeInTheDocument();
    });

    test('shows error message on failed submission', async () => {
        axios.post.mockRejectedValueOnce({
            response: { status: 400, data: { message: 'User already exists' } }
        });

        render(
            <Router>
                <SignupForm />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter firstname'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Enter lastname'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'johndoe' } });
        fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'johndoe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter company name'), { target: { value: 'TechCorp' } });

        const signupButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(signupButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

        expect(screen.getByText('Error 400: User already exists')).toBeInTheDocument();
    });
});
