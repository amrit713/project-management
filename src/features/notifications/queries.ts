import { db } from "@/lib/db";

import { subMinutes, addMinutes } from "date-fns";

export const sendDueTaskReminders = async () => {
  const now = new Date();

  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const windowStart = subMinutes(oneDayFromNow, 5);
  const windowEnd = addMinutes(oneDayFromNow, 5);

  const tasks = await db.task.findMany({
    where: {
      dueDate: {
        gte: windowStart,
        lte: windowEnd,
      },
    },
    include: {
      assignee: true,
    },
  });
  for (const task of tasks) {
    const memberId = task.assignee.id;

    const existing = await db.notification.findFirst({
      where: {
        memberId,
        scheduleAt: task.dueDate,
      },
    });

    if (existing) {
      if (existing.taskId === task.id) {
        await db.notification.update({
          where: {
            id: existing.id,
          },
          data: {
            content: `🔔 Task "${task.name}" is due tomorrow!`,
            scheduleAt: task.dueDate,
          },
        });
      }
    } else {
      await db.notification.create({
        data: {
          content: `🔔 Task "${task.name}" is due tomorrow!`,
          workspaceId: task.workspaceId,
          memberId: task.assigneeId,
          taskId: task.id,
          read: false,
          scheduleAt: task.dueDate,
        },
      });
    }
  }
};
