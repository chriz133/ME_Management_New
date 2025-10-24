using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Server.BusinessObjects.Entities;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service implementation for generating professional PDF documents.
/// Uses QuestPDF to create clean, business-ready invoices and offers.
/// </summary>
public class PdfService : IPdfService
{
    public PdfService()
    {
        // Configure QuestPDF license (Community license is free for open-source and small businesses)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GenerateInvoicePdf(Invoice invoice)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(50);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(ComposeHeader);

                page.Content().Column(column =>
                {
                    column.Spacing(10);

                    // Invoice title and info
                    column.Item().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("RECHNUNG").FontSize(24).Bold();
                            col.Item().Text($"Rechnungsnummer: {invoice.InvoiceNumber}").FontSize(12);
                            col.Item().Text($"Rechnungsdatum: {invoice.InvoiceDate:dd.MM.yyyy}").FontSize(12);
                            col.Item().Text($"Fälligkeitsdatum: {invoice.DueDate:dd.MM.yyyy}").FontSize(12);
                        });
                    });

                    column.Item().PaddingTop(20);

                    // Customer information
                    column.Item().Column(col =>
                    {
                        col.Item().Text("Kunde:").Bold().FontSize(11);
                        col.Item().Text(invoice.Customer.Name).FontSize(11);
                        col.Item().Text(invoice.Customer.Address);
                        col.Item().Text($"{invoice.Customer.PostalCode} {invoice.Customer.City}");
                        if (!string.IsNullOrEmpty(invoice.Customer.Country))
                            col.Item().Text(invoice.Customer.Country);
                        if (!string.IsNullOrEmpty(invoice.Customer.TaxId))
                            col.Item().Text($"USt-IdNr: {invoice.Customer.TaxId}");
                    });

                    column.Item().PaddingTop(20);

                    // Line items table
                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(40);  // Line number
                            columns.RelativeColumn(3);   // Description
                            columns.ConstantColumn(60);  // Quantity
                            columns.ConstantColumn(50);  // Unit
                            columns.ConstantColumn(80);  // Unit Price
                            columns.ConstantColumn(80);  // Total
                        });

                        // Header
                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Pos.").Bold();
                            header.Cell().Element(CellStyle).Text("Beschreibung").Bold();
                            header.Cell().Element(CellStyle).Text("Menge").Bold();
                            header.Cell().Element(CellStyle).Text("Einheit").Bold();
                            header.Cell().Element(CellStyle).Text("Einzelpreis").Bold();
                            header.Cell().Element(CellStyle).Text("Gesamt").Bold();

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                            }
                        });

                        // Line items
                        var orderedItems = invoice.LineItems.OrderBy(li => li.LineNumber).ToList();
                        foreach (var item in orderedItems)
                        {
                            var lineTotal = item.Quantity * item.UnitPrice;

                            table.Cell().Element(CellStyle).Text(item.LineNumber.ToString());
                            table.Cell().Element(CellStyle).Text(item.Description);
                            table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity.ToString("N2"));
                            table.Cell().Element(CellStyle).Text(item.Unit);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitPrice:N2} €");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{lineTotal:N2} €");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten3).PaddingVertical(5);
                            }
                        }
                    });

                    column.Item().PaddingTop(10);

                    // Summary section
                    column.Item().AlignRight().Column(summaryColumn =>
                    {
                        var netTotal = invoice.LineItems.Sum(li => li.Quantity * li.UnitPrice);
                        var taxGroups = invoice.LineItems
                            .GroupBy(li => li.TaxRate)
                            .Select(g => new
                            {
                                TaxRate = g.Key,
                                NetAmount = g.Sum(li => li.Quantity * li.UnitPrice),
                                TaxAmount = g.Sum(li => li.Quantity * li.UnitPrice * li.TaxRate / 100)
                            })
                            .ToList();
                        var taxTotal = taxGroups.Sum(t => t.TaxAmount);
                        var grossTotal = netTotal + taxTotal;

                        summaryColumn.Item().Width(250).Row(row =>
                        {
                            row.RelativeItem().Text("Nettobetrag:");
                            row.ConstantItem(100).AlignRight().Text($"{netTotal:N2} €");
                        });

                        foreach (var taxGroup in taxGroups)
                        {
                            summaryColumn.Item().Width(250).Row(row =>
                            {
                                row.RelativeItem().Text($"MwSt. {taxGroup.TaxRate:N0}%:");
                                row.ConstantItem(100).AlignRight().Text($"{taxGroup.TaxAmount:N2} €");
                            });
                        }

                        summaryColumn.Item().Width(250).BorderTop(2).PaddingTop(5).Row(row =>
                        {
                            row.RelativeItem().Text("Gesamtbetrag:").Bold();
                            row.ConstantItem(100).AlignRight().Text($"{grossTotal:N2} €").Bold();
                        });
                    });

                    // Notes
                    if (!string.IsNullOrEmpty(invoice.Notes))
                    {
                        column.Item().PaddingTop(20).Column(col =>
                        {
                            col.Item().Text("Anmerkungen:").Bold();
                            col.Item().Text(invoice.Notes);
                        });
                    }
                });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Bitte überweisen Sie den Betrag innerhalb von 14 Tagen. Vielen Dank für Ihr Vertrauen!").FontSize(9);
                });
            });
        });

        return document.GeneratePdf();
    }

    public byte[] GenerateOfferPdf(Offer offer)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(50);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(ComposeHeader);

                page.Content().Column(column =>
                {
                    column.Spacing(10);

                    // Offer title and info
                    column.Item().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("ANGEBOT").FontSize(24).Bold();
                            col.Item().Text($"Angebotsnummer: {offer.OfferNumber}").FontSize(12);
                            col.Item().Text(offer.Title).FontSize(14).Bold();
                            col.Item().Text($"Angebotsdatum: {offer.OfferDate:dd.MM.yyyy}").FontSize(12);
                            col.Item().Text($"Gültig bis: {offer.ValidUntil:dd.MM.yyyy}").FontSize(12);
                        });
                    });

                    column.Item().PaddingTop(20);

                    // Customer information
                    column.Item().Column(col =>
                    {
                        col.Item().Text("Kunde:").Bold().FontSize(11);
                        col.Item().Text(offer.Customer.Name).FontSize(11);
                        col.Item().Text(offer.Customer.Address);
                        col.Item().Text($"{offer.Customer.PostalCode} {offer.Customer.City}");
                        if (!string.IsNullOrEmpty(offer.Customer.Country))
                            col.Item().Text(offer.Customer.Country);
                        if (!string.IsNullOrEmpty(offer.Customer.TaxId))
                            col.Item().Text($"USt-IdNr: {offer.Customer.TaxId}");
                    });

                    column.Item().PaddingTop(20);

                    // Line items table
                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(40);  // Line number
                            columns.RelativeColumn(3);   // Description
                            columns.ConstantColumn(60);  // Quantity
                            columns.ConstantColumn(50);  // Unit
                            columns.ConstantColumn(80);  // Unit Price
                            columns.ConstantColumn(80);  // Total
                        });

                        // Header
                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Pos.").Bold();
                            header.Cell().Element(CellStyle).Text("Beschreibung").Bold();
                            header.Cell().Element(CellStyle).Text("Menge").Bold();
                            header.Cell().Element(CellStyle).Text("Einheit").Bold();
                            header.Cell().Element(CellStyle).Text("Einzelpreis").Bold();
                            header.Cell().Element(CellStyle).Text("Gesamt").Bold();

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                            }
                        });

                        // Line items
                        var orderedItems = offer.LineItems.OrderBy(li => li.LineNumber).ToList();
                        foreach (var item in orderedItems)
                        {
                            var lineTotal = item.Quantity * item.UnitPrice;

                            table.Cell().Element(CellStyle).Text(item.LineNumber.ToString());
                            table.Cell().Element(CellStyle).Text(item.Description);
                            table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity.ToString("N2"));
                            table.Cell().Element(CellStyle).Text(item.Unit);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitPrice:N2} €");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{lineTotal:N2} €");

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten3).PaddingVertical(5);
                            }
                        }
                    });

                    column.Item().PaddingTop(10);

                    // Summary section
                    column.Item().AlignRight().Column(summaryColumn =>
                    {
                        var netTotal = offer.LineItems.Sum(li => li.Quantity * li.UnitPrice);
                        var taxGroups = offer.LineItems
                            .GroupBy(li => li.TaxRate)
                            .Select(g => new
                            {
                                TaxRate = g.Key,
                                NetAmount = g.Sum(li => li.Quantity * li.UnitPrice),
                                TaxAmount = g.Sum(li => li.Quantity * li.UnitPrice * li.TaxRate / 100)
                            })
                            .ToList();
                        var taxTotal = taxGroups.Sum(t => t.TaxAmount);
                        var grossTotal = netTotal + taxTotal;

                        summaryColumn.Item().Width(250).Row(row =>
                        {
                            row.RelativeItem().Text("Nettobetrag:");
                            row.ConstantItem(100).AlignRight().Text($"{netTotal:N2} €");
                        });

                        foreach (var taxGroup in taxGroups)
                        {
                            summaryColumn.Item().Width(250).Row(row =>
                            {
                                row.RelativeItem().Text($"MwSt. {taxGroup.TaxRate:N0}%:");
                                row.ConstantItem(100).AlignRight().Text($"{taxGroup.TaxAmount:N2} €");
                            });
                        }

                        summaryColumn.Item().Width(250).BorderTop(2).PaddingTop(5).Row(row =>
                        {
                            row.RelativeItem().Text("Gesamtbetrag:").Bold();
                            row.ConstantItem(100).AlignRight().Text($"{grossTotal:N2} €").Bold();
                        });
                    });

                    // Notes
                    if (!string.IsNullOrEmpty(offer.Notes))
                    {
                        column.Item().PaddingTop(20).Column(col =>
                        {
                            col.Item().Text("Anmerkungen:").Bold();
                            col.Item().Text(offer.Notes);
                        });
                    }
                });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Wir freuen uns auf Ihre Rückmeldung und eine erfolgreiche Zusammenarbeit!").FontSize(9);
                });
            });
        });

        return document.GeneratePdf();
    }

    /// <summary>
    /// Compose the header with company information.
    /// This would typically include company logo, name, address, contact details.
    /// </summary>
    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("ME Management GmbH").FontSize(16).Bold();
                column.Item().Text("Musterstraße 123");
                column.Item().Text("12345 Musterstadt");
                column.Item().Text("Deutschland");
            });

            row.RelativeItem().AlignRight().Column(column =>
            {
                column.Item().Text("Tel: +49 123 456789");
                column.Item().Text("Email: info@me-management.de");
                column.Item().Text("Web: www.me-management.de");
                column.Item().Text("USt-IdNr: DE123456789");
            });
        });
    }
}
