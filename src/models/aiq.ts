import mongoose, { Document, Schema } from 'mongoose';

// Define connection URI
const MONGODB_URI = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err: any) => console.error('MongoDB connection error:', err));


// Define State schema
export interface StateModel extends Document {
    state_abr: string;
    state_net_revenue_generation: number;
}

const stateSchema = new Schema<StateModel>({
    state_abr: { type: String, required: true },
    state_net_revenue_generation: { type: Number, required: true },
});

export const StateModel = mongoose.model<StateModel>('State', stateSchema);

// Define Plants schema
export interface PlantsModel extends Document {
    plant_name: string;
    state_abr: string;
    plant_net_revenue_generation: number;
}

const plantsSchema = new Schema<PlantsModel>({
    plant_name: { type: String, required: true },
    state_abr: { type: String, required: true },
    plant_net_revenue_generation: { type: Number, required: true },
});

export const PlantsModel = mongoose.model<PlantsModel>('Plants', plantsSchema);