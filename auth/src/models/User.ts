import mongoose, { Document, Model } from "mongoose";
import Password from "../services/Password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

userSchema.pre("save", async function (done) {
  // When password provided on updating for example or creating in that case
  // will update and hash the password the mongoose
  if (this.isModified("password")) {
    const hashedPassword = await Password.hashPassword(this.password);
    this.set("password", hashedPassword);
  }
  done();
});

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
