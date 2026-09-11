import * as eventService from './event.service.js';

export const listEvent = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const addEvent = async (req, res, next) => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    return res.status(201).json(newEvent);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};