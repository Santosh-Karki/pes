import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        return sessionStorage.getItem('token');
    };

    const [token, setToken] = useState(getToken());

    const saveToken = accessToken => {
        sessionStorage.setItem('token', accessToken);
        setToken(accessToken);
    };

    return {
        setToken: saveToken,
        token
    }
}