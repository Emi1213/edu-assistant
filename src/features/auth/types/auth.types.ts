export interface UserProfile{
    id: number;
    email: string;
    role: string;
    name: string;
    lastName: string;
    isActive: boolean;
    microsoftId: string;
    displayName: string;
    profilePicture: string | null;
    lastLogin: Date | null;
}