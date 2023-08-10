import { QueryClient } from 'react-query';

export const pulseLinkQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 0,
            refetchOnWindowFocus: false,
        },
    },
});
