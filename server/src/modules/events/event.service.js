import { Event } from './event.model.js';

export const getAllEvents = async () => {
  return await Event.find();
};

export const getEventById = async (id) => {
  const event = await Event.findById(id);
  if (!event) throw new Error('Event not found');
  return event; 
};

export const createEvent = async (eventData) => {
  return await Event.create(eventData);
};