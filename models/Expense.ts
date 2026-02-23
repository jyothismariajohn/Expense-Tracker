import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IExpense extends Document {
    date: string;
    amount: number;
    category: string;
    supervisorId: mongoose.Schema.Types.ObjectId;
    description: string;
}

const ExpenseSchema: Schema = new Schema({
    date: {
        type: String,
        required: [true, 'Please provide a date'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supervisor',
        required: [true, 'Please provide a supervisor ID'],
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

export default models.Expense || model<IExpense>('Expense', ExpenseSchema);
