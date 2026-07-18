import React, { useState } from 'react';
import { ExamResult, Section, Exercise } from '../types';
import { generateExamPDF } from '../utils/pdfGenerator';
import { CheckCircle, AlertCircle, FileText, Download, Send, RefreshCw, Star, Info, Mail, Clock, HelpCircle, ArrowUpRight } from 'lucide-react';

interface StudentResultsProps {
  result: ExamResult;
  sections: Section[];
  exercises: Exercise[];
  studentName: string;
  onRestart: () => void;
  onExit: () => void;
}

export default function StudentResults({
  result,
  sections,
  exercises,
  studentName,
  onRestart,
  onExit
}: StudentResultsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Trigger PDF Download
  const handleDownloadPDF = () => {
    const doc = generateExamPDF(studentName, result, sections, exercises, false);
    const fileName = `ELST_Resultados_${studentName.replace(/\s+/g, '_') || 'Aluno'}.pdf`;
    doc.save(fileName);
  };

  // Generate result key Base64
  const getResultKey = () => {
    try {
      const resultKeyObj = { studentName, result };
      return btoa(encodeURIComponent(JSON.stringify(resultKeyObj)));
    } catch (e) {
      return '';
    }
  };

  const handleCopyKey = () => {
    const key = getResultKey();
    if (key) {
      navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Determine feedback message based on score
  const getFeedbackMessage = (score: number) => {
    if (score >= 9.0) return { title: 'Desempenho Extraordinário!', text: 'Parabéns! Você demonstrou domínio impecável sobre os tópicos de gramática avaliados. Continue assim!', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
    if (score >= 7.0) return { title: 'Excelente Trabalho!', text: 'Ótimo resultado! Você compreende bem a maior parte dos conteúdos. Revise pequenos pontos para gabaritar.', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' };
    if (score >= 5.0) return { title: 'Bom Caminho, Continue Estudando!', text: 'Resultado razoável. Algumas categorias precisam de um pouco mais de atenção e exercícios adicionais.', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
    return { title: 'Atenção e Foco nos Estudos!', text: 'Sua pontuação ficou abaixo do esperado. Recomendamos rever as seções marcadas com dificuldades e refazer a avaliação.', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
  };

  const feedback = getFeedbackMessage(result.score);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-5 shadow-sm text-center">
        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Resultado Final</div>
        <h1 className="text-xl font-extrabold tracking-tight mt-1">ELST - Relatório de Desempenho</h1>
        <p className="text-xs text-slate-400 mt-1">Estudante: <span className="text-white font-semibold">{studentName || 'Aluno Anônimo'}</span></p>
      </div>

      <div className="p-4 md:p-6 space-y-6 flex-1 max-w-4xl mx-auto w-full">
        
        {/* SCORE AND MAIN FEEDBACK */}
        <div className="border rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm bg-white">
          {/* Big Square Score */}
          <div className={`w-36 h-36 rounded-2xl flex flex-col items-center justify-center border-4 flex-shrink-0 shadow-inner p-4 ${
            result.score >= 8.5 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <span className="text-4xl font-black">{result.score.toFixed(1)}</span>
            <div className="text-[10px] font-bold uppercase tracking-widest mt-1">
              Nota / 10
            </div>
            <div className={`text-[10px] font-black px-2 py-0.5 rounded mt-2 text-white ${
              result.score >= 8.5 ? 'bg-emerald-600' : 'bg-red-600'
            }`}>
              {result.score >= 8.5 ? 'APROVADO' : 'REPROVADO'}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              result.score >= 8.5 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                : 'bg-red-50 text-red-800 border border-red-100'
            }`}>
              {result.correctCount} de {result.totalQuestions} acertos
            </div>
            <h3 className={`text-base font-bold ${result.score >= 8.5 ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.score >= 8.5 ? 'Parabéns! Você foi Aprovado.' : 'Estude mais um pouco! Você ficou em Recuperação.'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Você obteve a pontuação de <span className="font-bold text-slate-700">{result.score.toFixed(1)}</span>. 
              A média para aprovação nesta avaliação oficial é <span className="font-bold text-slate-700">8.5</span>.
            </p>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tempo Total</div>
            <div className="text-lg font-black text-slate-800 mt-2 flex items-center space-x-1.5">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>{formatTime(result.timeSpentSeconds)}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Duração da prova</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tempo Médio</div>
            <div className="text-lg font-black text-slate-800 mt-2">
              {result.averageTimePerQuestion.toFixed(1)}s
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Por questão</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between col-span-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Em Branco</div>
            <div className={`text-lg font-black mt-2 ${result.blankCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {result.blankCount} qst.
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Deixadas sem preencher</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between col-span-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mais Demorada</div>
            <div className="text-sm font-bold text-slate-800 truncate mt-2">
              {result.mostTimeConsumingExerciseTitle}
            </div>
            <div className="text-[10px] text-indigo-600 font-semibold mt-1">
              Gasto: {result.mostTimeConsumingSeconds} segundos
            </div>
          </div>
        </div>

        {/* GRAMMAR BRREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Desempenho por Categoria de Gramática (Seções)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.sectionGrades.map((secGrade) => {
              const scorePct = secGrade.totalQuestions > 0 
                ? (secGrade.correctCount / secGrade.totalQuestions) * 100 
                : 0;
              return (
                <div key={secGrade.sectionId} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{secGrade.sectionName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{secGrade.grammarCategory}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Nota:</span>
                      <span className={`${
                        secGrade.grade >= 7.0 
                          ? 'text-emerald-600' 
                          : secGrade.grade >= 5.0 
                          ? 'text-amber-500' 
                          : 'text-red-500'
                      }`}>
                        {secGrade.grade.toFixed(1)} / 10.0
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          secGrade.grade >= 7.0 
                            ? 'bg-emerald-500' 
                            : secGrade.grade >= 5.0 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${scorePct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex justify-between font-semibold">
                    <span>Perguntas: {secGrade.totalQuestions}</span>
                    <span>Acertos: {secGrade.correctCount}</span>
                  </div>

                  {secGrade.understandingRating !== undefined && secGrade.understandingRating > 0 && (
                    <div className="flex items-center justify-between bg-amber-50/60 border border-amber-100/50 rounded-lg px-2 py-1 text-[10px] font-semibold text-amber-800">
                      <span>Autoavaliação:</span>
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= (secGrade.understandingRating || 0)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* OFFICIAL ACTION TRIGGER PANEL (PDF GENERATOR & STUDENT KEY) */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 rounded-lg p-2 shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">Relatório Acadêmico ELST</h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Gere o documento oficial em PDF contendo o resumo dos acertos e desempenho nas seções avaliadas.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              id="btn-download-pdf"
              className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow hover:shadow-lg active:scale-95 w-full md:w-auto"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Baixar Relatório (PDF)</span>
            </button>
          </div>

          <div className="border-t border-indigo-800/60 pt-4 space-y-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Chave/Código do Aluno</h4>
              <p className="text-[11px] text-slate-300">
                Copie a chave de resultado abaixo e envie para o seu professor. Ele poderá usar esta chave no painel dele para gerar este mesmo relatório.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={getResultKey()}
                id="input-result-key"
                className="flex-1 bg-slate-950/80 border border-indigo-950/50 text-indigo-300 rounded-xl px-3 py-2 text-xs font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                id="btn-copy-result-key"
                className={`sm:w-36 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-slate-800 hover:bg-slate-100'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copiada!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copiar Chave</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row gap-3 justify-center pb-8 pt-4">
          <button
            onClick={onExit}
            id="btn-exit-results"
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm px-8 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <span>Voltar ao Menu Inicial</span>
          </button>
        </div>
      </div>


    </div>
  );
}
