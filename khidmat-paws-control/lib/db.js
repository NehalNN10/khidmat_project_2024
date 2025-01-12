import mongoose from 'mongoose';

global.mongoose = {
    conn: null, // storing connection here
    promise: null,
};

export async function dbConnect() {
    if (global.mongoose && global.mongoose.conn) {
        console.log('Using existing connection');
        return global.mongoose.conn;
    } else {
        const conString = process.env.MONGODB_URI;

        const promise = mongoose.connect(conString, {
            autoIndex: true,
        });

        global.mongoose = {
            conn: await promise,
            promise,
        }
        console.log('Connected to MongoDB');

        return await promise;
    }
}

// With great help from https://youtu.be/FQeKzno-8mU