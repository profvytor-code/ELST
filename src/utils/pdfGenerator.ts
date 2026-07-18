import { jsPDF } from 'jspdf';
import { ExamResult, Section, Exercise } from '../types';

export function generateExamPDF(
  studentName: string,
  result: ExamResult,
  sections: Section[],
  exercises: Exercise[],
  forTeacher: boolean = false
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Color Palette
  const primaryColor = [17, 24, 39]; // Slate 900
  const secondaryColor = [79, 70, 229]; // Indigo 600
  const lightGray = [243, 244, 246]; // Gray 100
  const darkGray = [75, 85, 99]; // Gray 600
  const accentColor = [16, 185, 129]; // Emerald 500

  // Helper to set color
  const setFillColor = (rgb: number[]) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setTextColor = (rgb: number[]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setDrawColor = (rgb: number[]) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);

  let y = 15;

  // --- HEADER SECTION ---
  setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('ELST - English Linguistic Structure Test', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(199, 210, 254);
  doc.text('Relatório Oficial de Desempenho e Avaliação', 15, 25);

  const dateStr = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(10);
  doc.text(`Data: ${dateStr}`, 160, 25);

  y = 50;

  // --- STUDENT METRICS SUMMARY ---
  setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Resumo do Candidato', 15, y);
  
  // Underline
  setDrawColor(secondaryColor);
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  // Info Grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setTextColor(primaryColor);
  doc.text('Estudante:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(studentName || 'Aluno Anônimo', 40, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Nota Final:', 120, y);
  setTextColor(accentColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${result.score.toFixed(1)} / 10.0`, 145, y - 0.5);
  
  y += 6;
  doc.setFontSize(10);
  setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Tempo Total:', 15, y);
  doc.setFont('helvetica', 'normal');
  const totalMins = Math.floor(result.timeSpentSeconds / 60);
  const totalSecs = result.timeSpentSeconds % 60;
  doc.text(`${totalMins}m ${totalSecs}s`, 40, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Tempo Médio:', 120, y);
  doc.setFont('helvetica', 'normal');
  const avgSecs = result.averageTimePerQuestion;
  doc.text(`${avgSecs.toFixed(1)}s por questão`, 145, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Em Branco:', 15, y);
  doc.setFont('helvetica', 'normal');
  setTextColor(result.blankCount > 0 ? [239, 68, 68] : primaryColor);
  doc.text(`${result.blankCount} questão(ões)`, 40, y);

  setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Mais Demorada:', 120, y);
  doc.setFont('helvetica', 'normal');
  const titleTruncated = result.mostTimeConsumingExerciseTitle.length > 25 
    ? result.mostTimeConsumingExerciseTitle.substring(0, 22) + '...'
    : result.mostTimeConsumingExerciseTitle;
  doc.text(`${titleTruncated} (${result.mostTimeConsumingSeconds}s)`, 150, y);

  y += 12;

  // --- GRAMMAR SECTION BREAKDOWN ---
  setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Desempenho por Categoria de Gramática', 15, y);
  
  setDrawColor(secondaryColor);
  doc.line(15, y + 2, 195, y + 2);
  y += 8;

  // Table Headers
  setFillColor(lightGray);
  doc.rect(15, y, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setTextColor(primaryColor);
  doc.text('Seção / Categoria', 18, y + 5.5);
  doc.text('Questões', 105, y + 5.5);
  doc.text('Acertos', 135, y + 5.5);
  doc.text('Aproveitamento', 165, y + 5.5);
  
  y += 8;

  result.sectionGrades.forEach((secGrade) => {
    let rowHeight = 11;
    const hasRating = secGrade.understandingRating !== undefined && secGrade.understandingRating > 0;
    if (hasRating) {
      rowHeight = 14;
    }

    // Row background border
    setDrawColor([229, 231, 235]);
    doc.line(15, y + rowHeight - 3, 195, y + rowHeight - 3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setTextColor(primaryColor);
    doc.text(secGrade.sectionName, 18, y + 4.5);
    doc.setFont('helvetica', 'normal');
    setTextColor(darkGray);
    doc.text(`(${secGrade.grammarCategory})`, 18, y + 8);

    if (hasRating) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor([217, 119, 6]); // Amber 700
      const starsStr = '★'.repeat(secGrade.understandingRating || 0) + '☆'.repeat(5 - (secGrade.understandingRating || 0));
      doc.text(`Autoavaliação: ${starsStr} (${secGrade.understandingRating}/5)`, 18, y + 11.5);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setTextColor(primaryColor);
    doc.text(`${secGrade.totalQuestions}`, 105, y + 5);
    doc.text(`${secGrade.correctCount}`, 135, y + 5);
    
    const percentage = secGrade.totalQuestions > 0 
      ? (secGrade.correctCount / secGrade.totalQuestions) * 100 
      : 0;
    doc.setFont('helvetica', 'bold');
    if (percentage >= 70) setTextColor(accentColor);
    else if (percentage >= 50) setTextColor([245, 158, 11]); // Amber 500
    else setTextColor([239, 68, 68]); // Red 500

    doc.text(`${percentage.toFixed(0)}% (Nota ${secGrade.grade.toFixed(1)})`, 165, y + 5);
    
    y += rowHeight;
  });

  y += 5;

  // --- DETAILLED QUESTION REPORT ---
  if (forTeacher) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Relatório Detalhado das Questões', 15, y);
    setDrawColor(secondaryColor);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    result.detailedResponses.forEach((res, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Border around each exercise log
      setFillColor([249, 250, 251]); // ultra-light gray
      doc.rect(15, y, 180, 26, 'F');
      setDrawColor([229, 231, 235]);
      doc.rect(15, y, 180, 26, 'D');

      // Number & Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      setTextColor(primaryColor);
      doc.text(`${index + 1}. ${res.exerciseTitle}`, 18, y + 5);

      // Section indicator
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      setTextColor(darkGray);
      doc.text(`[${res.sectionName}]`, 140, y + 5);

      // Correct / Incorrect badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      if (res.isLeftBlank) {
        setTextColor([239, 68, 68]);
        doc.text('EM BRANCO', 168, y + 5);
      } else if (res.isCorrect) {
        setTextColor(accentColor);
        doc.text('ACERTOU', 172, y + 5);
      } else {
        setTextColor([239, 68, 68]);
        doc.text('ERROU', 174, y + 5);
      }

      // Student choice & Correct answer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setTextColor(primaryColor);
      
      let studentAnsText = res.studentAnswer || '(Nenhuma)';
      if (studentAnsText.length > 55) studentAnsText = studentAnsText.substring(0, 52) + '...';
      
      let correctAnsText = res.correctAnswer;
      if (correctAnsText.length > 55) correctAnsText = correctAnsText.substring(0, 52) + '...';

      doc.text('Sua resposta:', 18, y + 11);
      doc.setFont('helvetica', 'bold');
      doc.text(studentAnsText, 45, y + 11);

      doc.setFont('helvetica', 'normal');
      doc.text('Resposta correta:', 18, y + 16);
      doc.setFont('helvetica', 'bold');
      setTextColor(secondaryColor);
      doc.text(correctAnsText, 45, y + 16);

      // Metrics for this question
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      setTextColor(darkGray);
      doc.text(`Tempo gasto: ${res.timeSpentSeconds} segundos`, 18, y + 22);

      // Show self evaluation rating
      const ratingStars = '★'.repeat(res.understandingRating) + '☆'.repeat(5 - res.understandingRating);
      doc.text(`Entendimento Autoavaliado: ${ratingStars} (${res.understandingRating}/5)`, 110, y + 22);

      y += 30;
    });
  }

  // Footer for pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setTextColor(darkGray);
    doc.text(`ELST - English Linguistic Structure Test | Página ${i} de ${totalPages}`, 15, 287);
    doc.text('Gerado automaticamente pelo Sistema de Provas ELST.', 115, 287);
  }

  return doc;
}
