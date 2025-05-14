import { compare, hash } from 'bcrypt';

export const creatPasswordHashed = async(password: string): Promise<string> => {
    const saltOrRounds = 10;
    return await hash(password, saltOrRounds);
}

export const validatePassword = async (password: string, passwordHashed: string): Promise<boolean> =>{
    return compare(password, passwordHashed);
}