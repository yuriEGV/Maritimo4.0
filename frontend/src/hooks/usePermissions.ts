
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
        canEditProfile: true, // All logged in users can edit their profile
        canManageStudents: role === 'admin' || role === 'sostenedor',
        canEditAnnotations: role === 'admin' || role === 'teacher' || role === 'sostenedor',
        canViewSensitiveData: role === 'admin' || role === 'sostenedor',
        isSuperAdmin: role === 'admin' || role === 'sostenedor',
    };
};
