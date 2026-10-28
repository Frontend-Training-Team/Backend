import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        price: {
            type: Number,
        },
        quantity: {
            type: Number,
        },
    },
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        items: {
            type: [cartItemSchema],
            default: [],
        },
        coupon: {
            code: {
                type: String,
                uppercase: true,
            },
            discountType: {
                type: String,
                enum: ["percentage", "fixed"],
            },
            discountValue: {
                type: Number,
            },
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

cartSchema.virtual("subtotal").get(function () {
    return this.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
});

cartSchema.virtual("discountAmount").get(function () {
    if (!this.coupon || !this.coupon.discountType) {
        return 0;
    }

    if (this.coupon.discountType === "percentage") {
        return this.subtotal * (this.coupon.discountValue || 0) / 100;
    }

    if (this.coupon.discountType === "fixed") {
        return Math.min(this.coupon.discountValue || 0, this.subtotal);
    }

    return 0;
});

cartSchema.virtual("total").get(function () {
    return this.subtotal - this.discountAmount;
});

cartSchema.virtual("itemCount").get(function () {
    return this.items.reduce(
        (count, item) => count + item.quantity,
        0
    );
});

const CartModel = mongoose.model("Cart", cartSchema);

export { CartModel };