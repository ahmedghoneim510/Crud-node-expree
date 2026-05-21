

const createCity = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('City name can only contain letters and spaces'),
];

const updateCity = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('City name can only contain letters and spaces'),
];

module.exports = {
    createCity,
    updateCity
};