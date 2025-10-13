// src/app/api/admin/vehicles/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

interface Comment {
    _id: ObjectId;
    userId: ObjectId;
    username: string;
    text: string;
    createdAt: Date;
}

interface Vehicle {
    _id: ObjectId;
    comments: Comment[];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: 'Invalid vehicle ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("vehicle_store");
        const vehicles = db.collection<Vehicle>('vehicles');

        const vehicle = await vehicles.findOne(
            { _id: new ObjectId(id) },
            { projection: { comments: 1 } }
        );

        if (!vehicle) {
            return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, comments: vehicle.comments || [] });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { comment: text } = body;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: 'Invalid vehicle ID' }, { status: 400 });
        }

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ success: false, message: 'Comment text is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("vehicle_store");
        const vehicles = db.collection<Vehicle>('vehicles');

        const newComment: Comment = {
            _id: new ObjectId(),
            userId: new ObjectId(session.user.id),
            username: session.user.name || 'Admin',
            text,
            createdAt: new Date(),
        };

        const result = await vehicles.updateOne(
            { _id: new ObjectId(id) },
            { $push: { comments: newComment } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, message: 'Vehicle not found or comment not added' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Comment added successfully', comment: newComment });

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}