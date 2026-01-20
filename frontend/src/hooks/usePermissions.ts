
import { useAuth } from '../context/AuthContext';

export interface Permissions {
    user: any;
    canEditProfile: boolean;
    canManageStudents: boolean;
    canManageUsers: boolean;
    canEditAnnotations: boolean;
    canViewSensitiveData: boolean;
    isSuperAdmin: boolean;
}

export const usePermissions = (): Permissions => {
    const { user } = useAuth();
    const role = user?.role || 'guest';

    return {
        user,
        canEditProfile: true,
        canManageStudents: role === 'admin' || role === 'sostenedor',
        canManageUsers: role === 'admin' || role === 'sostenedor',
        canEditAnnotations: role === 'admin' || role === 'teacher' || role === 'sostenedor',
        canViewSensitiveData: role === 'admin' || role === 'sostenedor',
        isSuperAdmin: role === 'admin' || role === 'sostenedor',
    };
};
