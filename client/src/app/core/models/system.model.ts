/**
 * Database information model
 */
export interface DatabaseInfo {
  databaseName: string;
  serverAddress: string;
}

/**
 * PDF settings model
 */
export interface PdfSettings {
  invoiceSavePath: string;
  contractSavePath: string;
}
