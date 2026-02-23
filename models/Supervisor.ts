import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISupervisor extends Document {
    name: string;
    allocation: number;
}

const SupervisorSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the supervisor'],
        unique: true,
    },
    allocation: {
        type: Number,
        required: [true, 'Please provide an allocation amount'],
        default: 0,
    },
}, {
    timestamps: true,
});

export default models.Supervisor || model<ISupervisor>('Supervisor', SupervisorSchema);
