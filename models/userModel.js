import mongoose from "mongoose";
import bcryptjs from "bcryptjs"

const addressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    building: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    defaultAddress: {
      type: Boolean,
      default: false,
    },

  },
  {
    _id:false,
  }
);
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        select: false,
    },
    phone: {
        type: String,
        trim:true,
        default: "",
    },
    avatar: {
type:String,
default:"https://cdn-icons-png.flaticon.com/512/149/149071.png",

    },
    role: {
        type: String,
        enum: ["admin","customer"],
        default: 'customer',
    },
    addresses: [addressSchema]
    ,
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        }
    ],
    isVerified:{
        type: Boolean,
        default: false,
    },

    tokens: [{
        type: String,
        required: true,
    }]
},
{
        timestamps: true,
    }
)
userSchema.pre("save",async function (){
const user = this
if ( !user. isModified('password')){
    return
}
user.password = await bcryptjs.hash(user.password, 8)
})

userSchema.methods.comparePassword = async function (enteredpass){
    return await bcryptjs.compare(enteredpass, this.password)
}



let UserModel = mongoose.model('Enginee', userSchema)

export { UserModel }