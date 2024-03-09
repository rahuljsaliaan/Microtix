import { OrderStatus } from '@rjmicrotix/common';
import mongoose from 'mongoose';

interface OrderAttrs {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.pre('save', function (next) {
  this.$where = {
    version: this.get('version') - 1,
  };
  next();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({ _id: attrs.id, ...attrs });
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
