export type CompanionRequestAccessParams = {
    permissions: {
        type: 'general' | 'balance' | 'history';
    }[];
};
export type PermissionType = 'general' | 'balance' | 'history';
export interface Permission {
    type: PermissionType;
}
export type PermissionsParam = Permission[];
