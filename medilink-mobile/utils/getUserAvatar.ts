import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-human-sprites';

export const getUserAvatar = (address: string, size = 128): string => {
    return createAvatar(style, {
        seed: address,
        size: size,
    });
};
