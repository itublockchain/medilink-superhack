import Axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { AttestationDto, AttestationResponse } from 'utils/eas';

export const axios = Axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
});

export const apiGetNullableAttestationById = async (
    id: string,
): Promise<AxiosResponse<AttestationResponse>> => {
    return await axios.get(`/eas/${id}`);
};

export const apiGetAttestations = async (
    address: string,
): Promise<AxiosResponse<Array<AttestationDto>>> => {
    return await axios.get(`/eas`, {
        params: {
            address,
        },
    });
};

export const apiPostCreateAttestation = async (
    key: string,
    attestation: Partial<AttestationDto>,
): Promise<AxiosResponse<AttestationResponse>> => {
    return await axios.post(`/eas`, attestation, {
        headers: {
            Authorization: key,
        },
    });
};

export const apiGetTransactions = async (
    address: string,
): Promise<AxiosResponse<Array<AttestationDto>>> => {
    return await axios.get(`/transaction/${address}`);
};

export const apiPostFaucetRequest = async (
    address: string,
): Promise<AxiosResponse<{ status: string }>> => {
    return await axios.post('/faucet', { address });
};

export const queryKeys = {
    MEDICAL_CARDS: 'medical-cards',
};
