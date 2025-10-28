using Microsoft.Extensions.Logging;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Server.BusinessLogic.Invoice;
using Server.BusinessLogic.Contract;
using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Pdf;

/// <summary>
/// Service for generating modern, professional PDF documents using QuestPDF
/// </summary>
public class PdfService : IPdfService
{
    private readonly IInvoiceBusinessLogic _invoiceBusinessLogic;
    private readonly IContractBusinessLogic _contractBusinessLogic;
    private readonly ILogger<PdfService> _logger;

    // Company information constants
    private const string COMPANY_NAME = "Melchior Hermann";
    private const string COMPANY_ADDRESS = "Schilterndorf 29";
    private const string COMPANY_CITY = "9150 Bleiburg";
    private const string COMPANY_PHONE = "0676 / 6259929";
    private const string COMPANY_EMAIL = "office@melchior-erdbau.at";
    private const string COMPANY_WEB = "melchior-erdbau.at";
    private const string COMPANY_UID = "ATU78017548";
    private const string COMPANY_TAX_NUMBER = "576570535";
    private const string COMPANY_OWNER = "Melchior Hermann";
    private const string COMPANY_BANK = "Kärntner Sparkasse Bleiburg";
    private const string COMPANY_IBAN = "AT142070604600433397";
    private const string COMPANY_BIC = "KSPKAT2KXXX";

    // Minimalist color scheme - subtle and professional
    private static readonly Color TEXT_PRIMARY = Color.FromHex("#1f2937"); // Dark gray for text
    private static readonly Color TEXT_SECONDARY = Color.FromHex("#6b7280"); // Medium gray for labels
    private static readonly Color BORDER_COLOR = Color.FromHex("#e5e7eb"); // Light gray for borders
    private static readonly Color TABLE_HEADER_BG = Color.FromHex("#f9fafb"); // Very light gray for table header

    public PdfService(
        IInvoiceBusinessLogic invoiceBusinessLogic,
        IContractBusinessLogic contractBusinessLogic,
        ILogger<PdfService> logger)
    {
        _invoiceBusinessLogic = invoiceBusinessLogic;
        _contractBusinessLogic = contractBusinessLogic;
        _logger = logger;

        // Set QuestPDF license for community use
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]> GenerateInvoicePdfAsync(int invoiceId)
    {
        _logger.LogInformation("Generating PDF for invoice {InvoiceId}", invoiceId);

        var invoice = await _invoiceBusinessLogic.GetInvoiceByIdAsync(invoiceId);
        if (invoice == null)
        {
            throw new ArgumentException($"Invoice with ID {invoiceId} not found");
        }

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(TEXT_PRIMARY));

                page.Header().Element(c => ComposeInvoiceHeader(c, invoice));
                page.Content().Element(c => ComposeInvoiceContent(c, invoice));
                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> GenerateContractPdfAsync(int contractId)
    {
        _logger.LogInformation("Generating PDF for contract {ContractId}", contractId);
        
        var contract = await _contractBusinessLogic.GetContractByIdAsync(contractId);
        if (contract == null)
        {
            throw new ArgumentException($"Contract with ID {contractId} not found");
        }

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(TEXT_PRIMARY));

                page.Header().Element(c => ComposeContractHeader(c, contract));
                page.Content().Element(c => ComposeContractContent(c, contract));
                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeInvoiceHeader(IContainer container, InvoiceDto invoice)
    {
        container.Column(column =>
        {
            // Top section with company and customer info
            column.Item().Row(row =>
            {
                // Left: Company info
                row.RelativeItem().Column(leftColumn =>
                {
                    leftColumn.Item().Text(COMPANY_NAME)
                        .FontSize(16)
                        .Bold()
                        .FontColor(TEXT_PRIMARY);
                    
                    leftColumn.Item().PaddingTop(6).Text(text =>
                    {
                        text.Span(COMPANY_ADDRESS).FontSize(9).FontColor(TEXT_SECONDARY);
                        text.Span("\n");
                        text.Span(COMPANY_CITY).FontSize(9).FontColor(TEXT_SECONDARY);
                    });

                    leftColumn.Item().PaddingTop(6).Text(text =>
                    {
                        text.Span(COMPANY_PHONE).FontSize(9).FontColor(TEXT_SECONDARY);
                        text.Span(" | ");
                        text.Span(COMPANY_EMAIL).FontSize(9).FontColor(TEXT_SECONDARY);
                    });
                });

                // Right: Customer info
                row.RelativeItem().Column(rightColumn =>
                {
                    rightColumn.Item().AlignRight().Text("Rechnung")
                        .FontSize(20)
                        .Bold()
                        .FontColor(TEXT_PRIMARY);

                    if (invoice.Customer != null)
                    {
                        rightColumn.Item().PaddingTop(10).AlignRight().Text(text =>
                        {
                            var customerName = $"{invoice.Customer.Firstname} {invoice.Customer.Surname}".Trim();
                            text.Span(customerName).Bold().FontSize(10).FontColor(TEXT_PRIMARY);
                            text.Span("\n");
                            text.Span($"{invoice.Customer.Address} {invoice.Customer.Nr}").FontSize(9).FontColor(TEXT_SECONDARY);
                            text.Span("\n");
                            text.Span($"{invoice.Customer.Plz} {invoice.Customer.City}").FontSize(9).FontColor(TEXT_SECONDARY);
                            
                            if (!string.IsNullOrWhiteSpace(invoice.Customer.Uid))
                            {
                                text.Span("\n");
                                text.Span($"UID: {invoice.Customer.Uid}").FontSize(9).FontColor(TEXT_SECONDARY);
                            }
                        });
                    }
                });
            });

            // Simple divider line
            column.Item().PaddingTop(15).PaddingBottom(15).LineHorizontal(1).LineColor(BORDER_COLOR);

            // Invoice metadata - clean and simple
            column.Item().PaddingBottom(10).Row(row =>
            {
                row.RelativeItem().Text(text =>
                {
                    text.Span("Rechnung Nr. ").FontSize(9).FontColor(TEXT_SECONDARY);
                    text.Span($"{invoice.InvoiceId:D5}").FontSize(9).Bold().FontColor(TEXT_PRIMARY);
                });

                row.RelativeItem().Text(text =>
                {
                    text.Span("Datum: ").FontSize(9).FontColor(TEXT_SECONDARY);
                    text.Span(invoice.CreatedAt.ToString("dd.MM.yyyy")).FontSize(9).FontColor(TEXT_PRIMARY);
                });

                row.RelativeItem().AlignRight().Text(text =>
                {
                    text.Span("Kunde Nr. ").FontSize(9).FontColor(TEXT_SECONDARY);
                    text.Span($"{invoice.Customer?.CustomerId}").FontSize(9).FontColor(TEXT_PRIMARY);
                });
            });

            column.Item().PaddingBottom(5).Text(text =>
            {
                text.Span("Leistungszeitraum: ").FontSize(9).FontColor(TEXT_SECONDARY);
                text.Span($"{invoice.StartedAt:dd.MM.yyyy} - {invoice.FinishedAt:dd.MM.yyyy}").FontSize(9).FontColor(TEXT_PRIMARY);
                var typeLabel = invoice.Type == "D" ? " | Dienstleistung" : " | Bauleistung";
                text.Span(typeLabel).FontSize(9).FontColor(TEXT_SECONDARY);
            });
        });
    }

    private void ComposeInvoiceContent(IContainer container, InvoiceDto invoice)
    {
        container.PaddingTop(15).Column(column =>
        {
            // Positions table with clean, minimal styling
            column.Item().Table(table =>
            {
                // Define columns with better proportions to prevent text wrapping
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(30); // Pos - smaller
                    columns.RelativeColumn(5); // Description - more space
                    columns.ConstantColumn(70); // Unit Price
                    columns.ConstantColumn(55); // Quantity
                    columns.ConstantColumn(75); // Total
                });

                // Clean table header with subtle background
                table.Header(header =>
                {
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .Text("Pos").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .Text("Beschreibung").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text("Einzelpreis").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignCenter().Text("Anzahl").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text("Gesamtpreis").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                });

                // Rows with subtle borders, no alternating colors
                int index = 0;
                foreach (var position in invoice.Positions ?? Enumerable.Empty<InvoicePositionDto>())
                {
                    index++;

                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignCenter().Text(index.ToString()).FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .Text(position.Position?.Text ?? "-").FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text($"€ {position.Position?.Price:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignCenter().Text($"{position.Amount:N2} {position.Position?.Unit ?? ""}").FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text($"€ {position.LineTotal:N2}").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                }
            });

            // Summary section - clean and minimal
            column.Item().PaddingTop(15).AlignRight().Width(280).Column(summaryColumn =>
            {
                var nettoBetrag = CalculateInvoiceNetto(invoice);
                var mwst = invoice.Type == "D" ? nettoBetrag * 0.2m : 0;
                var anzahlungNetto = invoice.DepositAmount > 0 ? (decimal)(invoice.DepositAmount / 1.2) : 0;
                var anzahlungMwst = invoice.DepositAmount > 0 ? (decimal)invoice.DepositAmount - anzahlungNetto : 0;
                var restbetrag = invoice.Type == "D" ? nettoBetrag + mwst - (decimal)invoice.DepositAmount : nettoBetrag;

                // Nettobetrag
                summaryColumn.Item().BorderBottom(1).BorderColor(BORDER_COLOR).PaddingBottom(4).Row(row =>
                {
                    row.RelativeItem().Text("Nettobetrag:").FontSize(9).FontColor(TEXT_SECONDARY);
                    row.ConstantItem(90).AlignRight().Text($"€ {nettoBetrag:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                });

                // MwSt for Dienstleistung
                if (invoice.Type == "D")
                {
                    summaryColumn.Item().PaddingTop(4).Row(row =>
                    {
                        row.RelativeItem().Text("zzgl. 20% MwSt.:").FontSize(9).FontColor(TEXT_SECONDARY);
                        row.ConstantItem(90).AlignRight().Text($"€ {mwst:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                    });

                    // Deposit deductions
                    if (invoice.DepositAmount > 0)
                    {
                        summaryColumn.Item().PaddingTop(4).Row(row =>
                        {
                            row.RelativeItem().Text($"- Anzahlung vom {invoice.DepositPaidOn:dd.MM.yyyy}:").FontSize(9).FontColor(TEXT_SECONDARY);
                            row.ConstantItem(90).AlignRight().Text($"€ {anzahlungNetto:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                        });

                        summaryColumn.Item().PaddingTop(4).Row(row =>
                        {
                            row.RelativeItem().Text("- Umsatzsteuer Anzahlung:").FontSize(9).FontColor(TEXT_SECONDARY);
                            row.ConstantItem(90).AlignRight().Text($"€ {anzahlungMwst:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                        });
                    }

                    // Total with subtle highlight
                    summaryColumn.Item().PaddingTop(8).BorderTop(2).BorderColor(TEXT_PRIMARY).PaddingTop(6).Row(row =>
                    {
                        row.RelativeItem().Text(invoice.DepositAmount > 0 ? "Restbetrag:" : "Betrag:")
                            .FontSize(11).Bold().FontColor(TEXT_PRIMARY);
                        row.ConstantItem(90).AlignRight().Text($"€ {restbetrag:N2}")
                            .FontSize(11).Bold().FontColor(TEXT_PRIMARY);
                    });
                }
                else
                {
                    // For Bauleistung, show netto as total
                    summaryColumn.Item().PaddingTop(8).BorderTop(2).BorderColor(TEXT_PRIMARY).PaddingTop(6).Row(row =>
                    {
                        row.RelativeItem().Text("Nettobetrag:")
                            .FontSize(11).Bold().FontColor(TEXT_PRIMARY);
                        row.ConstantItem(90).AlignRight().Text($"€ {nettoBetrag:N2}")
                            .FontSize(11).Bold().FontColor(TEXT_PRIMARY);
                    });
                }
            });

            // Tax notice - subtle and small
            column.Item().PaddingTop(12).Text(text =>
            {
                if (invoice.Type == "D")
                {
                    text.Span("Zahlbar nach Erhalt der Rechnung").FontSize(8).Italic().FontColor(TEXT_SECONDARY);
                }
                else
                {
                    text.Span("Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG ")
                        .FontSize(8).Italic().FontColor(TEXT_SECONDARY);
                    text.Span("auf den Leistungsempfänger übergeht")
                        .FontSize(8).Italic().FontColor(TEXT_SECONDARY);
                }
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignBottom().Column(column =>
        {
            column.Item().PaddingBottom(8).LineHorizontal(1).LineColor(BORDER_COLOR);
            
            column.Item().PaddingTop(8).Row(row =>
            {
                // Company details
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(COMPANY_NAME).FontSize(8).FontColor(TEXT_SECONDARY);
                    col.Item().Text($"{COMPANY_ADDRESS}, {COMPANY_CITY}").FontSize(8).FontColor(TEXT_SECONDARY);
                });

                // Tax info
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"UID: {COMPANY_UID}").FontSize(8).FontColor(TEXT_SECONDARY);
                    col.Item().Text($"Steuernummer: {COMPANY_TAX_NUMBER}").FontSize(8).FontColor(TEXT_SECONDARY);
                });

                // Banking info
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(COMPANY_BANK).FontSize(8).FontColor(TEXT_SECONDARY);
                    col.Item().Text($"IBAN: {COMPANY_IBAN}").FontSize(8).FontColor(TEXT_SECONDARY);
                });
            });
        });
    }

    private decimal CalculateInvoiceNetto(InvoiceDto invoice)
    {
        if (invoice.Positions == null) return 0;
        return invoice.Positions.Sum(p => (decimal)p.LineTotal);
    }

    private void ComposeContractHeader(IContainer container, ContractDto contract)
    {
        container.Column(column =>
        {
            // Top section with company and customer info
            column.Item().Row(row =>
            {
                // Left: Company info
                row.RelativeItem().Column(leftColumn =>
                {
                    leftColumn.Item().Text(COMPANY_NAME)
                        .FontSize(16)
                        .Bold()
                        .FontColor(TEXT_PRIMARY);
                    
                    leftColumn.Item().PaddingTop(6).Text(text =>
                    {
                        text.Span(COMPANY_ADDRESS).FontSize(9).FontColor(TEXT_SECONDARY);
                        text.Span("\n");
                        text.Span(COMPANY_CITY).FontSize(9).FontColor(TEXT_SECONDARY);
                    });

                    leftColumn.Item().PaddingTop(6).Text(text =>
                    {
                        text.Span(COMPANY_PHONE).FontSize(9).FontColor(TEXT_SECONDARY);
                        text.Span(" | ");
                        text.Span(COMPANY_EMAIL).FontSize(9).FontColor(TEXT_SECONDARY);
                    });
                });

                // Right: Customer info
                row.RelativeItem().Column(rightColumn =>
                {
                    rightColumn.Item().AlignRight().Text("Angebot")
                        .FontSize(20)
                        .Bold()
                        .FontColor(TEXT_PRIMARY);

                    if (contract.Customer != null)
                    {
                        rightColumn.Item().PaddingTop(10).AlignRight().Text(text =>
                        {
                            var customerName = $"{contract.Customer.Firstname} {contract.Customer.Surname}".Trim();
                            text.Span(customerName).Bold().FontSize(10).FontColor(TEXT_PRIMARY);
                            text.Span("\n");
                            text.Span($"{contract.Customer.Address} {contract.Customer.Nr}").FontSize(9).FontColor(TEXT_SECONDARY);
                            text.Span("\n");
                            text.Span($"{contract.Customer.Plz} {contract.Customer.City}").FontSize(9).FontColor(TEXT_SECONDARY);
                            
                            if (!string.IsNullOrWhiteSpace(contract.Customer.Uid))
                            {
                                text.Span("\n");
                                text.Span($"UID: {contract.Customer.Uid}").FontSize(9).FontColor(TEXT_SECONDARY);
                            }
                        });
                    }
                });
            });

            // Simple divider line
            column.Item().PaddingTop(15).PaddingBottom(15).LineHorizontal(1).LineColor(BORDER_COLOR);

            // Contract metadata - clean and simple
            column.Item().PaddingBottom(10).Row(row =>
            {
                row.RelativeItem().Text(text =>
                {
                    text.Span("Angebot Nr. ").FontSize(9).FontColor(TEXT_SECONDARY);
                    text.Span($"{contract.ContractId:D5}").FontSize(9).Bold().FontColor(TEXT_PRIMARY);
                });

                row.RelativeItem().Text(text =>
                {
                    text.Span("Datum: ").FontSize(9).FontColor(TEXT_SECONDARY);
                    text.Span(contract.CreatedAt.ToString("dd.MM.yyyy")).FontSize(9).FontColor(TEXT_PRIMARY);
                });

                row.RelativeItem().AlignRight().Text(text =>
                {
                    text.Span("Kunde Nr. ").FontSize(9).FontColor(TEXT_SECONDARY);
                    text.Span($"{contract.Customer?.CustomerId}").FontSize(9).FontColor(TEXT_PRIMARY);
                });
            });

            column.Item().PaddingBottom(5).Text(text =>
            {
                text.Span("Status: ").FontSize(9).FontColor(TEXT_SECONDARY);
                text.Span(contract.Accepted ? "Angenommen" : "Ausstehend")
                    .FontSize(9).FontColor(TEXT_PRIMARY);
                text.Span(" | Gültigkeit: 10 Tage").FontSize(9).FontColor(TEXT_SECONDARY);
            });
        });
    }

    private void ComposeContractContent(IContainer container, ContractDto contract)
    {
        container.PaddingTop(15).Column(column =>
        {
            // Positions table with clean, minimal styling
            column.Item().Table(table =>
            {
                // Define columns with better proportions to prevent text wrapping
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(30); // Pos - smaller
                    columns.RelativeColumn(5); // Description - more space
                    columns.ConstantColumn(70); // Unit Price
                    columns.ConstantColumn(55); // Quantity
                    columns.ConstantColumn(75); // Total
                });

                // Clean table header with subtle background
                table.Header(header =>
                {
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .Text("Pos").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .Text("Beschreibung").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text("Einzelpreis").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignCenter().Text("Anzahl").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                    
                    header.Cell().Background(TABLE_HEADER_BG).Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text("Gesamtpreis").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                });

                // Rows with subtle borders, no alternating colors
                int index = 0;
                foreach (var position in contract.Positions ?? Enumerable.Empty<ContractPositionDto>())
                {
                    index++;
                    var lineTotal = (decimal)position.Amount * (decimal)(position.Position?.Price ?? 0);

                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignCenter().Text(index.ToString()).FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .Text(position.Position?.Text ?? "-").FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text($"€ {position.Position?.Price:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignCenter().Text($"{position.Amount:N2} {position.Position?.Unit ?? ""}").FontSize(9).FontColor(TEXT_PRIMARY);
                    
                    table.Cell().Padding(6).BorderBottom(1).BorderColor(BORDER_COLOR)
                        .AlignRight().Text($"€ {lineTotal:N2}").FontSize(9).SemiBold().FontColor(TEXT_PRIMARY);
                }
            });

            // Summary section - clean and minimal
            column.Item().PaddingTop(15).AlignRight().Width(280).Column(summaryColumn =>
            {
                var nettoBetrag = CalculateContractNetto(contract);
                var mwst = nettoBetrag * 0.2m;
                var gesamtBetrag = nettoBetrag + mwst;

                // Nettobetrag
                summaryColumn.Item().BorderBottom(1).BorderColor(BORDER_COLOR).PaddingBottom(4).Row(row =>
                {
                    row.RelativeItem().Text("Nettobetrag:").FontSize(9).FontColor(TEXT_SECONDARY);
                    row.ConstantItem(90).AlignRight().Text($"€ {nettoBetrag:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                });

                // MwSt
                summaryColumn.Item().PaddingTop(4).Row(row =>
                {
                    row.RelativeItem().Text("zzgl. 20% MwSt.:").FontSize(9).FontColor(TEXT_SECONDARY);
                    row.ConstantItem(90).AlignRight().Text($"€ {mwst:N2}").FontSize(9).FontColor(TEXT_PRIMARY);
                });

                // Total with subtle highlight
                summaryColumn.Item().PaddingTop(8).BorderTop(2).BorderColor(TEXT_PRIMARY).PaddingTop(6).Row(row =>
                {
                    row.RelativeItem().Text("Gesamtbetrag:")
                        .FontSize(11).Bold().FontColor(TEXT_PRIMARY);
                    row.ConstantItem(90).AlignRight().Text($"€ {gesamtBetrag:N2}")
                        .FontSize(11).Bold().FontColor(TEXT_PRIMARY);
                });
            });

            // Validity notice - subtle and small
            column.Item().PaddingTop(12).Text(text =>
            {
                text.Span("Dieses Angebot ist 10 Tage lang gültig.").FontSize(8).Italic().FontColor(TEXT_SECONDARY);
            });
        });
    }

    private decimal CalculateContractNetto(ContractDto contract)
    {
        if (contract.Positions == null) return 0;
        return contract.Positions.Sum(p => (decimal)p.Amount * (decimal)(p.Position?.Price ?? 0));
    }
}
