import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    studyDates: [{ type: Date }],
    address: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    academicDetails: {
      college: { type: String, default: '' },
      major: { type: String, default: '' },
      graduationYear: { type: String, default: '' },
      gpa: { type: String, default: '' }
    },
    theme: { type: String, default: 'light' },
    notificationPreferences: {
      quizReminders: { type: Boolean, default: true },
      upcomingExams: { type: Boolean, default: true },
      studyStreakAlerts: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
