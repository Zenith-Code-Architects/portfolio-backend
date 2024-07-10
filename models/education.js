import { model, Schema, Types } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';

const educationSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    schoolName: { type: String },
    location: { type: String },
    program: { type: String },
    qualification: { type: String },
    grade: { type: String },
    startDate: { type: String },
    endDate: { type: String }
}, {
    timestamps: true
})

educationSchema.plugin(toJSON)

export const EducationModel = model('Education', educationSchema)
