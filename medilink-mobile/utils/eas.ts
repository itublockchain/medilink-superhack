import type { Attestation } from '@ethereum-attestation-service/eas-sdk';

export class MedilinkEAS {
    key: string;
    constructor(key: string) {
        this.key = key;
    }

    public async genNullableAttestation(
        uid: string,
    ): Promise<Attestation | null> {
        return null;
    }
}
