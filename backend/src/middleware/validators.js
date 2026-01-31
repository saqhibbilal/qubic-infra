const Joi = require('joi');

const registerSchema = Joi.object({
  jurisdiction: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(10).max(500).required(),
  owner: Joi.string().pattern(/^0x[a-zA-Z0-9]{10,}$/).required(), // Validación relajada para demo
  type: Joi.string().valid('Real Estate', 'Art & Collectibles', 'Vehicle', 'Commodity', 'Other').optional(),
  value: Joi.number().min(0).optional(),
  // Documents and Photos are handled by Multer (req.files), so they might not be in req.body
  documents: Joi.any().optional(),
  photos: Joi.any().optional(),
  isCorporate: Joi.boolean().optional(),
  corporateName: Joi.string().optional().allow(''),
  corporateId: Joi.string().optional().allow(''),
  legalRep: Joi.string().optional().allow('')
});

exports.validateAssetRegistration = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 400,
        message: error.details[0].message
      }
    });
  }

  next();
};
