require('babel-polyfill');
const draftService = require('../services/DraftService');
const express = require('express');
const app = express();

export async function getAgreementDraftById(req, res) {
    const agreementDraft = await draftService.getAgreementDraftById(req.params.id);
    const agreementDraftPersons = await draftService.getPersonRoleDraftsByAgreementDraftId(req.params.id);
    res.status(200).json({ agreement: agreementDraft, persons: agreementDraftPersons });
}