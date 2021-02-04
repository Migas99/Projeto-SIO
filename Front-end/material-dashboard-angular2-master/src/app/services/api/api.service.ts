import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  API_ENDPOINT: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /** HTTP GET REQUESTS */

  /**
   *
   */
  public getSaftYears(): Observable<any> {
    return this.http.get(
      this.API_ENDPOINT + '/auditfiles/getYearsOfAuditFiles'
    );
  }

  /**
   *
   * @param form
   */
  public uploadSAFT(form: FormData): Observable<any> {
    return this.http.post(this.API_ENDPOINT + `/auditfiles/upload`, {
      formData: form,
    });
  }

  /**
   *
   * @param year
   */
  public getAuditFileByYear(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/getAuditFileByYear/${year}`
    );
  }

  /**
   *
   * @param year
   */
  public getCompanyInfoByYear(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getCompanyInfo`
    );
  }

  /**
   *
   * @param year
   */
  public getAllClients(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAllCustomers`
    );
  }

  /**
   *
   * @param year
   */
  public getAllSuppliers(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAllSuppliers`
    );
  }

  /**
   *
   * @param year
   */
  public getAllProducts(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAllProducts`
    );
  }

  /**
   *
   * @param year
   */
  public getAllJournals(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAllJournals`
    );
  }

  /**
   *
   * @param year
   */
  public getAllTransactions(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAllTransactions`
    );
  }

  /**
   *
   * @param year
   */
  public getAllInvoices(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAllInvoices`
    );
  }

  /**
   *
   * @param year
   */
  public getSalesByPeriod(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getSalesByPeriod`
    );
  }

  /**
   *
   * @param year
   */
  public getSalesBySupplier(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getBoughtsBySupplier`
    );
  }

  /**
   *
   * @param year
   */
  public getNumberOfCustomersByCity(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getNumberOfCustomersByCity`
    );
  }

  /**
   *
   * @param year
   */
  public getSalesByCustomer(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getSalesByCustomer`
    );
  }

  /**
   *
   * @param year
   */
  public getSalesByProduct(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getSalesByProduct`
    );
  }

  /**
   *
   * @param year
   */
  public getSalesByProductGroup(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getSalesByProductGroup`
    );
  }

  /**
   *
   * @param year
   */
  public getAuditFileTotals(year: number): Observable<any> {
    return this.http.get<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getAuditFileTotals`
    );
  }

  /** HTTP POST REQUESTS */

  /**
   *
   * @param file
   */
  public fileUpload(form: FormData): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/upload`,
      form
    );
  }

  /**
   *
   * @param year
   * @param id
   */
  public getClientFiscalInfoByYear(year: number, id: number): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getCustomerById`,
      { id: id }
    );
  }

  /**
   *
   * @param year
   * @param id
   */
  public getSupplierFiscalInfoByYear(
    year: number,
    id: number
  ): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getSupplierById`,
      { id: id }
    );
  }

  /**
   *
   * @param year
   * @param id
   */
  public getProductFiscalInfoByYear(year: number, id: number): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getProductByCode`,
      { id: id }
    );
  }

  /**
   *
   * @param year
   * @param id
   */
  public getJournalFiscalInfoByYear(year: number, id: number): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getJournalById`,
      { id: id }
    );
  }

  /**
   *
   * @param year
   * @param id
   */
  public getTransactionFiscalInfoByYear(
    year: number,
    id: number
  ): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getTransactionById`,
      { id: id }
    );
  }

  /**
   *
   * @param year
   * @param id
   */
  public getInvoiceFiscalInfoByYear(year: number, id: number): Observable<any> {
    return this.http.post<Observable<any>>(
      this.API_ENDPOINT + `/auditfiles/${year}/getInvoiceByNo`,
      { id: id }
    );
  }
}
