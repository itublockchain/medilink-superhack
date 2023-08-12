import { useRecoilValue, useSetRecoilState } from 'recoil';
import type { SetterOrUpdater } from 'recoil';
import { atom } from 'recoil';

export type AuthWallet = {
    privateKey: string;
    publicKey: string;
    address: string;
};

export interface Auth {
    isAuth: boolean;
    wallet: AuthWallet | null;
}

export interface AuthNullSafe extends Auth {
    wallet: AuthWallet;
}

export const AuthAtom = atom<Auth>({
    default: {
        isAuth: false,
        wallet: null,
    },
    key: 'Auth.Atom',
});

export const useAuth = <T = Auth>(): T => {
    return useRecoilValue(AuthAtom) as T;
};

export const useAuthNullSafe = (): AuthNullSafe => {
    return useAuth<AuthNullSafe>();
};

export const useSetAuth = (): SetterOrUpdater<Auth> => {
    return useSetRecoilState(AuthAtom);
};

export const useAuthLogout = (): (() => void) => {
    const setAuth = useSetAuth();

    return (): void =>
        setAuth({
            isAuth: false,
            wallet: null,
        });
};
