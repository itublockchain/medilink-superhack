import type { Attestation } from '@ethereum-attestation-service/eas-sdk';
import React, { useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from 'store/auth/AuthStore';
import {
    apiGetNullableAttestationById,
    apiGetTransactions,
    apiPostCreateAttestation,
} from 'utils/api';

export class MedilinkEAS {
    key: string;
    constructor(key: string) {
        this.key = key;
    }

    public async genNullableAttestation(
        uid: string,
    ): Promise<Attestation | null> {
        const attestation = await apiGetNullableAttestationById(uid);
        return attestation.data;
    }

    public async genUsersAttestation(
        address: string,
    ): Promise<Array<Attestation>> {
        const res = await apiGetTransactions(address);
        console.log(res.data);
        return [res.data];
    }

    public async genCreateAttestation(
        attestation: Partial<Attestation>,
    ): Promise<Attestation | null> {
        const res = await apiPostCreateAttestation(this.key, attestation);
        console.log(res.data);

        return res.data;
    }
}

const EasContext = React.createContext<MedilinkEAS>(new MedilinkEAS(''));
export const useEas = (): MedilinkEAS => {
    return useContext(EasContext);
};

export function EasContextProvider({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    const [easService, setEasService] = useState(new MedilinkEAS(''));

    const auth = useAuth();
    useEffect(() => {
        if (auth.isAuth) {
            setEasService(new MedilinkEAS(auth.wallet.privateKey));
        }
    }, [auth]);

    return (
        <EasContext.Provider value={easService}>{children}</EasContext.Provider>
    );
}
