import type { Attestation } from '@ethereum-attestation-service/eas-sdk';
import { apiGetNullableAttestationById } from 'utils/api';

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
}
