const express = require('express');
const router = express.Router();
const auditfileController = require("../controllers/auditfile-controller");
const uploadFile = require('../middlewares/upload');

/*Upload do ficheiro XML*/
router.post('/upload', uploadFile, auditfileController.uploadFile);

/*Obter o AuditFile dando o seu ano fiscal*/
router.get('/getAuditFileByYear/:year', auditfileController.getAuditFile);

/** */
router.get('/getYearsOfAuditFiles', auditfileController.getYearsOfAuditFiles);

/*Retornar informacao da empresa dado ano fiscal*/
router.get('/:year/getCompanyInfo', auditfileController.getCompanyInfo);

/*Retornar todos os clientes*/
router.get('/:year/getAllCustomers', auditfileController.getAllCustomers);

/*Obter a informação de um cliente, dado o ano fiscal e o ID do cliente*/
router.post('/:year/getCustomerById', auditfileController.getCustomerById)

/*Retornar todos os fornecedores*/
router.get('/:year/getAllSuppliers', auditfileController.getAllSuppliers);

/*Obter a informação de um fornecedor, dado o ano fiscal e o ID do fornecedor*/
router.post('/:year/getSupplierById', auditfileController.getSupplierById);

/*Retornar todos os produtos*/
router.get('/:year/getAllProducts', auditfileController.getAllProducts);

/*Obter a informação de um produto, dado o ano fiscal e o Code do produto*/
router.post('/:year/getProductByCode', auditfileController.getProductByCode);

/*Retornar todos os jornais*/
router.get('/:year/getAllJournals', auditfileController.getAllJournals);

/*Obter a informação de um jornal, dado o ano fiscal e o ID do jornal*/
router.post('/:year/getJournalById', auditfileController.getJournalById);

/*Retornar todas as transações*/
router.get('/:year/getAllTransactions', auditfileController.getAllTransactions);

/*Obter toda a informação de uma transação, dado o ano fiscal e o ID dela*/
router.post('/:year/getTransactionById', auditfileController.getTransactionById);

/*Obter informação das invoices*/
router.get('/:year/getAllInvoices', auditfileController.getAllInvoices);

/*Obter toda a informação de uma invoice, dado o ano fiscal e o No dela*/
router.post('/:year/getInvoiceByNo', auditfileController.getInvoiceByNo);

/*Obter o número total de vendas por período, dando o ano fiscal*/
router.get('/:year/getSalesByPeriod', auditfileController.getSalesByPeriod);

/*Obter o número de clientes por cidade*/
router.get('/:year/getNumberOfCustomersByCity', auditfileController.getNumberOfCustomersByCity);

/*Obter o número de fornecedores por cidade*/
router.get('/:year/getNumberOfSuppliersByCity', auditfileController.getNumberOfSuppliersByCity);

/*Obter o número de vendas por cliente*/
router.get('/:year/getSalesByCustomer', auditfileController.getSalesByCustomer);

/*Obter o número de vendas por produto*/
router.get('/:year/getSalesByProduct', auditfileController.getSalesByProduct);

/*Obter o número de vendas por grupo dos produtos*/
router.get('/:year/getSalesByProductGroup', auditfileController.getSalesByProductGroup);

/*Obtêm os totais de um auditfile*/
router.get('/:year/getAuditFileTotals', auditfileController.getAuditFileTotals);

/*Retornar total compras por fornecedor e valor medio por compra*/
router.get('/:year/getBoughtsBySupplier', auditfileController.getBoughtsBySupplier);

module.exports = router;