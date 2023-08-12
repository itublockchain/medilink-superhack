import { QueryClient } from 'react-query';

export const mediLinkQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 0,
            refetchOnWindowFocus: false,
        },
    },
});
