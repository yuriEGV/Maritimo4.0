
import { useAuth } from '../context/AuthContext';

export interface Permissions {
    user: any;
    canEditProfile: boolean;
    canManageStudents: boolean;
    canManageUsers: boolean;
    canManageEnrollments: boolean;
    canEditAnnotations: boolean;
    canEditGrades: boolean;
    canViewSensitiveData: boolean;
    isSuperAdmin: boolean;
    canManageCourses: boolean;
}

export const usePermissions = (): Permissions => {
    const { user } = useAuth();
    const role = user?.role || 'guest';

    const isStaff = role === 'admin' || role === 'sostenedor' || role === 'teacher';
    const isAdmin = role === 'admin' || role === 'sostenedor';

    return {
        user,
        canEditProfile: true,
        canManageStudents: isStaff,
        canManageUsers: isAdmin,
        canManageEnrollments: isStaff,
        canEditAnnotations: isStaff,
        canEditGrades: isStaff,
        canViewSensitiveData: isAdmin,
        isSuperAdmin: role === 'admin',
        canManageCourses: isAdmin,
    };
};
