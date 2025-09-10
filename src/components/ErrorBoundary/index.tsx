import React from 'react';

export class ErrorBoundary extends React.PureComponent<{ children: React.ReactNode }> {
    state = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true, error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
