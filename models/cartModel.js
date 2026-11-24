import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
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
            max: 100,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
                trim: true,
                enum: ["SAVE10", "SAVE20", "SAVE50", "SAVE80", "OFF50"],
            },
            discountType: {
                type: String,
                enum: ["percentage", "fixed"],
            },
            discountValue: {
                type: Number,
                min: 0,
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

cartSchema.virtual("subtotal").get(function () {
    const rawSubtotal = (this.items || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    return Number(rawSubtotal.toFixed(2));
});

cartSchema.virtual("discountAmount").get(function () {
    if (!this.coupon || !this.coupon.discountType) {
        return 0;
    }

    const value = this.coupon.discountValue || 0;
    let discount = 0;

    if (this.coupon.discountType === "percentage") {
        const clampedPercent = Math.min(Math.max(value, 0), 100);
        discount = (this.subtotal * clampedPercent) / 100;
    } else if (this.coupon.discountType === "fixed") {
        discount = Math.min(value, this.subtotal);
    }

    return Number(discount.toFixed(2));
});

cartSchema.virtual("total").get(function () {
    const netTotal = Math.max(0, this.subtotal - this.discountAmount);
    return Number(netTotal.toFixed(2));
});

cartSchema.virtual("itemCount").get(function () {
    return (this.items || []).reduce(
        (count, item) => count + item.quantity,
        0
    );
});

const cartModel = mongoose.model("Cart", cartSchema);

export { cartModel };
