export type PermissionType =
    | 'general'
    | 'balance'
    | 'history'

export interface CompanionPermission {
    type: PermissionType;
}

export type CompanionPermissionsParam = CompanionPermission[];