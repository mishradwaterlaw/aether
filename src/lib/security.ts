import CryptoJS from 'crypto-js';

const SALT = "GradeVault-Salt-v1"; // Simple salt

export const encryptData = (data: any, pin: string): string => {
    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, pin + SALT).toString();
};

export const decryptData = (ciphertext: string, pin: string): any | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, pin + SALT);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedData) return null;
        return JSON.parse(decryptedData);
    } catch (e) {
        return null;
    }
};

export const hashPin = (pin: string): string => {
    return CryptoJS.SHA256(pin + SALT).toString();
}
