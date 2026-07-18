import React, { useState, useEffect } from 'react';
import { Section, Exercise, ExamResult, StudentAccessCode } from './types';
import { DEFAULT_SECTIONS, DEFAULT_EXERCISES } from './data';
import StudentExam from './components/StudentExam';
import StudentResults from './components/StudentResults';
import TeacherPanel from './components/TeacherPanel';
import { 
  GraduationCap, ShieldCheck, ArrowRight, 
  BookOpen, Clock, Award, Key
} from 'lucide-react';

export default function App() {
  // App routing and role state
  // 'home' | 'exam' | 'results' | 'teacher'
  const [currentRoute, setCurrentRoute] = useState<'home' | 'exam' | 'results' | 'teacher'>('home');
  
  // Student Name
  const [studentName, setStudentName] = useState<string>('');
  
  // About Modal visibility
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  
  // Active exam calculations
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Student keys / Access code states
  const [accessCodes, setAccessCodes] = useState<StudentAccessCode[]>([]);
  const [activeAccessCode, setActiveAccessCode] = useState<StudentAccessCode | null>(null);
  const [studentAccessCodeInput, setStudentAccessCodeInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Password for Teacher Mode
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Main data collections loaded from local storage or pre-seeded defaults
  const [sections, setSections] = useState<Section[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Initialize data from LocalStorage or defaults
  useEffect(() => {
    const savedSections = localStorage.getItem('lfa_sections');
    const savedExercises = localStorage.getItem('lfa_exercises');
    const savedCodes = localStorage.getItem('lfa_access_codes');

    if (savedSections && savedExercises) {
      try {
        const parsedSecs = JSON.parse(savedSections);
        const parsedExs = JSON.parse(savedExercises);
        if (parsedSecs.length < 20) {
          // Force reset to use the new 20 assessments from PDF
          setSections(DEFAULT_SECTIONS);
          setExercises(DEFAULT_EXERCISES);
          localStorage.setItem('lfa_sections', JSON.stringify(DEFAULT_SECTIONS));
          localStorage.setItem('lfa_exercises', JSON.stringify(DEFAULT_EXERCISES));
        } else {
          setSections(parsedSecs);
          setExercises(parsedExs);
        }
      } catch (e) {
        setSections(DEFAULT_SECTIONS);
        setExercises(DEFAULT_EXERCISES);
      }
    } else {
      // Seed default items
      setSections(DEFAULT_SECTIONS);
      setExercises(DEFAULT_EXERCISES);
      localStorage.setItem('lfa_sections', JSON.stringify(DEFAULT_SECTIONS));
      localStorage.setItem('lfa_exercises', JSON.stringify(DEFAULT_EXERCISES));
    }

    if (savedCodes) {
      try {
        setAccessCodes(JSON.parse(savedCodes));
      } catch (e) {
        setAccessCodes([]);
      }
    } else {
      setAccessCodes([]);
    }
  }, []);

  // Sync data function
  const handleSaveData = (updatedSections: Section[], updatedExercises: Exercise[]) => {
    setSections(updatedSections);
    setExercises(updatedExercises);
    localStorage.setItem('lfa_sections', JSON.stringify(updatedSections));
    localStorage.setItem('lfa_exercises', JSON.stringify(updatedExercises));
  };

  const handleSaveAccessCodes = (newCodes: StudentAccessCode[]) => {
    setAccessCodes(newCodes);
    localStorage.setItem('lfa_access_codes', JSON.stringify(newCodes));
  };

  // Login handler
  const handleEnterTeacherMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '95507684') {
      setPasswordError('');
      setCurrentRoute('teacher');
    } else {
      setPasswordError('Senha incorreta!');
    }
  };

  const handleStudentLoginCode = (e: React.FormEvent) => {
    e.preventDefault();
    const typedCode = studentAccessCodeInput.trim().toUpperCase();
    if (!typedCode) return;

    const matchedCode = accessCodes.find(c => c.accessCode.toUpperCase() === typedCode);
    if (!matchedCode) {
      setLoginError("Código de acesso não encontrado. Verifique com seu professor.");
      return;
    }

    setLoginError("");
    setStudentName(matchedCode.studentName);
    setActiveAccessCode(matchedCode);

    if (matchedCode.status === 'completed' && matchedCode.examResult) {
      // Direct redirect to results
      setExamResult(matchedCode.examResult);
      setCurrentRoute('results');
    } else {
      // Start exam
      if (exercises.length === 0) {
        alert("Não há exercícios cadastrados. O professor precisa criar ao menos uma questão no modo Teacher.");
        return;
      }
      setCurrentRoute('exam');
    }
  };

  // Renders the actual application core
  const renderAppContent = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <div className="flex-1 flex flex-col justify-center p-5 md:p-8 space-y-8 max-w-lg mx-auto w-full">
            
            {/* BRAND HERO LOGO */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-2xl px-5 py-2 h-14 shadow-lg shadow-indigo-200 font-black text-2xl tracking-wider select-none animate-bounce">
                ELST
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">ELST</h2>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">English Linguistic Structure Test</p>
              <p className="text-[11px] font-bold text-slate-500">Desenvolvido por Vytor Fonte</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Plataforma integrada de testes dinâmicos com análise gramatical imediata e relatórios acadêmicos.
              </p>
            </div>

            {/* SELECTION TABS */}
            <div className="grid grid-cols-1 gap-5">
              
              {/* STUDENT LOGIN CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Modo Aluno (Student Exam)</h3>
                    <p className="text-[10px] text-slate-400">Insira seu código de acesso oficial para iniciar.</p>
                  </div>
                </div>

                <form onSubmit={handleStudentLoginCode} className="space-y-3" id="form-student-login">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Código de Acesso do Aluno</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={studentAccessCodeInput}
                        onChange={(e) => {
                          setStudentAccessCodeInput(e.target.value.toUpperCase());
                          setLoginError('');
                        }}
                        id="input-student-access-code"
                        className="w-full text-xs p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-bold text-slate-800 uppercase"
                        placeholder="Ex: ELST-ABCD"
                      />
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 p-2 rounded-lg text-center animate-fade-in">
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    id="btn-student-submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow hover:shadow-lg flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    <span>Acessar Avaliação</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* TEACHER LOGIN CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-550/10 text-indigo-950 p-2.5 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-indigo-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Modo Teacher (Professor)</h3>
                    <p className="text-[10px] text-slate-400">Crie, delete, ordene e renomeie seções ou exercícios ricos.</p>
                  </div>
                </div>

                <form onSubmit={handleEnterTeacherMode} className="space-y-3" id="form-teacher-login">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Senha do Professor</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      id="input-teacher-password"
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
                      placeholder="Insira a senha de acesso..."
                    />
                  </div>

                  {passwordError && (
                    <p className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 p-2 rounded-lg text-center">
                      {passwordError}
                    </p>
                  )}

                  <button
                    type="submit"
                    id="btn-teacher-submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    <span>Acessar Painel Docente</span>
                  </button>
                </form>
              </div>

            </div>

            {/* PLATFORM BULLET ADVANTAGES */}
            <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1 flex flex-col items-center">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span className="text-[9px] font-bold text-indigo-900">Seções de Gramática</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-[9px] font-bold text-indigo-900">Análise de Tempo</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="text-[9px] font-bold text-indigo-900">Certificado PDF</span>
              </div>
            </div>

            {/* SOBRE BUTTON */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowAboutModal(true)}
                className="inline-flex items-center space-x-1.5 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold bg-white hover:bg-slate-50 border border-indigo-150 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Sobre o ELST</span>
              </button>
            </div>
          </div>
        );

      case 'exam':
        return activeAccessCode ? (
          <StudentExam
            sections={sections}
            exercises={exercises}
            activeAccessCode={activeAccessCode}
            onFinish={(result) => {
              setExamResult(result);
              setCurrentRoute('results');

              // Persist finished state inside the Access Code registry
              const updatedCodes = accessCodes.map(c => {
                if (c.id === activeAccessCode.id) {
                  return {
                    ...c,
                    status: 'completed' as const,
                    examResult: result
                  };
                }
                return c;
              });
              handleSaveAccessCodes(updatedCodes);

              // Update active state in sync
              setActiveAccessCode({
                ...activeAccessCode,
                status: 'completed',
                examResult: result
              });
            }}
            onExit={() => {
              if (window.confirm("Seu progresso atual na prova será perdido e a avaliação será cancelada. Tem certeza de que quer sair?")) {
                setExamResult(null);
                setStudentAccessCodeInput('');
                setActiveAccessCode(null);
                setCurrentRoute('home');
              }
            }}
          />
        ) : null;

      case 'results':
        return examResult ? (
          <StudentResults
            result={examResult}
            sections={sections}
            exercises={exercises}
            studentName={studentName}
            onRestart={() => {
              // Direct students back to home as retakes are strictly forbidden
              setExamResult(null);
              setStudentAccessCodeInput('');
              setActiveAccessCode(null);
              setCurrentRoute('home');
            }}
            onExit={() => {
              setExamResult(null);
              setStudentAccessCodeInput('');
              setActiveAccessCode(null);
              setCurrentRoute('home');
            }}
          />
        ) : null;

      case 'teacher':
        return (
          <TeacherPanel
            sections={sections}
            exercises={exercises}
            accessCodes={accessCodes}
            onSaveAccessCodes={handleSaveAccessCodes}
            onSaveData={handleSaveData}
            onExit={() => {
              setCurrentRoute('home');
              setPassword('');
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {renderAppContent()}

      {/* ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in flex flex-col">
            <div className="text-center border-b pb-3 shrink-0">
              <h3 className="font-extrabold text-slate-900 text-lg">ELST</h3>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">English Linguistic Structure Test</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Desenvolvido por Vytor Fonte</p>
            </div>
            
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-medium flex-1 overflow-y-auto pr-1">
              <div className="text-center font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-800 tracking-wide">ALL RIGHTS RESERVED TO VYTOR FONTE - 2022</p>
                <p className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Criação: Out/2024 &nbsp;|&nbsp; Atualização: Jul/2026</p>
              </div>

              <div className="border border-indigo-100/60 bg-indigo-50/20 p-3.5 rounded-xl space-y-2">
                <p className="font-bold text-indigo-950 border-b border-indigo-100/50 pb-1 text-[10px] uppercase tracking-wider">Equipe Fontaine</p>
                <div className="grid grid-cols-1 gap-1 text-slate-650 font-medium">
                  <p><span className="font-bold text-slate-800">Autor:</span> FONTE, Vytor;</p>
                  <p><span className="font-bold text-slate-800">Edição:</span> CRISTINA, Joyce;</p>
                  <p><span className="font-bold text-slate-800">Revisão:</span> MARSQUES, Ana C. C.;</p>
                  <p><span className="font-bold text-slate-800">Revisão:</span> XAVIER, Mariana B.;</p>
                  <p><span className="font-bold text-slate-800">Produção:</span> OZORCO, Mariella;</p>
                  <p><span className="font-bold text-slate-800">Produção:</span> DEZA, Valery;</p>
                  <p><span className="font-bold text-slate-800">Front End Dev:</span> ANDRADE, Leonardo;</p>
                </div>
              </div>

              <div className="border border-slate-100 bg-slate-50 p-3.5 rounded-xl space-y-2 text-[10px]">
                <p><span className="font-bold text-slate-800">Método de análise:</span> Fontaine Linguistic Method</p>
                <p><span className="font-bold text-slate-800">Grade de uso avaliativo:</span> CEFR</p>
                <p><span className="font-bold text-slate-800">Revisão de critérios:</span> Cambridge Dictionary, Grammarly and Merriam-Webster</p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
