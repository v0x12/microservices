import mongoose from "mongoose";
import { Order, OrderStatus } from "./Order";
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
import { TicketCreatedEvent } from "@v0x-shared/common";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  orderId: string;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(data: {id: string, version: number}): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title, 
    price: attrs.price
  });
};

ticketSchema.statics.findByEvent = async (data: {id: string, version: number}): Promise<TicketDoc | null> => {
  const {id, version} = data
  return await Ticket.findOne({_id: id, version: version - 1})
}

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created ||
          OrderStatus.Complete ||
          OrderStatus.AwaitingPayment,
      ],
    },
  });
  return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);
