import { db } from "@/lib/db";
import { authMiddleware } from "@/lib/hono-middleware";
import { zValidator } from "@hono/zod-validator";
import { PlanTier, SubscriptionStatus } from "@prisma/client";
import { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { addMonths } from "date-fns";

type Variables = {
  user: User;
  session: Session;
};

// type SuccessResponse = {
//   pidx: string;
//   total_amount: string;
//   status: string;
//   transaction_id: string;
//   fee: number;
//   refunded: false;
// };

const app = new Hono<{ Variables: Variables }>()
  .post(
    "/khalti/initiate",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        amount: z.number(),
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      let { amount, workspaceId } = c.req.valid("json");
      amount = amount * 100;

      const response = await fetch(process.env.KHALTI_INITIATE_URL!, {
        method: "POST",

        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `${process.env
            .NEXT_PUBLIC_APP_URL!}/workspaces/${workspaceId}/payment/khalti/callback`,
          website_url: process.env.NEXT_PUBLIC_APP_URL!,
          amount,
          purchase_order_id: `${user.id}-${Date.now()}`,
          purchase_order_name: "PluseBoard Subscription",
          customer_info: {
            name: user.name,
            email: user.email,
          },
          amount_breakdown: [{ label: "Subscription", amount }],
          product_details: [
            {
              identity: user.id,
              name: "pluseBoard ",
              total_price: amount,
              quantity: 1,
              unit_price: amount,
            },
          ],
          merchant_username: "pluse board",
          merchant_extra: "Nepal Plan",
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new HTTPException(response.status as ContentfulStatusCode, {
          message: data.detail,
        });
      }
      return c.json({
        payment_url: data.payment_url,
      });
    }
  )
  .post(
    "khalti/verify",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        pidx: z.string(),

        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const { pidx, workspaceId } = c.req.valid("json");

      console.log("🚀 ~ pidx:", pidx);
      const response = await fetch(process.env.KHALTI_LOOKUP_URL!, {
        method: "POST",
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HTTPException(response.status as ContentfulStatusCode, {
          message: data.detail,
        });
      }

      const subscription = await db.subscription.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!subscription) {
        await db.subscription.create({
          data: {
            plan: PlanTier.PRO,
            status: SubscriptionStatus.ACTIVE,
            khaltiIdx: pidx,
            amountPaid: data.total_amount,
            workspaceId,
            userId: user.id,
            expiresAt: addMonths(new Date(), 1),
          },
        });
      }

      return c.json({
        data,
      });
    }
  )
  .get("/individual", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!subscription) {
      throw new HTTPException(401, { message: "your are not subscribe yet !" });
    }

    return c.json({
      data: subscription,
    });
  });

export default app;
