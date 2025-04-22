import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('MongoDB is already connected')
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState
        console.log('MongoDB connected:', connection.isConnected)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw new Error('Failed to connect to MongoDB')

        process.exit(1)
    }
}

export default dbConnect;