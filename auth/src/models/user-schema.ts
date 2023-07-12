import mongoose from "mongoose";
import { Password } from "../service/password";

// An interface that describe the properties that are required to create a new user
interface UserAttrs{
    email: string,
    password: string
}

// An interface that describe the properties that a User Model has
interface UserModel extends mongoose.Model<any>{
    build(attrs: UserAttrs):UserDoc
}

// An interface that describe the properties that a User document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
},{
    toJSON:{
        transform(doc,rat){
            delete rat.password;
            delete rat.__v;
            rat.id = rat._id;
            delete rat._id;
        }
    }
});

userSchema.pre('save',async function (done){
    if(this.isModified('password')){
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password',hashedPassword);
    }
    done();
})

userSchema.statics.build = (attrs:UserAttrs):UserDoc=>{
    return new User(attrs);
}

const User = mongoose.model<UserDoc,UserModel>("User", userSchema);
export { User };
