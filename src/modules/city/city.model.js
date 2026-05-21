const mongoose = require('mongoose');
const slugify = require('slugify');


const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'City name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'City name cannot exceed 100 characters'],
        },
        slug:{
            type: String,
            unique: true,
            lowercase: true,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


citySchema.index({ name: "text" });
citySchema.index({ slug: 1 });


citySchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true, strict: true });
});

citySchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = slugify(update.name, { lower: true, strict: true });
    }
});
module.exports = mongoose.model('City', citySchema);