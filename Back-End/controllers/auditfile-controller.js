const mongoose = require('mongoose');
const fs = require('fs');
const xml2js = require('xml2js');
const validator = require('xsd-schema-validator');
const moment = require('moment');
const AuditFile = require('../models/auditfile');

const parser = new xml2js.Parser({
  explicitArray: false,
  ignoreAttrs: false,
  mergeAttrs: true,
});
const auditfileController = {};
const notfound = { Message: 'Not found.' };

/**
 * Método responsável por realizar o parse do ficheiro XML e guardá-lo na base de dados
 */
auditfileController.uploadFile = async (req, res) => {
  try {
    if (req.file) {
      const xmlFile = req.file.path;
      const xsdFile = 'files/xsd/specs.xsd';

      fs.readFile(xmlFile, 'binary', function (err, data) {
        fs.unlink(xmlFile, function (err) {
          if (err) throw err;
        });

        if (err) {
          throw err;
        }

        validator.validateXML(data, xsdFile, function (err, result) {
          if (err) return res.status(400).json({ Error: 'Invalid XML file.' });

          if (result.valid) {
            parser.parseString(data, function (err, jsonData) {
              if (err) throw err;

              const formatedJson = formatJson(jsonData);

              AuditFile.findOne(
                {
                  'Header.FiscalYear': formatedJson.AuditFile.Header.FiscalYear,
                },
                { _id: 0 },
                function (err, other) {
                  if (err) throw err;

                  if (other) {
                    return res.status(400).json({
                      Error:
                        'The auditfile related to that fiscal year has already been uploaded!',
                    });
                  }

                  const auditfile = new AuditFile({
                    Header: formatedJson.AuditFile.Header,
                    MasterFiles: formatedJson.AuditFile.MasterFiles,
                    GeneralLedgerEntries:
                      formatedJson.AuditFile.GeneralLedgerEntries,
                    SourceDocuments: formatedJson.AuditFile.SourceDocuments,
                  });

                  auditfile.save(function (err) {
                    if (err) throw err;
                    return res.status(200).json({
                      Success: 'The SAFT file was uploaded with success.',
                    });
                  });
                }
              );
            });
          } else {
            return res.status(400).json({
              Error: 'Invalid XML file. It wasnt validated by the XSD.',
            });
          }
        });
      });
    } else {
      res.status(400).json({ Error: 'No file was sent.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

/**
 * Método de auxília à função uploadFile
 */
const formatJson = function (json) {
  /*Caso o Json seja um array*/
  if (Array.isArray(json)) {
    /*Iteramos sobre os elementos do array*/
    for (let i = 0; i < json.length; i++) {
      let object = json[i];

      /*Iteramos sobre as propriedades do objecto*/
      for (let property in object) {
        if (!property.includes('ID') && !property.includes('Code')) {
          /*Se a propriedade for um objecto, fazemos recursão*/
          if (typeof object[property] === 'object') {
            object[property] = formatJson(object[property]);
          } else {
            /*Se a propriedade for um número descrito como string, convertemos*/
            if (
              object.hasOwnProperty(property) &&
              object[property] !== null &&
              !isNaN(object[property])
            ) {
              object[property] = +object[property];
            } else {
              /*Se a propriedade for uma data descrita como string, convertemos*/
              if (
                moment(
                  object[property],
                  ['DD-MM-YYYY', 'YYYY-MM-DD'],
                  true
                ).isValid()
              ) {
                object[property] = new Date(object[property]);
              }
            }
          }
        }
      }
    }
  } else {
    /*Caso o Json seja um objecto*/
    let object = json;

    /*Iteramos sobre as propriedades*/
    for (let property in object) {
      if (!property.includes('ID') && !property.includes('Code')) {
        /*Se a propriedade for um objecto, fazemos recursão*/
        if (typeof object[property] === 'object') {
          object[property] = formatJson(object[property]);
        } else {
          /*Se a propriedade for um número descrito como string, convertemos*/
          if (
            object.hasOwnProperty(property) &&
            object[property] !== null &&
            !isNaN(object[property])
          ) {
            object[property] = +object[property];
          } else {
            /*Se a propriedade for uma data descrita como string, convertemos*/
            if (
              moment(
                object[property],
                ['DD-MM-YYYY', 'YYYY-MM-DD'],
                true
              ).isValid()
            ) {
              object[property] = new Date(object[property]);
            }
          }
        }
      }
    }
  }

  return json;
};

/**
 * Método que retorna os anos dos ficheiros armazenados dentro da BD
 */
auditfileController.getYearsOfAuditFiles = async (req, res) => {
  try {
    const auditfiles = await AuditFile.find();
    const AuditFilesAnswer = [];

    if (auditfiles) {
      for (data in auditfiles) {
        if (auditfiles[data].Header.FiscalYear) {
          AuditFilesAnswer.push(auditfiles[data].Header.FiscalYear);
        }
      }

      return res.status(200).json(AuditFilesAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável pela obtenção do ficheiro AuditFile, dado o seu ano fiscal
 */
auditfileController.getAuditFile = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne(
      { 'Header.FiscalYear': parseInt(req.params.year) },
      { _id: 0 }
    );

    if (auditfile) {
      return res.status(200).json(auditfile);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter a informação relativa à empresa, dado o seu ano fiscal
 */
auditfileController.getCompanyInfo = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne(
      { 'Header.FiscalYear': parseInt(req.params.year) },
      { _id: 0 }
    );

    if (auditfile) {
      const companyInfo = {
        CompanyID: auditfile.Header.CompanyID,
        TaxRegistrationNumber: auditfile.Header.TaxRegistrationNumber,
        CompanyName: auditfile.Header.CompanyName,
        BusinessName: auditfile.Header.BusinessName,
        CompanyAddress: auditfile.Header.CompanyAddress,
      };

      return res.status(200).json(companyInfo);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter todos os clientes dum AuditFile, dado o seu ano fiscal
 */
auditfileController.getAllCustomers = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      let CustomersAnswer = [];
      const listOfCustomers = auditfile.MasterFiles.Customer;

      if (Array.isArray(listOfCustomers)) {
        CustomersAnswer = listOfCustomers;
      } else {
        CustomersAnswer.push(listOfCustomers);
      }

      return res.status(200).json(CustomersAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por retornar um cliente, dado o seu Id
 */
auditfileController.getCustomerById = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const customers = auditfile.MasterFiles.Customer;

      if (Array.isArray(customers)) {
        for (data in customers) {
          if (customers[data].CustomerID == req.body.id) {
            return res.status(200).json(customers[data]);
          }
        }
      } else {
        if (customers.CustomerID == req.body.id) {
          return res.status(200).json(customers);
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter todos os fornecedores dum AuditFile, dado o seu ano fiscal
 */
auditfileController.getAllSuppliers = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      let SuppliersAnswer = [];
      const listOfAccounts =
        auditfile.MasterFiles.GeneralLedgerAccounts.Account;

      if (Array.isArray(listOfAccounts)) {
        for (data in listOfAccounts) {
          if (listOfAccounts[data].GroupingCode == '2211') {
            const account = {
              SupplierName: listOfAccounts[data].AccountDescription,
              AccountID: listOfAccounts[data].AccountID,
            };
            SuppliersAnswer.push(account);
          }
        }
      } else {
        SuppliersAnswer.push({
          SupplierName: listOfAccounts[data].AccountDescription,
          AccountID: listOfAccounts[data].AccountID,
        });
      }

      return res.status(200).json(SuppliersAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};
/**
 * Método responsável por retornar um fornecedor, dando o seu Id
 */
auditfileController.getSupplierById = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const suppliers = auditfile.MasterFiles.Supplier;

      if (Array.isArray(suppliers)) {
        for (data in suppliers) {
          if (suppliers[data].SupplierID == req.body.id) {
            return res.status(200).json(suppliers[data]);
          }
        }
      } else {
        if (suppliers.SupplierID == req.body.id) {
          return res.status(200).json(suppliers);
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter todos os produtos dum AuditFile, dado o seu ano fiscal
 */
auditfileController.getAllProducts = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      let ProductsAnswer = [];
      const listOfProducts = auditfile.MasterFiles.Product;

      if (Array.isArray(listOfProducts)) {
        ProductsAnswer = listOfProducts;
      } else {
        ProductsAnswer.push(listOfProducts);
      }

      return res.status(200).json(ProductsAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por retornar um produto dando o seu code
 */
auditfileController.getProductByCode = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const products = auditfile.MasterFiles.Product;

      if (Array.isArray(products)) {
        for (data in products) {
          if (products[data].ProductCode == req.body.id) {
            return res.status(200).json(products[data]);
          }
        }
      } else {
        if (products.ProductCode == req.body.id) {
          return res.status(200).json(products);
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por retornar todos os jornais
 */
auditfileController.getAllJournals = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      let JournalsAnswer = [];
      const listOfJournals = auditfile.GeneralLedgerEntries.Journal;

      if (Array.isArray(listOfJournals)) {
        JournalsAnswer = listOfJournals;
      } else {
        JournalsAnswer.push(listOfJournals);
      }

      return res.status(200).json(JournalsAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por retornar um jornal, dando o seu Id
 */
auditfileController.getJournalById = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const journals = auditfile.GeneralLedgerEntries.Journal;

      if (Array.isArray(journals)) {
        for (data in journals) {
          if (journals[data].JournalID == req.body.id) {
            return res.status(200).json(journals[data]);
          }
        }
      } else {
        if (journals.JournalID == req.body.id) {
          return res.status(200).json(journals);
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter todas as transações
 */
auditfileController.getAllTransactions = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const listOfJournals = auditfile.GeneralLedgerEntries.Journal;

      if (Array.isArray(listOfJournals)) {
        for (data in listOfJournals) {
          if (listOfJournals[data].Transaction) {
            const TransactionsAnswer = [];
            const listOfTransactions = listOfJournals[data].Transaction;

            if (Array.isArray(listOfTransactions)) {
              for (extradata in listOfTransactions) {
                TransactionsAnswer.push(listOfTransactions[extradata]);
              }
            } else {
              TransactionsAnswer.push(listOfTransactions);
            }

            return res.status(200).json(TransactionsAnswer);
          }
        }
      } else {
        if (listOfJournals[data].Transaction) {
          const TransactionsAnswer = [];
          const listOfTransactions = listOfJournals.Transaction;

          if (Array.isArray(listOfTransactions)) {
            for (data in listOfTransactions) {
              TransactionsAnswer.push(listOfTransactions[data]);
            }
          } else {
            TransactionsAnswer.push(listOfTransactions);
          }

          return res.status(200).json(TransactionsAnswer);
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter uma transação, dada o seu Id
 */
auditfileController.getTransactionById = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const listOfJournals = auditfile.GeneralLedgerEntries.Journal;

      if (Array.isArray(listOfJournals)) {
        for (data in listOfJournals) {
          if (listOfJournals[data].Transaction) {
            const listOfTransactions = listOfJournals[data].Transaction;

            if (Array.isArray(listOfTransactions)) {
              for (extradata in listOfTransactions) {
                if (
                  listOfTransactions[extradata].TransactionID == req.body.id
                ) {
                  return res.status(200).json(listOfTransactions[extradata]);
                }
              }
            } else {
              if (listOfTransactions.TransactionID == req.body.id) {
                return res.status(200).json(listOfTransactions);
              }
            }
          }
        }
      } else {
        if (listOfJournals[data].Transaction) {
          const listOfTransactions = listOfJournals.Transaction;

          if (Array.isArray(listOfTransactions)) {
            for (data in listOfTransactions) {
              if (listOfTransactions[data].TransactionID == req.body.id) {
                return res.status(200).json(listOfTransactions[data]);
              }
            }
          } else {
            if (listOfTransactions.TransactionID == req.body.id) {
              return res.status(200).json(listOfTransactions);
            }
          }
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Metodo responsável por obter todas as invoices
 */
auditfileController.getAllInvoices = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      let InvoicesAnswer = [];
      const listOfInvoices = auditfile.SourceDocuments.SalesInvoices.Invoice;

      if (Array.isArray(listOfInvoices)) {
        InvoicesAnswer = listOfInvoices;
      } else {
        InvoicesAnswer.push(listOfInvoices);
      }

      return res.status(200).json(InvoicesAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter uma invoice, dado o seu número
 */
auditfileController.getInvoiceByNo = async (req, res) => {
  try {
    const auditfile = await AuditFile.find({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      const listOfInvoices = auditfile.SourceDocuments.SalesInvoices.Invoice;

      if (Array.isArray(listOfInvoices)) {
        for (data in listOfInvoices) {
          if (listOfInvoices[data].InvoiceNo == req.body.id) {
            return res.status(200).json(listOfInvoices[data]);
          }
        }
      } else {
        if (listOfInvoices.InvoiceNo == req.body.id) {
          return res.status(200).json(listOfInvoices);
        }
      }
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter os totais vendidos por período, dado o seu ano fiscal
 */
auditfileController.getSalesByPeriod = async (req, res) => {
  try {
    /*Vendas totais, tendo em conta a informação nos Invoices*/
    const salesTotalsByPeriod = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      {
        $unwind: '$SourceDocuments.SalesInvoices.Invoice',
      },
      {
        $group: {
          _id: '$SourceDocuments.SalesInvoices.Invoice.Period',
          PeriodTotal: {
            $sum:
              '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal',
          },
          PeriodTotalWithoutTax: {
            $avg:
              '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal',
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const sales = [];

    for (data in salesTotalsByPeriod) {
      const sale = {
        Period: salesTotalsByPeriod[data]._id,
        PeriodTotal: salesTotalsByPeriod[data].PeriodTotal,
        PeriodTotalWithoutTax: salesTotalsByPeriod[data].PeriodTotalWithoutTax,
      };

      sales.push(sale);
    }

    if (sales.length > 0) {
      return res.status(200).json({ SalesTotalsByPeriod: sales });
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por retornar os clientes, por cidade
 */
auditfileController.getNumberOfCustomersByCity = async (req, res) => {
  try {
    const numberOfCustomersPerCity = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      {
        $unwind: '$MasterFiles.Customer',
      },
      {
        $group: {
          _id: '$MasterFiles.Customer.BillingAddress.City',
          NumberOfCustomers: { $sum: 1 },
        },
      },
    ]);

    const NumberOfCustomersByCity = [];

    for (data in numberOfCustomersPerCity) {
      const city = {
        City: numberOfCustomersPerCity[data]._id,
        NumberOfCustomers: numberOfCustomersPerCity[data].NumberOfCustomers,
      };

      NumberOfCustomersByCity.push(city);
    }

    if (NumberOfCustomersByCity.length > 0) {
      return res.status(200).json(NumberOfCustomersByCity);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por retornar os fornecedores, por cidade
 */
auditfileController.getNumberOfSuppliersByCity = async (req, res) => {
  try {
    const numberOfSuppliersPerCity = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      {
        $unwind: '$MasterFiles.Supplier',
      },
      {
        $group: {
          _id: '$MasterFiles.Supplier.BillingAddress.City',
          NumberOfSuppliers: { $sum: 1 },
        },
      },
    ]);

    const NumberOfSuppliersByCity = [];

    for (data in numberOfSuppliersPerCity) {
      const city = {
        City: numberOfSuppliersPerCity[data]._id,
        NumberOfSuppliers: numberOfSuppliersPerCity[data].NumberOfSuppliers,
      };

      NumberOfSuppliersByCity.push(city);
    }

    if (NumberOfSuppliersByCity.length > 0) {
      return res.status(200).json(NumberOfSuppliersByCity);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método que retorna as vendas organizadas por cliente
 */
auditfileController.getSalesByCustomer = async (req, res) => {
  try {
    const salesPerCustomer = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      {
        $unwind: '$SourceDocuments.SalesInvoices.Invoice',
      },
      {
        $group: {
          _id: '$SourceDocuments.SalesInvoices.Invoice.CustomerID',
          ClientTotal: {
            $sum:
              '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal',
          },
          ClientAverage: {
            $avg:
              '$SourceDocuments.SalesInvoices.Invoice.DocumentTotals.GrossTotal',
          },
          NumberOfSales: { $sum: 1 },
        },
      },
      {
        $sort: {
          ClientTotal: -1,
        },
      },
    ]);

    const customers = await AuditFile.aggregate([
      {
        $unwind: '$MasterFiles.Customer',
      },
      {
        $project: {
          _id: 0,
          Customer: {
            CustomerID: '$MasterFiles.Customer.CustomerID',
            CustomerTaxID: '$MasterFiles.Customer.CustomerTaxID',
            CompanyName: '$MasterFiles.Customer.CompanyName',
          },
        },
      },
    ]);

    const ListOfSalesByCustomers = [];

    for (let i = 0; i < salesPerCustomer.length; i++) {
      const SalesByCustomer = {
        CustomerID: customers[i].Customer.CustomerID,
        CustomerTaxID: customers[i].Customer.CustomerTaxID,
        CompanyName: customers[i].Customer.CompanyName,
        TotalOfSales: salesPerCustomer[i].ClientTotal,
        AverageOfSales: salesPerCustomer[i].ClientAverage,
        NumberOfSales: salesPerCustomer[i].NumberOfSales,
      };

      ListOfSalesByCustomers.push(SalesByCustomer);
    }

    if (ListOfSalesByCustomers.length > 0) {
      return res.status(200).json(ListOfSalesByCustomers);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método que retorna as vendas por produto
 */
auditfileController.getSalesByProduct = async (req, res) => {
  try {
    const salesPerProduct = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      { $unwind: { path: '$SourceDocuments.SalesInvoices.Invoice' } },
      { $unwind: { path: '$SourceDocuments.SalesInvoices.Invoice.Line' } },
      {
        $unwind: {
          path: '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode',
        },
      },
      {
        $group: {
          _id: '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode',
          ProductDescription: {
            $addToSet:
              '$SourceDocuments.SalesInvoices.Invoice.Line.Description',
          },
          ProductTotal: {
            $sum: '$SourceDocuments.SalesInvoices.Invoice.Line.CreditAmount',
          },
          ProductAverage: {
            $avg: '$SourceDocuments.SalesInvoices.Invoice.Line.CreditAmount',
          },
          NumberOfSales: { $sum: 1 },
        },
      },
      {
        $sort: {
          ProductTotal: -1,
        },
      },
    ]);

    const SalesByProducts = [];

    for (data in salesPerProduct) {
      const salesByProduct = {
        ProductCode: salesPerProduct[data]._id,
        ProductDescription: salesPerProduct[data].ProductDescription[0],
        TotalOfSales: salesPerProduct[data].ProductTotal,
        AverageOfSales: salesPerProduct[data].ProductAverage,
        NumberOfSales: salesPerProduct[data].NumberOfSales,
      };

      SalesByProducts.push(salesByProduct);
    }

    if (SalesByProducts.length > 0) {
      return res.status(200).json(SalesByProducts);
    }
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Método responsável por obter os valores das compras sem iva por fornecedor
 */
auditfileController.getBoughtsBySupplier = async (req, res) => {
  try {
    const auditfile = await AuditFile.findOne({
      'Header.FiscalYear': parseInt(req.params.year),
    });

    if (auditfile) {
      let SuppliersAnswer = [];
      const listOfAccounts =
        auditfile.MasterFiles.GeneralLedgerAccounts.Account;

      if (Array.isArray(listOfAccounts)) {
        for (data in listOfAccounts) {
          if (listOfAccounts[data].GroupingCode == '2211') {
            const account = {
              SupplierName: listOfAccounts[data].AccountDescription,
              AccountID: listOfAccounts[data].AccountID,
            };
            SuppliersAnswer.push(account);
          }
        }
      } else {
        SuppliersAnswer.push({
          SupplierName: listOfAccounts[data].AccountDescription,
          AccountID: listOfAccounts[data].AccountID,
        });
      }

      const listOfBoughts =
        auditfile.GeneralLedgerEntries.Journal[0].Transaction;

      for (account in SuppliersAnswer) {
        SuppliersAnswer[account].TotalBoughts = 0.0;
        var numberOfBoughts = 0;
        for (bought in listOfBoughts) {
          if (
            listOfBoughts[bought].Lines.CreditLine.AccountID ==
            SuppliersAnswer[account].AccountID
          ) {
            SuppliersAnswer[account].TotalBoughts +=
              listOfBoughts[bought].Lines.DebitLine[1].DebitAmount;
            numberOfBoughts += 1;
          }
        }
        SuppliersAnswer[account].AverageBought =
          SuppliersAnswer[account].TotalBoughts / numberOfBoughts;
      }

      return res.status(200).json(SuppliersAnswer);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Retorna as vendas por grupo dos produtos
 */
auditfileController.getSalesByProductGroup = async (req, res) => {
  try {
    const salesPerProduct = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      { $unwind: { path: '$SourceDocuments.SalesInvoices.Invoice' } },
      { $unwind: { path: '$SourceDocuments.SalesInvoices.Invoice.Line' } },
      {
        $unwind: {
          path: '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode',
        },
      },
      {
        $group: {
          _id: '$SourceDocuments.SalesInvoices.Invoice.Line.ProductCode',
          ProductTotal: {
            $sum: '$SourceDocuments.SalesInvoices.Invoice.Line.CreditAmount',
          },
          NumberOfSales: { $sum: 1 },
        },
      },
    ]);

    const products = [];

    for (data in salesPerProduct) {
      const product = {
        ProductCode: salesPerProduct[data]._id,
        ProductTotal: salesPerProduct[data].ProductTotal,
        NumberOfSales: salesPerProduct[data].NumberOfSales,
      };

      products.push(product);
    }

    const productGroups = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      { $unwind: '$MasterFiles.Product' },
      {
        $group: {
          _id: '$MasterFiles.Product.ProductGroup',
          ProductCodes: { $addToSet: '$MasterFiles.Product.ProductCode' },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const SalesByProductsGroup = [];

    for (let i = 0; i < productGroups.length; i++) {
      const productGroup = productGroups[i]._id;
      const productsOfGroup = productGroups[i].ProductCodes;
      let groupTotal = 0;
      let countSales = 0;

      for (let j = 0; j < products.length; j++) {
        if (productsOfGroup.includes(products[j].ProductCode)) {
          groupTotal += products[j].ProductTotal;
          countSales += products[j].NumberOfSales;
        }
      }

      const SalesByProductGroup = {
        ProductGroup: productGroup,
        ProductsCodes: productsOfGroup,
        GroupTotal: groupTotal,
        NumberOfSales: countSales,
      };

      SalesByProductsGroup.push(SalesByProductGroup);
    }

    if (SalesByProductsGroup.length > 0) {
      return res.status(200).json(SalesByProductsGroup);
    }

    return res.status(404).json(notfound);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

/**
 * Obtêm os totais de um auditfile
 */
auditfileController.getAuditFileTotals = async (req, res) => {
  try {
    const moviments = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      {
        $project: {
          'SourceDocuments.SalesInvoices.NumberOfEntries': 1,
          'SourceDocuments.SalesInvoices.TotalCredit': 1,
          'GeneralLedgerEntries.NumberOfEntries': 1,
          'GeneralLedgerEntries.TotalCredit': 1,
        },
      },
    ]);

    if (moviments.length == 0) {
      return res.status(404).json(notfound);
    }

    const TotalSalesAndPurchases = await AuditFile.aggregate([
      {
        $match: {
          'Header.FiscalYear': parseInt(req.params.year),
        },
      },
      { $unwind: '$GeneralLedgerEntries.Journal' },
      { $unwind: '$GeneralLedgerEntries.Journal.Transaction' },
      { $unwind: '$GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine' },
      {
        $group: {
          _id: '$GeneralLedgerEntries.Journal.Description',
          Total: {
            $sum:
              '$GeneralLedgerEntries.Journal.Transaction.Lines.CreditLine.CreditAmount',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    if (TotalSalesAndPurchases.length == 0) {
      return res.status(404).json(notfound);
    }

    const AuditFileTotals = {
      Totals: {
        TotalEntries: moviments[0].GeneralLedgerEntries.NumberOfEntries,
        NumberOfSales:
          moviments[0].SourceDocuments.SalesInvoices.NumberOfEntries,
        TotalCredit: moviments[0].GeneralLedgerEntries.TotalCredit,
        TotalSales: moviments[0].SourceDocuments.SalesInvoices.TotalCredit,
        TotalBoughts: TotalSalesAndPurchases[0].Total,
        TotalSales: TotalSalesAndPurchases[1].Total,
      },
    };

    return res.status(200).json(AuditFileTotals);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

module.exports = auditfileController;
