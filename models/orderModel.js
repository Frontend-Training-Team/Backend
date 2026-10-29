const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "An order must contain at least one item.",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "stripe", "paypal", "paymob"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    returnedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate order prices before saving.
orderSchema.pre("validate", function () {
  if (Array.isArray(this.items) && this.items.length > 0) {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  if (this.subtotal != null && this.subtotal >= 0) {
    this.shippingFee = this.subtotal >= 1000 ? 0 : 50;
    this.tax = Number((this.subtotal * 0.14).toFixed(2));

    this.totalPrice = Number(
      (
        this.subtotal +
        this.shippingFee +
        this.tax -
        (this.discount || 0)
      ).toFixed(2)
    );
  }
});

// Update payment-related fields when payment status changes.
orderSchema.pre("save", function () {
  if (this.isModified("paymentStatus") && this.paymentStatus === "paid") {
    if (!this.paidAt) {
      this.paidAt = new Date();
    }
  }
});

const Order = mongoose.model("Order", orderSchema);

export { Order };