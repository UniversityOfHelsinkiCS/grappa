require('babel-polyfill');
const attachmentService = require('../services/AttachmentService');
const express = require('express');
const app = express();

export async function saveAttachment(req, res) {
    const attachmentData = req.body;
    const response = await attachmentService.saveAttachment(attachmentData);
    res.status(200).json({ text: "attachment save successful", response: response });
}