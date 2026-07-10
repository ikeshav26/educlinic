import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import {
  EventType,
  EventVisibility,
  UserRole,
  type UserRole as UserRoleEnum,
} from '../../generated/prisma/enums.js';

const validEventTypes = new Set<string>(Object.values(EventType));
const validEventVisibilities = new Set<string>(Object.values(EventVisibility));
const roleRank: Record<UserRoleEnum, number> = {
  [UserRole.USER]: 0,
  [UserRole.ALUMNI]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPER_ADMIN]: 3,
};

const parseDate = (value: unknown) => {
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date;
};

const canManageEvent = (
  actor: { id: number; role: UserRoleEnum },
  owner: { id: number; role: UserRoleEnum },
) => actor.id === owner.id || roleRank[actor.role] > roleRank[owner.role];

export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      console.log(req.user)
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      name,
      description,
      organizedBy,
      place,
      eventType,
      visibility,
      startDate,
      endDate,
    } = req.body;

    if (!name || !organizedBy || !place || !eventType || !visibility || !startDate || !endDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (!validEventTypes.has(eventType)) {
      return res.status(400).json({ message: 'Invalid event type' });
    }

    if (!validEventVisibilities.has(visibility)) {
      return res.status(400).json({ message: 'Invalid event visibility' });
    }

    const parsedStartDate = parseDate(startDate);
    const parsedEndDate = parseDate(endDate);

    if (!parsedStartDate || !parsedEndDate) {
      return res.status(400).json({ message: 'Invalid startDate or endDate' });
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: 'endDate must be after startDate' });
    }

    const event = await prisma.event.create({
      data: {
        name,
        description: description ?? null,
        organizedBy,
        place,
        eventType,
        visibility,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        createdById: req.user.id,
      },
    });

    return res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json({ event });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });

    return res.json({ events });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!canManageEvent(req.user, existingEvent.createdBy)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const {
      name,
      description,
      organizedBy,
      place,
      eventType,
      visibility,
      startDate,
      endDate,
    } = req.body;

    const parsedStartDate = startDate !== undefined ? parseDate(startDate) : undefined;
    const parsedEndDate = endDate !== undefined ? parseDate(endDate) : undefined;

    if (startDate !== undefined && !parsedStartDate) {
      return res.status(400).json({ message: 'Invalid startDate' });
    }

    if (endDate !== undefined && !parsedEndDate) {
      return res.status(400).json({ message: 'Invalid endDate' });
    }

    if (eventType !== undefined && !validEventTypes.has(eventType)) {
      return res.status(400).json({ message: 'Invalid event type' });
    }

    if (visibility !== undefined && !validEventVisibilities.has(visibility)) {
      return res.status(400).json({ message: 'Invalid event visibility' });
    }

    const nextStartDate = parsedStartDate ?? existingEvent.startDate;
    const nextEndDate = parsedEndDate ?? existingEvent.endDate;

    if (nextEndDate <= nextStartDate) {
      return res.status(400).json({ message: 'endDate must be after startDate' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(organizedBy !== undefined ? { organizedBy } : {}),
        ...(place !== undefined ? { place } : {}),
        ...(eventType !== undefined ? { eventType } : {}),
        ...(visibility !== undefined ? { visibility } : {}),
        ...(parsedStartDate ? { startDate: parsedStartDate } : {}),
        ...(parsedEndDate ? { endDate: parsedEndDate } : {}),
      },
    });

    return res.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid event id' });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!canManageEvent(req.user, existingEvent.createdBy)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.event.delete({
      where: { id },
    });

    return res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
