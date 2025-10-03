import mongoose from 'mongoose';
export function connectDb() {
    try {
        mongoose.connect('mongodb+srv://NanoRules:ZTFj54G78jusruu@cluster0.uk9amxm.mongodb.net/FreshCartApp');
        console.log('connection is successful!');
    }
    catch (err) {
        console.log(err);
    }
}


