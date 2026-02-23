import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Supervisor from '../../../models/Supervisor';
import Expense from '../../../models/Expense';

export async function GET() {
    try {
        await dbConnect();
        // Aggregation pipeline to calculate balance dynamically
        const supervisors = await Supervisor.aggregate([
            {
                $lookup: {
                    from: 'expenses',
                    localField: '_id',
                    foreignField: 'supervisorId',
                    as: 'expenses',
                },
            },
            {
                $addFields: {
                    totalSpent: { $sum: '$expenses.amount' },
                },
            },
            {
                $addFields: {
                    balance: { $subtract: ['$allocation', '$totalSpent'] },
                    id: '$_id', // Map _id to id for frontend compatibility
                },
            },
            {
                $project: {
                    expenses: 0, // Don't send all expenses in the supervisor list
                    __v: 0,
                },
            },
        ]);

        return NextResponse.json(supervisors);
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const supervisor = await Supervisor.create(body);
        return NextResponse.json({ success: true, data: supervisor }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
