const mongoose = require('mongoose')

const companySchema = mongoose.Schema({
    email: {
        type: String,
        unique: [true, ' email is unique'],
        required: [true, ' email is required'],
    },
    password: {
        type: String,
        required: [true, 'password required'],
    },
    accountEntity: String,
    accountCountryCode: String,
    accountNumber: Number,
    accountPin: Number,
    codAccountEntity: String,
    codaccountCountryCode: String,
    internationalMethods: {
        type: String,
        enum: ['CDS', 'ONP'],
        default: "CDS"
    },
    domesticMethods: {
        type: String,
        enum: ['EPX', 'PPX', 'PDX '],
        default: "PPX"
    },
    domesticAdditional: {
        type: String,
        enum: ['RTRN', 'FRDM', 'CODS ', 'CRDT'],
        default: "FRDM"
    },
    internationalAdditional: {
        type: String,
        enum: ['RTRN', 'FRDM', 'CODS '],
        default: "FRDM"
    },
    paymentType: {
        type: String,
        enum: ['P', 'C', '3'],
        default: "P"
    },
    productGroup: {
        type: String,
        enum: ['DOM', 'EXP'],
        default: "DOM"
    },

}, { timestamps: true })



module.exports = mongoose.model('company', companySchema)