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
    
    // Logo path - uses absolute path from repository root
    private static readonly string LOGO_PATH = Path.GetFullPath(
        Path.Combine(
            AppContext.BaseDirectory!,
            "..", "..", "..", "..", "..", "client", "src", "assets", "images", "logo_v1.png"
        )
    );

    // Gentler color scheme - different colors for invoices and contracts
    private static readonly Color INVOICE_COLOR = Color.FromHex("#ff6f47"); // Gentler blue for invoices
    private static readonly Color CONTRACT_COLOR = Color.FromHex("#34d399"); // Gentler green for contracts
    private static readonly Color GRAY_LIGHT = Color.FromHex("#f3f4f6");
    private static readonly Color GRAY_MEDIUM = Color.FromHex("#9ca3af");
    private static readonly Color GRAY_DARK = Color.FromHex("#374151");
    private static readonly Color TEXT_PRIMARY = Color.FromHex("#111827");

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
        
        // Log logo path for debugging
        _logger.LogInformation("Logo path: {LogoPath}, Exists: {Exists}", LOGO_PATH, File.Exists(LOGO_PATH));
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
            column.Item().Row(row =>
            {
                if (File.Exists(LOGO_PATH))
                {
                    row.ConstantItem(100).Image(LOGO_PATH).FitWidth();
                    column.Spacing(10);// Spacer
                }
            });
            // Top section with logo, company and customer info
            column.Item().Row(row =>
            {
                // Left: Company info
                row.RelativeItem().Column(leftColumn =>
                {
                    leftColumn.Item().Text(COMPANY_NAME)
                        .FontSize(20)
                        .Bold()
                        .FontColor(INVOICE_COLOR);
                    
                    leftColumn.Item().PaddingTop(8).Text(text =>
                    {
                        text.Span(COMPANY_ADDRESS).FontSize(9);
                        text.Span("\n");
                        text.Span(COMPANY_CITY).FontSize(9);
                    });

                    leftColumn.Item().PaddingTop(8).Text(text =>
                    {
                        text.Span("Tel: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(COMPANY_PHONE).FontSize(9);
                        text.Span("\n");
                        text.Span("E-Mail: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(COMPANY_EMAIL).FontSize(9);
                        text.Span("\n");
                        text.Span("Web: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(COMPANY_WEB).FontSize(9);
                    });
                });

                // Right: Customer info
                row.RelativeItem().Column(rightColumn =>
                {
                    rightColumn.Item().AlignRight().Text("RECHNUNG")
                        .FontSize(28)
                        .Bold()
                        .FontColor(INVOICE_COLOR);

                    if (invoice.Customer != null)
                    {
                        rightColumn.Item().PaddingTop(12).AlignRight().Text(text =>
                        {
                            var customerName = $"{invoice.Customer.Firstname} {invoice.Customer.Surname}".Trim();
                            text.Span(customerName).Bold().FontSize(11);
                            text.Span("\n");
                            text.Span($"{invoice.Customer.Address} {invoice.Customer.Nr}").FontSize(9);
                            text.Span("\n");
                            text.Span($"{invoice.Customer.Plz} {invoice.Customer.City}").FontSize(9);
                            
                            if (!string.IsNullOrWhiteSpace(invoice.Customer.Uid))
                            {
                                text.Span("\n");
                                text.Span($"UID: {invoice.Customer.Uid}").FontSize(9);
                            }
                        });
                    }
                });
            });

            // Divider
            column.Item().PaddingTop(20).PaddingBottom(15).LineHorizontal(2).LineColor(INVOICE_COLOR);

            // Invoice metadata in a modern card-style layout
            column.Item().Background(GRAY_LIGHT).Padding(12).Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(text =>
                    {
                        text.Span("Rechnung Nr. ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span($"#{invoice.InvoiceId:D5}").FontSize(11).Bold();
                    });
                    col.Item().PaddingTop(4).Text(text =>
                    {
                        text.Span("Kunde Nr. ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span($"{invoice.Customer?.CustomerId}").FontSize(9);
                    });
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(text =>
                    {
                        text.Span("Datum: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(invoice.CreatedAt.ToString("dd.MM.yyyy")).FontSize(9);
                    });
                    col.Item().PaddingTop(4).Text(text =>
                    {
                        text.Span("Leistungszeitraum: ").FontSize(9).FontColor(GRAY_MEDIUM);
                    });
                    col.Item().Text(text =>
                    {
                        text.Span($"{invoice.StartedAt:dd.MM.yyyy} - {invoice.FinishedAt:dd.MM.yyyy}").FontSize(9);
                    });
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().AlignRight().Text(text =>
                    {
                        text.Span("Typ: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        var typeLabel = invoice.Type == "D" ? "Dienstleistung" : "Bauleistung";
                        text.Span(typeLabel).FontSize(9).Bold().FontColor(INVOICE_COLOR);
                    });
                });
            });
        });
    }

    private void ComposeInvoiceContent(IContainer container, InvoiceDto invoice)
    {
        container.PaddingTop(20).Column(column =>
        {
            // Positions table with modern styling
            column.Item().Table(table =>
            {
                // Define columns
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(40); // Pos
                    columns.RelativeColumn(4); // Description
                    columns.ConstantColumn(80); // Unit Price
                    columns.ConstantColumn(80); // Quantity
                    columns.ConstantColumn(90); // Total
                });

                // Header with modern styling
                table.Header(header =>
                {
                    header.Cell().Background(INVOICE_COLOR).Padding(8).Text("Pos")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(INVOICE_COLOR).Padding(8).Text("Beschreibung")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(INVOICE_COLOR).Padding(8).AlignRight().Text("Einzelpreis")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(INVOICE_COLOR).Padding(8).AlignCenter().Text("Anzahl")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(INVOICE_COLOR).Padding(8).AlignRight().Text("Gesamtpreis")
                        .FontSize(10).Bold().FontColor(Colors.White);
                });

                // Rows with alternating colors
                int index = 0;
                foreach (var position in invoice.Positions ?? Enumerable.Empty<InvoicePositionDto>())
                {
                    index++;
                    var bgColor = index % 2 == 0 ? GRAY_LIGHT : Colors.White;

                    table.Cell().Background(bgColor).Padding(8).AlignCenter()
                        .Text(index.ToString()).FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8)
                        .Text(position.Position?.Text ?? "-").FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8).AlignRight()
                        .Text($"€ {position.Position?.Price:N2}").FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8).AlignCenter()
                        .Text($"{position.Amount:N2} {position.Position?.Unit ?? ""}").FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8).AlignRight()
                        .Text($"€ {position.LineTotal:N2}").FontSize(9).Bold();
                }
            });

            // Summary section with modern calculations
            column.Item().PaddingTop(20).AlignRight().Width(300).Column(summaryColumn =>
            {
                var nettoBetrag = CalculateInvoiceNetto(invoice);
                var mwst = invoice.Type == "D" ? nettoBetrag * 0.2m : 0;
                var anzahlungNetto = invoice.DepositAmount > 0 ? (decimal)(invoice.DepositAmount / 1.2) : 0;
                var anzahlungMwst = invoice.DepositAmount > 0 ? (decimal)invoice.DepositAmount - anzahlungNetto : 0;
                var restbetrag = invoice.Type == "D" ? nettoBetrag + mwst - (decimal)invoice.DepositAmount : nettoBetrag;

                // MwSt for Dienstleistung
                if (invoice.Type == "D")
                {
                    // Nettobetrag
                    summaryColumn.Item().Row(row =>
                    {
                        row.RelativeItem().Text("Nettobetrag:").FontSize(10);
                        row.ConstantItem(100).AlignRight().Text($"€ {nettoBetrag:N2}").FontSize(10);
                    });

                    summaryColumn.Item().PaddingTop(4).Row(row =>
                    {
                        row.RelativeItem().Text("zzgl. 20% MwSt.:").FontSize(10);
                        row.ConstantItem(100).AlignRight().Text($"€ {mwst:N2}").FontSize(10);
                    });

                    // Deposit deductions
                    if (invoice.DepositAmount > 0)
                    {
                        summaryColumn.Item().PaddingTop(4).Row(row =>
                        {
                            row.RelativeItem().Text($"- Anzahlung vom {invoice.DepositPaidOn:dd.MM.yyyy}:").FontSize(10);
                            row.ConstantItem(100).AlignRight().Text($"€ {anzahlungNetto:N2}").FontSize(10);
                        });

                        summaryColumn.Item().PaddingTop(4).Row(row =>
                        {
                            row.RelativeItem().Text("- Umsatzsteuer Anzahlung:").FontSize(10);
                            row.ConstantItem(100).AlignRight().Text($"€ {anzahlungMwst:N2}").FontSize(10);
                        });
                    }

                    // Total with highlight
                    summaryColumn.Item().PaddingTop(8).Background(INVOICE_COLOR).Padding(8).Row(row =>
                    {
                        row.RelativeItem().Text(invoice.DepositAmount > 0 ? "Restbetrag:" : "Betrag:")
                            .FontSize(12).Bold().FontColor(Colors.White);
                        row.ConstantItem(100).AlignRight().Text($"€ {restbetrag:N2}")
                            .FontSize(12).Bold().FontColor(Colors.White);
                    });
                }
                else
                {
                    // For Bauleistung, show netto in bold
                    summaryColumn.Item().PaddingTop(8).Background(INVOICE_COLOR).Padding(8).Row(row =>
                    {
                        row.RelativeItem().Text("Nettobetrag:")
                            .FontSize(12).Bold().FontColor(Colors.White);
                        row.ConstantItem(100).AlignRight().Text($"€ {nettoBetrag:N2}")
                            .FontSize(12).Bold().FontColor(Colors.White);
                    });
                }
            });

            // Tax notice
            column.Item().PaddingTop(15).Text(text =>
            {
                if (invoice.Type == "D")
                {
                    text.Span("Zahlbar nach Erhalt der Rechnung").FontSize(9).Italic().FontColor(GRAY_MEDIUM);
                }
                else
                {
                    text.Span("Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG ")
                        .FontSize(9).Italic().FontColor(GRAY_MEDIUM);
                    text.Span("auf den Leistungsempfänger übergeht")
                        .FontSize(9).Italic().FontColor(GRAY_MEDIUM);
                }
            });
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignBottom().Column(column =>
        {
            column.Item().PaddingBottom(10).LineHorizontal(1).LineColor(GRAY_MEDIUM);
            
            column.Item().PaddingTop(10).Row(row =>
            {
                // Company details
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Melchior-Erdbau").FontSize(8).Bold();
                    col.Item().Text(COMPANY_ADDRESS).FontSize(8).FontColor(GRAY_DARK);
                    col.Item().Text(COMPANY_CITY).FontSize(8).FontColor(GRAY_DARK);
                });

                // Tax info
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text($"UID: {COMPANY_UID}").FontSize(8).FontColor(GRAY_DARK);
                    col.Item().Text($"Steuernummer: {COMPANY_TAX_NUMBER}").FontSize(8).FontColor(GRAY_DARK);
                    col.Item().Text($"Inhaber: {COMPANY_OWNER}").FontSize(8).FontColor(GRAY_DARK);
                });

                // Banking info
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(COMPANY_BANK).FontSize(8).FontColor(GRAY_DARK);
                    col.Item().Text($"IBAN: {COMPANY_IBAN}").FontSize(8).FontColor(GRAY_DARK);
                    col.Item().Text($"BIC: {COMPANY_BIC}").FontSize(8).FontColor(GRAY_DARK);
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
            column.Item().Row(row =>
            {
                if (File.Exists(LOGO_PATH))
                {
                    row.ConstantItem(100).Image(LOGO_PATH).FitWidth();
                    column.Spacing(10);// Spacer
                }
            });
            
            // Top section with logo, company and customer info
            column.Item().Row(row =>
            {
                // Left: Company info
                row.RelativeItem().Column(leftColumn =>
                {
                    leftColumn.Item().Text(COMPANY_NAME)
                        .FontSize(20)
                        .Bold()
                        .FontColor(CONTRACT_COLOR);
                    
                    leftColumn.Item().PaddingTop(8).Text(text =>
                    {
                        text.Span(COMPANY_ADDRESS).FontSize(9);
                        text.Span("\n");
                        text.Span(COMPANY_CITY).FontSize(9);
                    });

                    leftColumn.Item().PaddingTop(8).Text(text =>
                    {
                        text.Span("Tel: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(COMPANY_PHONE).FontSize(9);
                        text.Span("\n");
                        text.Span("E-Mail: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(COMPANY_EMAIL).FontSize(9);
                        text.Span("\n");
                        text.Span("Web: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(COMPANY_WEB).FontSize(9);
                    });
                });

                // Right: Customer info
                row.RelativeItem().Column(rightColumn =>
                {
                    rightColumn.Item().AlignRight().Text("ANGEBOT")
                        .FontSize(28)
                        .Bold()
                        .FontColor(CONTRACT_COLOR);

                    if (contract.Customer != null)
                    {
                        rightColumn.Item().PaddingTop(12).AlignRight().Text(text =>
                        {
                            var customerName = $"{contract.Customer.Firstname} {contract.Customer.Surname}".Trim();
                            text.Span(customerName).Bold().FontSize(11);
                            text.Span("\n");
                            text.Span($"{contract.Customer.Address} {contract.Customer.Nr}").FontSize(9);
                            text.Span("\n");
                            text.Span($"{contract.Customer.Plz} {contract.Customer.City}").FontSize(9);
                            
                            if (!string.IsNullOrWhiteSpace(contract.Customer.Uid))
                            {
                                text.Span("\n");
                                text.Span($"UID: {contract.Customer.Uid}").FontSize(9);
                            }
                        });
                    }
                });
            });

            // Divider
            column.Item().PaddingTop(20).PaddingBottom(15).LineHorizontal(2).LineColor(CONTRACT_COLOR);

            // Contract metadata in a modern card-style layout
            column.Item().Background(GRAY_LIGHT).Padding(12).Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(text =>
                    {
                        text.Span("Angebot Nr. ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span($"#{contract.ContractId:D5}").FontSize(11).Bold();
                    });
                    col.Item().PaddingTop(4).Text(text =>
                    {
                        text.Span("Kunde Nr. ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span($"{contract.Customer?.CustomerId}").FontSize(9);
                    });
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().Text(text =>
                    {
                        text.Span("Datum: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(contract.CreatedAt.ToString("dd.MM.yyyy")).FontSize(9);
                    });
                    col.Item().PaddingTop(4).Text(text =>
                    {
                        text.Span("Status: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span(contract.Accepted ? "Angenommen" : "Ausstehend")
                            .FontSize(9).Bold()
                            .FontColor(contract.Accepted ? Colors.Green.Medium : CONTRACT_COLOR);
                    });
                });

                row.RelativeItem().Column(col =>
                {
                    col.Item().AlignRight().Text(text =>
                    {
                        text.Span("Gültigkeit: ").FontSize(9).FontColor(GRAY_MEDIUM);
                        text.Span("10 Tage").FontSize(9).Bold().FontColor(CONTRACT_COLOR);
                    });
                });
            });
        });
    }

    private void ComposeContractContent(IContainer container, ContractDto contract)
    {
        container.PaddingTop(20).Column(column =>
        {
            // Positions table with modern styling
            column.Item().Table(table =>
            {
                // Define columns
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(40); // Pos
                    columns.RelativeColumn(4); // Description
                    columns.ConstantColumn(80); // Unit Price
                    columns.ConstantColumn(60); // Quantity
                    columns.ConstantColumn(90); // Total
                });

                // Header with modern styling
                table.Header(header =>
                {
                    header.Cell().Background(CONTRACT_COLOR).Padding(8).Text("Pos")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(CONTRACT_COLOR).Padding(8).Text("Beschreibung")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(CONTRACT_COLOR).Padding(8).AlignRight().Text("Einzelpreis")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(CONTRACT_COLOR).Padding(8).AlignCenter().Text("Anzahl")
                        .FontSize(10).Bold().FontColor(Colors.White);
                    
                    header.Cell().Background(CONTRACT_COLOR).Padding(8).AlignRight().Text("Gesamtpreis")
                        .FontSize(10).Bold().FontColor(Colors.White);
                });

                // Rows with alternating colors
                int index = 0;
                foreach (var position in contract.Positions ?? Enumerable.Empty<ContractPositionDto>())
                {
                    index++;
                    var bgColor = index % 2 == 0 ? GRAY_LIGHT : Colors.White;
                    var lineTotal = (decimal)position.Amount * (decimal)(position.Position?.Price ?? 0);

                    table.Cell().Background(bgColor).Padding(8).AlignCenter()
                        .Text(index.ToString()).FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8)
                        .Text(position.Position?.Text ?? "-").FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8).AlignRight()
                        .Text($"€ {position.Position?.Price:N2}").FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8).AlignCenter()
                        .Text($"{position.Amount:N2} {position.Position?.Unit ?? ""}").FontSize(9);
                    
                    table.Cell().Background(bgColor).Padding(8).AlignRight()
                        .Text($"€ {lineTotal:N2}").FontSize(9).Bold();
                }
            });

            // Summary section with modern calculations
            column.Item().PaddingTop(20).AlignRight().Width(300).Column(summaryColumn =>
            {
                var nettoBetrag = CalculateContractNetto(contract);
                var mwst = nettoBetrag * 0.2m;
                var gesamtBetrag = nettoBetrag + mwst;

                // Nettobetrag
                summaryColumn.Item().Row(row =>
                {
                    row.RelativeItem().Text("Nettobetrag:").FontSize(10);
                    row.ConstantItem(100).AlignRight().Text($"€ {nettoBetrag:N2}").FontSize(10);
                });

                // MwSt
                summaryColumn.Item().PaddingTop(4).Row(row =>
                {
                    row.RelativeItem().Text("zzgl. 20% MwSt.:").FontSize(10);
                    row.ConstantItem(100).AlignRight().Text($"€ {mwst:N2}").FontSize(10);
                });

                // Total with highlight
                summaryColumn.Item().PaddingTop(8).Background(CONTRACT_COLOR).Padding(8).Row(row =>
                {
                    row.RelativeItem().Text("Gesamtbetrag:")
                        .FontSize(12).Bold().FontColor(Colors.White);
                    row.ConstantItem(100).AlignRight().Text($"€ {gesamtBetrag:N2}")
                        .FontSize(12).Bold().FontColor(Colors.White);
                });
            });

            // Validity notice
            column.Item().PaddingTop(15).Text(text =>
            {
                text.Span("Dieses Angebot ist 10 Tage lang gültig.").FontSize(9).Italic().FontColor(GRAY_MEDIUM);
            });
        });
    }

    private decimal CalculateContractNetto(ContractDto contract)
    {
        if (contract.Positions == null) return 0;
        return contract.Positions.Sum(p => (decimal)p.Amount * (decimal)(p.Position?.Price ?? 0));
    }
}
