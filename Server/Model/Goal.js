import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    category: {
      type: String,
      default: "General",
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "failed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);
