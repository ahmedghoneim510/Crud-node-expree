const ApiError = require('../../utils/ApiError');
const City = require('./city.model');


class CityService {
    async create(data) {
        const existing = await City.findOne({ name: data.name });
        if (existing) {
            throw new ApiError(400, 'City already exists');
        }
        return City.create(data);
    }

    async getAll() {
        return City.find().sort({ name: 1 });
    }

    async getById(id) {
        const city = await City.findById(id);
        if (!city) {
            throw new ApiError(404, 'City not found');
        }
        return city;
    }

    async update(id, data) {
        const city = await City.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!city) {
            throw new ApiError(404, 'City not found');
        } 
        return city;
    }

    async delete(id) {
        const city = await City.findByIdAndDelete(id);
        if (!city) {
            throw new ApiError(404, 'City not found');
        }
        return city;
    }

    async getPaginated(filter, options) {
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
        const sortOption = { [sortBy]: order === 'asc' ? 1 : -1 };
        const skip = (page - 1) * limit;
        
        const [cities, total] = await Promise.all([
            City.find({ ...filter })
                .sort(sortOption)
                .skip(skip)
                .limit(limit),
            City.countDocuments({ ...filter }),
        ]);

        return { cities, total, page, limit };
    }
}

module.exports = new CityService();