import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefreshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        const token = JSON.parse(data)?.token;
        
        if (token) {
            setIsAuthenticated(true);
            // If authenticated and trying to access landing page or login, redirect to dashboard
            if (location.pathname === '/' || location.pathname === '/login') {
                navigate('/dashboard', { replace: true });
            }
        } else {
            setIsAuthenticated(false);
            // If not authenticated and trying to access protected routes, redirect to landing page
            const protectedRoutes = [
                '/dashboard',
                '/UserRole',
                '/YouTuberDashboard',
                '/EditorDashboard',
                '/VideoCard',
                '/EditorVideoCard',
                '/video',
                '/editorvideo'
            ];
            
            if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
                navigate('/', { replace: true });
            }
        }
    }, [location, navigate, setIsAuthenticated]);

    return null;
}

export default RefreshHandler;