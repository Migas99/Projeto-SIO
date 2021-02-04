const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const AuditFileSchema = new Schema({
    Header: { type: Object },
    MasterFiles: { type: Object },
    GeneralLedgerEntries: { type: Object },
    SourceDocuments: { type: Object }
});

module.exports = mongoose.model("AuditFile", AuditFileSchema);