import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enginee",
      required: true,
      unique: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,       // سجّلي تاريخ الإنشاء وآخر تعديل تلقائيًا. 
  });

// تجيب المنج مش بس ترجعلي ال ID
wishlistSchema.pre("find", function () {
  this.populate("products");
});

// Automatically populate products when using findOne()
wishlistSchema.pre("findOne", function () {
  this.populate("products");
});

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export { WishlistModel };


