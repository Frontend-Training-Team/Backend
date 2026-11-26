import mongoose from "mongoose";
import slugify from "slugify";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId ,
            ref: "User" ,
            required: true
        } ,
        
        rating: {
            type: Number ,
            required: true ,
            min: 1 ,
            max: 5
        } ,

        comment: {
            type: String ,
            required: true ,
            trim: true
        } , 

    } ,

    {
        timestamps: true ,
    }
)

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String ,
            required: true ,
            trim: true ,
            maxlength: 200 ,
        } ,

        description: {
            type: String ,
            required: true ,
            trim: true ,
        } ,

        shortDescription: {
            type: String ,
            required: true ,
            trim: true ,
            maxlength: 500 ,
        } ,

        price: {
            type: Number ,
            required: true ,
            min: 0 ,
        } ,

        discountPrice: {
            type: Number ,
            min: 0 ,
        } ,

        stock: {
            type: Number ,
            required: true ,
            min: 0 ,
            default: 0 ,
        } ,

        sku: {
            type: String,
            unique: true,
            trim: true,
            sparse: true ,
        },

        brand: {
            type: String,
            trim: true,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        images: {
            type: [
                {
                    url: {
                        type: String,
                        required: true,
                        trim: true ,
                    },
                    public_id: {
                        type: String,
                        required: true,
                        trim: true ,
                    },
                },
            ],
            validate: {
                validator: function (images) {
                    return Array.isArray(images) && images.length >= 1 && images.length <= 5;
                },
                message: "Product must have between 1 and 5 images",
            },
            required: true,
        },
        
        category: {
            type: String ,
            required: true,
            lowercase: true ,
        },

        subcategory: {
            type: String ,
        },
        
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        numReviews: {
            type: Number,
            default: 0,
        },
        
        averageRating: {
            type: Number,
            default: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reviews: {
            type: [reviewSchema],
            default: [],
        },
    },

    {
        timestamps: true,
    }
)

productSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
        });
    }
})

productSchema.methods.calcAverageRating = function () {
    this.numReviews = this.reviews.length;

    if (this.numReviews === 0) {
        this.averageRating = 0;
        return;
    }

    const totalRating = this.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    this.averageRating = Number(
        (totalRating / this.numReviews).toFixed(1)
    );
};

productSchema.index({
    name: "text",
    description: "text",
    brand: "text",
});

productSchema.index({
    category: 1,
    price: 1,
    createdAt: -1,
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;