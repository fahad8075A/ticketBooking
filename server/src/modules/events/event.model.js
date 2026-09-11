import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        totalSeats: { type: Number, required: true, min: 1 },
        availableSeats: { 
            type: Number, 
            required: true,
            min: [0, 'Available seats cannot be negative'],
            default: function() {
                return this.totalSeats;
            }
        },
        pricePerSeat: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);