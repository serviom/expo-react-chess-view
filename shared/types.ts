export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse {
    user: IResponseUserAuth;
    tokens: ITokens
}

export interface ISignUpResponse extends IStatusResponse {
    redirectUrl: string;
    user: IResponseUserAuth;
}

export interface IActivateResponse extends IStatusResponse {
    redirectUrl: string;
}

export interface IForgotPasswordResponse extends IStatusResponse {
    redirectUrl: string;
    email: string;
}

export interface IResetPasswordResponse extends IStatusResponse {
    redirectUrl: string;
}

export interface IStatusResponse {
    status: number;
}

export enum Role {
    Admin = 'admin',
    Moderator = 'moderator',
    Customer = 'customer',
}

export interface IResponseUserAuth {
    id: string;
    role: Role;
    secondName?: string;
    name: string;
    username: string;
    email: string;
    permissions: string[];
    organizationId: string;
}

export enum Route {
    Play = '/play',
    Logout = '/logout',
    SignUp = '/sign_up',
    SignIn = '/sign_in',
    Activate = '/activate',
    SignInByGoogle = '/api/auth/google/login',
    SignInByFacebook = '/sign_in_by_facebook',
    ForgotPassword = '/forgot_password',
    ResetPassword = '/reset_password',
    ProfileSettings = '/profile/(tabs)/settings',
    ProfileInfo = '/profile/(tabs)/info',
    About = '/about',
    Home = '/home',
    Screen = '/screen',
}

