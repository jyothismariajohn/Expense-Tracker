import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Supervisor from '../../../../models/Supervisor';
import Expense from '../../../../models/Expense';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const supervisor = await Supervisor.findById(params.id);

        if (!supervisor) {
            return NextResponse.json({ success: false, error: 'Supervisor not found' }, { status: 404 });
        }

        // Calculate total spent
        const expenses = await Expense.find({ supervisorId: supervisor._id });
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const supervisorData = {
            ...supervisor.toObject(),
            id: supervisor._id,
            totalSpent,
            balance: supervisor.allocation - totalSpent,
        };

        return NextResponse.json(supervisorData);
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const body = await request.json();

        const supervisor = await Supervisor.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!supervisor) {
            return NextResponse.json({ success: false, error: 'Supervisor not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: supervisor });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const deletedSupervisor = await Supervisor.deleteOne({ _id: params.id });

        if (!deletedSupervisor) {
            return NextResponse.json({ success: false, error: 'Supervisor not found' }, { status: 404 });
        }

        // Optionally delete associated expenses or handle as needed
        await Expense.deleteMany({ supervisorId: params.id });

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
