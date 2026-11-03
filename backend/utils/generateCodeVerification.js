import crypto from 'crypto';

export const generateAlphanumericCode = (length = 6) => {
   
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let code = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes[i] % characters.length;
        code += characters[randomIndex];
    }

    return code;
};