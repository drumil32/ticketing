import bcrypt from 'bcryptjs';

export class Password{
    static async toHash(password : string): Promise<string>{
        const hashedPassowrd = await bcrypt.hash(password, 10);
        return hashedPassowrd;
    }
    static async compare(password : string,hashedPassowrd:string):Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hashedPassowrd);
        return isMatch;
    }
}