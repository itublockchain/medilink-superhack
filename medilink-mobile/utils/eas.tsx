import React, { useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from 'store/auth/AuthStore';
import {
    apiGetAttestations,
    apiGetNullableAttestationById,
    apiPostCreateAttestation,
    apiPostFaucetRequest,
} from 'utils/api';

export type AttestationDto = {
    id: string;
    schema: string;
    refUID: string;
    time: number;
    expirationTime: number;
    revocationTime: number;
    recipient: string;
    revocable: boolean;
    attester: string;
    data: string;
};

export type AttestationResponse = {
    attestation: AttestationDto | null;
};

export class MedilinkEAS {
    key: string;
    constructor(key: string) {
        this.key = key;
    }

    public async genNullableAttestation(
        uid: string,
    ): Promise<AttestationResponse> {
        const attestation = await apiGetNullableAttestationById(uid);
        return attestation.data;
    }

    public async genUsersAttestation(
        address: string,
    ): Promise<Array<AttestationDto>> {
        const res = await apiGetAttestations(address);
        return res.data;
    }

    public async genCreateAttestation(
        attestation: Partial<AttestationDto>,
    ): Promise<AttestationResponse> {
        const res = await apiPostCreateAttestation(this.key, attestation);
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
            apiPostFaucetRequest(auth.wallet.address);
        }
    }, [auth]);

    return (
        <EasContext.Provider value={easService}>{children}</EasContext.Provider>
    );
}
