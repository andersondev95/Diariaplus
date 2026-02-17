import jsPDF from 'jspdf';
import { Diaria } from '../lib/database';

export function exportToPDF(empresa: string, diarias: Diaria[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addPage = () => {
    doc.addPage();
    yPosition = margin;
  };

  doc.setFillColor(30, 90, 160);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('RELATÓRIO DE DIÁRIAS', margin, 18);

  doc.setFontSize(14);
  doc.text(empresa, margin, 28);

  yPosition = 50;

  doc.setTextColor(30, 90, 160);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Data de Geração', margin, yPosition);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(new Date().toLocaleDateString('pt-BR'), margin + 50, yPosition);

  yPosition += 12;

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(30, 90, 160);
  doc.setFontSize(12);
  doc.text('Diárias Registradas', margin, yPosition);

  yPosition += 15;

  const tableY = yPosition;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(30, 90, 160);

  const colWidths = [contentWidth * 0.3, contentWidth * 0.35, contentWidth * 0.35];
  let cellY = tableY;
  const rowHeight = 8;

  doc.rect(margin, cellY, colWidths[0], rowHeight, 'F');
  doc.rect(margin + colWidths[0], cellY, colWidths[1], rowHeight, 'F');
  doc.rect(
    margin + colWidths[0] + colWidths[1],
    cellY,
    colWidths[2],
    rowHeight,
    'F'
  );

  doc.text('Data', margin + 2, cellY + 5);
  doc.text('Motorista', margin + colWidths[0] + 2, cellY + 5);
  doc.text('Valor', margin + colWidths[0] + colWidths[1] + 2, cellY + 5);

  cellY += rowHeight;

  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  let rowCount = 0;
  diarias.forEach((diaria, index) => {
    if (cellY > pageHeight - 40) {
      addPage();
      cellY = yPosition;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(30, 90, 160);

      doc.rect(margin, cellY, colWidths[0], rowHeight, 'F');
      doc.rect(margin + colWidths[0], cellY, colWidths[1], rowHeight, 'F');
      doc.rect(
        margin + colWidths[0] + colWidths[1],
        cellY,
        colWidths[2],
        rowHeight,
        'F'
      );

      doc.text('Data', margin + 2, cellY + 5);
      doc.text('Motorista', margin + colWidths[0] + 2, cellY + 5);
      doc.text('Valor', margin + colWidths[0] + colWidths[1] + 2, cellY + 5);

      cellY += rowHeight;
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      rowCount = 0;
    }

    const date = new Date(diaria.data + 'T00:00:00').toLocaleDateString('pt-BR');
    const motorista = diaria.motorista || '-';
    const valor = `R$ ${Number(diaria.valor).toFixed(2)}`;

    const bgColor = rowCount % 2 === 0 ? 245 : 255;
    doc.setFillColor(bgColor, bgColor, bgColor);
    doc.rect(margin, cellY, contentWidth, rowHeight, 'F');

    doc.setTextColor(0, 0, 0);
    doc.text(date, margin + 2, cellY + 5);
    doc.text(motorista, margin + colWidths[0] + 2, cellY + 5);
    doc.text(valor, margin + colWidths[0] + colWidths[1] + 2, cellY + 5);

    cellY += rowHeight;
    rowCount++;
  });

  cellY += 10;

  if (cellY > pageHeight - 60) {
    addPage();
  }

  const totalPago = diarias
    .filter(d => d.situacao === 'Pago')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const totalPendente = diarias
    .filter(d => d.situacao === 'Pendente')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const totalAReceber = diarias
    .filter(d => d.situacao === 'A Receber')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const total = totalPago + totalPendente + totalAReceber;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 90, 160);
  doc.text('Resumo Financeiro', margin, cellY);

  cellY += 10;

  const summaryBoxHeight = 30;
  const boxWidth = contentWidth / 3 - 2;

  doc.setFillColor(220, 240, 255);
  doc.rect(margin, cellY, boxWidth, summaryBoxHeight, 'F');
  doc.setTextColor(30, 90, 160);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Pago', margin + 3, cellY + 6);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`R$ ${totalPago.toFixed(2)}`, margin + 3, cellY + 16);

  doc.setFillColor(255, 250, 205);
  doc.rect(margin + boxWidth + 2, cellY, boxWidth, summaryBoxHeight, 'F');
  doc.setTextColor(184, 134, 11);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Pendente', margin + boxWidth + 5, cellY + 6);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `R$ ${totalPendente.toFixed(2)}`,
    margin + boxWidth + 5,
    cellY + 16
  );

  doc.setFillColor(255, 220, 220);
  doc.rect(margin + boxWidth * 2 + 4, cellY, boxWidth, summaryBoxHeight, 'F');
  doc.setTextColor(220, 20, 20);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('A Receber', margin + boxWidth * 2 + 7, cellY + 6);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `R$ ${totalAReceber.toFixed(2)}`,
    margin + boxWidth * 2 + 7,
    cellY + 16
  );

  cellY += summaryBoxHeight + 5;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, cellY, pageWidth - margin, cellY);

  cellY += 5;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 90, 160);
  doc.text('Total', margin, cellY);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`R$ ${total.toFixed(2)}`, pageWidth - margin - 40, cellY);

  const filename = `relatorio_${empresa.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
