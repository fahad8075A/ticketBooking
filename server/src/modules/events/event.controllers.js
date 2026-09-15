import { Event } from './event.model.js';

// Get all events
export const listEvent = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single event
export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create an event
export const addEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    return res.status(201).json(newEvent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Event.findByIdAndUpdate(id, req.body, { 
      new: true,
      runValidators: true 
    });

    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};