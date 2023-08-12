import type { Attestation } from '@ethereum-attestation-service/eas-sdk';
import Axios from 'axios';
import type { AxiosResponse } from 'axios';

export const axios = Axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
});

export const apiGetNullableAttestationById = async (
    id: string,
): Promise<AxiosResponse<Attestation | null>> => {
    return await axios.get(`/eas/${id}`);
};
