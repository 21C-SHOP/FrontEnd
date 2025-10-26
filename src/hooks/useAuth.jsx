import { useContext } from 'react';
// 1. Context 정의 파일에서 import
import { AuthContext } from '../context/AuthContextDefinition';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};