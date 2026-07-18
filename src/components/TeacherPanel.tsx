import React, { useState, useEffect } from 'react';
import { Section, Exercise, ExerciseType, RichTextConfig, StudentAccessCode } from '../types';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X, Bold, Italic, 
  AlignLeft, AlignCenter, AlignRight, Type, Sparkles, Volume2, HelpCircle,
  Copy, Download, Clipboard, CheckCircle, Key, Users, Timer, FileDown, Eye, Wand2
} from 'lucide-react';
import { generateExamPDF } from '../utils/pdfGenerator';

interface TeacherPanelProps {
  sections: Section[];
  exercises: Exercise[];
  accessCodes: StudentAccessCode[];
  onSaveAccessCodes: (codes: StudentAccessCode[]) => void;
  onSaveData: (sections: Section[], exercises: Exercise[]) => void;
  onExit: () => void;
}

export default function TeacherPanel({
  sections: initialSections,
  exercises: initialExercises,
  accessCodes = [],
  onSaveAccessCodes,
  onSaveData,
  onExit
}: TeacherPanelProps) {
  // Local state for backing up modifications before saving
  const [sections, setSections] = useState<Section[]>(() => [...initialSections]);
  const [exercises, setExercises] = useState<Exercise[]>(() => [...initialExercises]);

  // Tab State: 'content' or 'access_codes'
  const [activeTab, setActiveTab] = useState<'content' | 'access_codes'>('content');

  // New Student Access Code Fields
  const [studentNameInput, setStudentNameInput] = useState<string>('');
  const [studentCpfInput, setStudentCpfInput] = useState<string>('');
  const [timerModeInput, setTimerModeInput] = useState<'infinite' | 'countdown'>('infinite');
  const [countdownDurationInput, setCountdownDurationInput] = useState<number>(60);
  const [customCodeInput, setCustomCodeInput] = useState<string>('');

  // Section Editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSecName, setEditSecName] = useState<string>('');
  const [editSecGrammar, setEditSecGrammar] = useState<string>('');

  // New Section inputs
  const [newSecName, setNewSecName] = useState<string>('');
  const [newSecGrammar, setNewSecGrammar] = useState<string>('');

  // Exercise Editing / Creating states
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [editingExercise, setEditingExercise] = useState<Partial<Exercise> | null>(null);
  const [isCreatingExercise, setIsCreatingExercise] = useState<boolean>(false);

  // New states for non-blocking deletion, custom gradient styles, and student keys
  const [pendingDeleteSectionId, setPendingDeleteSectionId] = useState<string | null>(null);
  const [pendingDeleteExerciseId, setPendingDeleteExerciseId] = useState<string | null>(null);
  const [pendingDeleteAccessCodeId, setPendingDeleteAccessCodeId] = useState<string | null>(null);

  // Custom styling colors (default to elegant Indigo to Slate)
  const [newSecFrom, setNewSecFrom] = useState<string>('#4f46e5');
  const [newSecTo, setNewSecTo] = useState<string>('#0f172a');
  const [newSecText, setNewSecText] = useState<string>('#ffffff');

  const [editSecFrom, setEditSecFrom] = useState<string>('#4f46e5');
  const [editSecTo, setEditSecTo] = useState<string>('#0f172a');
  const [editSecText, setEditSecText] = useState<string>('#ffffff');

  // Paste Student Key state
  const [studentKeyInput, setStudentKeyInput] = useState<string>('');
  const [studentKeyError, setStudentKeyError] = useState<string>('');
  const [studentKeySuccess, setStudentKeySuccess] = useState<string>('');

  // Access Code Action Handlers
  const handleAutoGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'LFA-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCodeInput(code);
  };

  const handleCreateAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNameInput.trim()) return;

    const finalCode = (customCodeInput.trim() || `LFA-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();
    
    // Check duplication
    const isDuplicate = accessCodes.some(c => c.accessCode === finalCode);
    if (isDuplicate) {
      alert("Este código de acesso já existe. Por favor, escolha ou gere outro.");
      return;
    }

    const newCode: StudentAccessCode = {
      id: `ac_${Date.now()}`,
      studentName: studentNameInput.trim(),
      studentCpf: studentCpfInput.trim(),
      accessCode: finalCode,
      timerMode: timerModeInput,
      countdownDurationMinutes: timerModeInput === 'countdown' ? Number(countdownDurationInput) : 0,
      status: 'not_started',
      examResult: null
    };

    onSaveAccessCodes([...accessCodes, newCode]);

    // Reset fields
    setStudentNameInput('');
    setStudentCpfInput('');
    setTimerModeInput('infinite');
    setCountdownDurationInput(60);
    setCustomCodeInput('');
  };

  const handleDeleteAccessCode = (id: string) => {
    if (pendingDeleteAccessCodeId !== id) {
      setPendingDeleteAccessCodeId(id);
      return;
    }
    onSaveAccessCodes(accessCodes.filter(c => c.id !== id));
    setPendingDeleteAccessCodeId(null);
  };

  const handleDownloadStudentPDF = (studentName: string, result: any) => {
    const doc = generateExamPDF(studentName, result, sections, exercises, true);
    const fileName = `ELST_Resultados_${studentName.replace(/\s+/g, '_') || 'Aluno'}.pdf`;
    doc.save(fileName);
  };

  // Preset gradient options for quick selection
  const PRESET_GRADIENTS = [
    { name: 'Índigo Noturno', from: '#4f46e5', to: '#0f172a', text: '#ffffff' },
    { name: 'Esmeralda Oceano', from: '#059669', to: '#0f172a', text: '#ffffff' },
    { name: 'Pôr do Sol', from: '#ea580c', to: '#701a75', text: '#ffffff' },
    { name: 'Nebulosa Rosa', from: '#db2777', to: '#311042', text: '#ffffff' },
    { name: 'Céu de Verão', from: '#2563eb', to: '#0284c7', text: '#ffffff' },
    { name: 'Carbono Elegante', from: '#1e293b', to: '#0f172a', text: '#e2e8f0' },
  ];

  // Auto-scramble word helper
  const handleAutoScramble = (sentenceText: string) => {
    if (!sentenceText) return;
    // Clean punctuation and split by spaces
    const words = sentenceText
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    // Shuffle words using Fisher-Yates
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setEditingExercise(prev => ({
      ...prev,
      scrambledWords: shuffled
    }));
  };

  // Synchronize when outer data updates
  useEffect(() => {
    setSections([...initialSections]);
    setExercises([...initialExercises]);
  }, [initialSections, initialExercises]);

  // Save updates to App state (which saves to localStorage)
  const persistChanges = (updatedSections: Section[], updatedExercises: Exercise[]) => {
    setSections(updatedSections);
    setExercises(updatedExercises);
    onSaveData(updatedSections, updatedExercises);
  };

  // --- SECTION ACTIONS ---
  
  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName.trim()) return;

    const newSection: Section = {
      id: `sec-${Date.now()}`,
      name: newSecName,
      grammarCategory: newSecGrammar || 'Geral',
      order: sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1,
      gradientFrom: newSecFrom,
      gradientTo: newSecTo,
      textColor: newSecText
    };

    const updated = [...sections, newSection];
    persistChanges(updated, exercises);
    
    setNewSecName('');
    setNewSecGrammar('');
    setNewSecFrom('#4f46e5');
    setNewSecTo('#0f172a');
    setNewSecText('#ffffff');
  };

  const handleStartEditSection = (sec: Section) => {
    setEditingSectionId(sec.id);
    setEditSecName(sec.name);
    setEditSecGrammar(sec.grammarCategory);
    setEditSecFrom(sec.gradientFrom || '#4f46e5');
    setEditSecTo(sec.gradientTo || '#0f172a');
    setEditSecText(sec.textColor || '#ffffff');
  };

  const handleSaveSection = (id: string) => {
    const updated = sections.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          name: editSecName, 
          grammarCategory: editSecGrammar,
          gradientFrom: editSecFrom,
          gradientTo: editSecTo,
          textColor: editSecText
        };
      }
      return s;
    });
    persistChanges(updated, exercises);
    setEditingSectionId(null);
  };

  const handleDeleteSection = (id: string) => {
    if (pendingDeleteSectionId !== id) {
      setPendingDeleteSectionId(id);
      return;
    }
    const updatedSections = sections.filter(s => s.id !== id);
    // Keep exercises but remove or reassign section reference
    const updatedExercises = exercises.filter(e => e.sectionId !== id);
    persistChanges(updatedSections, updatedExercises);
    setPendingDeleteSectionId(null);
  };

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const updated = [...sections];
    // Swap orders
    const tempOrder = updated[idx].order;
    updated[idx].order = updated[targetIdx].order;
    updated[targetIdx].order = tempOrder;

    // Sort again
    updated.sort((a, b) => a.order - b.order);
    // Re-index orders to clean sequential numbers
    updated.forEach((s, i) => s.order = i + 1);

    persistChanges(updated, exercises);
  };

  // --- EXERCISE ACTIONS ---

  const handleMoveExercise = (idx: number, direction: 'up' | 'down') => {
    // Get exercises currently filtered (within the section) so we swap logically in context
    const filteredExs = exercises
      .filter(e => selectedSectionFilter === 'all' || e.sectionId === selectedSectionFilter)
      .sort((a, b) => a.order - b.order);

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= filteredExs.length) return;

    const exA = filteredExs[idx];
    const exB = filteredExs[targetIdx];

    const updated = exercises.map(e => {
      if (e.id === exA.id) return { ...e, order: exB.order };
      if (e.id === exB.id) return { ...e, order: exA.order };
      return e;
    });

    // Clean sort numbers
    persistChanges(updated, exercises);
  };

  const handleDeleteExercise = (id: string) => {
    if (pendingDeleteExerciseId !== id) {
      setPendingDeleteExerciseId(id);
      return;
    }
    const updated = exercises.filter(e => e.id !== id);
    persistChanges(sections, updated);
    setPendingDeleteExerciseId(null);
  };

  const handleDuplicateExercise = (ex: Exercise) => {
    const duplicated: Exercise = {
      ...ex,
      id: `ex-${Date.now()}`,
      title: `${ex.title} (Cópia)`,
      order: exercises.length > 0 ? Math.max(...exercises.map(e => e.order)) + 1 : 1
    };
    const updated = [...exercises, duplicated];
    persistChanges(sections, updated);
  };

  const handleProcessStudentKey = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentKeyError('');
    setStudentKeySuccess('');
    
    if (!studentKeyInput.trim()) {
      setStudentKeyError('Por favor, cole uma chave de resultado.');
      return;
    }
    
    try {
      const decodedStr = decodeURIComponent(atob(studentKeyInput.trim()));
      const decodedObj = JSON.parse(decodedStr);
      
      if (!decodedObj.studentName || !decodedObj.result) {
        throw new Error('Formato inválido');
      }
      
      const { studentName: sName, result: sResult } = decodedObj;
      const doc = generateExamPDF(sName, sResult, sections, exercises, true);
      const fileName = `ELST_Resultados_${sName.replace(/\s+/g, '_') || 'Aluno'}.pdf`;
      doc.save(fileName);
      
      setStudentKeySuccess(`Relatório PDF de ${sName} gerado e baixado com sucesso!`);
      setStudentKeyInput('');
    } catch (err) {
      setStudentKeyError('Chave inválida! Verifique se copiou a chave inteira e tente de novo.');
    }
  };

  const handleStartCreateExercise = () => {
    const defaultSecId = selectedSectionFilter !== 'all' ? selectedSectionFilter : (sections[0]?.id || '');
    
    setEditingExercise({
      id: `ex-${Date.now()}`,
      sectionId: defaultSecId,
      type: 'multiple_choice',
      title: 'Novo Exercício',
      order: exercises.length + 1,
      richText: {
        text: 'Insira o enunciado do exercício aqui.',
        bold: false,
        italic: false,
        color: 'text-slate-800',
        align: 'left',
        size: 'base'
      },
      options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
      correctOptionIndex: 0
    });
    setIsCreatingExercise(true);
  };

  const handleStartEditExercise = (ex: Exercise) => {
    setEditingExercise({ ...ex });
    setIsCreatingExercise(false);
  };

  const handleSaveExerciseForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise) return;

    const validated: Exercise = {
      id: editingExercise.id || `ex-${Date.now()}`,
      sectionId: editingExercise.sectionId || sections[0]?.id || '',
      type: editingExercise.type || 'multiple_choice',
      title: editingExercise.title || 'Exercício sem título',
      order: editingExercise.order || exercises.length + 1,
      richText: editingExercise.richText || { text: 'Prompt' },
      
      // MC Specific
      options: editingExercise.options,
      correctOptionIndex: editingExercise.correctOptionIndex,

      // Blanks Specific
      blankSolutions: editingExercise.blankSolutions,
      blankOptions: editingExercise.blankOptions,

      // Word Ordering
      sentence: editingExercise.sentence,
      scrambledWords: editingExercise.scrambledWords,

      // Listening
      listeningText: editingExercise.listeningText,
      listeningBaseText: editingExercise.listeningBaseText,
      listeningQuestion: editingExercise.listeningQuestion,
      listeningOptions: editingExercise.listeningOptions,
      listeningCorrectIndex: editingExercise.listeningCorrectIndex
    };

    let updated: Exercise[];
    if (isCreatingExercise) {
      updated = [...exercises, validated];
    } else {
      updated = exercises.map(e => e.id === validated.id ? validated : e);
    }

    persistChanges(sections, updated);
    setEditingExercise(null);
  };

  // Blanks config auto-detector
  const detectBlanksCount = (text: string) => {
    const count = (text.match(/\[blank\]/g) || []).length;
    return count;
  };

  // Helper to adjust blanks lists
  const handleBlanksTextChange = (text: string) => {
    const requiredCount = detectBlanksCount(text);
    
    setEditingExercise(prev => {
      const rich = { ...(prev?.richText || { text: '' }), text };
      const currentSols = [...(prev?.blankSolutions || [])];
      const currentOpts = [...(prev?.blankOptions || [])];

      // Pad or truncate solutions to match the required [blank] count
      while (currentSols.length < requiredCount) {
        currentSols.push('');
      }
      if (currentSols.length > requiredCount) {
        currentSols.splice(requiredCount);
      }

      // Pad or truncate options lists
      while (currentOpts.length < requiredCount) {
        currentOpts.push(['am', 'is', 'are']); // pre-fill helper
      }
      if (currentOpts.length > requiredCount) {
        currentOpts.splice(requiredCount);
      }

      return {
        ...prev,
        richText: rich,
        blankSolutions: currentSols,
        blankOptions: currentOpts
      };
    });
  };

  // --- AUDIO TEST VOICE ---
  const handleTestBritishSpeech = (text: string) => {
    if (!text) return;
    if (!('speechSynthesis' in window)) {
      alert("Speech Synthesis não é suportado pelo seu navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let gbVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').includes('en-gb'));
    if (!gbVoice) {
      gbVoice = voices.find(v => v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('united kingdom'));
    }
    if (gbVoice) utterance.voice = gbVoice;
    else utterance.lang = 'en-GB';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  // Filter and sort the exercises to show
  const filteredExercises = exercises
    .filter(e => selectedSectionFilter === 'all' || e.sectionId === selectedSectionFilter)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-4 shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white rounded px-2.5 py-1 font-bold text-sm tracking-wider">LFA</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Painel do Professor (Teacher Mode)</h1>
            <p className="text-[10px] text-slate-400">Gerencie seções gramaticais e edite exercícios ricos</p>
          </div>
        </div>
        
        <button
          onClick={onExit}
          id="btn-teacher-exit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow"
        >
          Sair do Painel
        </button>
      </div>

      {/* TABS SELECTOR - Only show when NOT editing an exercise */}
      {!editingExercise && (
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 flex space-x-4 shrink-0 shadow-sm">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 text-xs font-extrabold uppercase tracking-widest border-b-2 px-2 transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Conteúdo da Prova</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('access_codes')}
            className={`py-3 text-xs font-extrabold uppercase tracking-widest border-b-2 px-2 transition-all cursor-pointer ${
              activeTab === 'access_codes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>Chaves de Acesso dos Alunos</span>
            </span>
          </button>
        </div>
      )}

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full flex-1">
        
        {editingExercise ? (
          /* --- EXERCISE EDIT FORM --- */
          <form onSubmit={handleSaveExerciseForm} className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-6" id="form-edit-exercise">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center space-x-1.5">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>{isCreatingExercise ? 'Criar Novo Exercício' : 'Editar Exercício'}</span>
              </h2>

              <button
                type="button"
                onClick={() => setEditingExercise(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT SIDE: CONFIGS */}
              <div className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Título do Exercício</label>
                  <input
                    type="text"
                    required
                    value={editingExercise.title || ''}
                    onChange={(e) => setEditingExercise(prev => ({ ...prev, title: e.target.value }))}
                    id="input-ex-title"
                    className="w-full text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Exercício 1 - Present Perfect Simple"
                  />
                </div>

                {/* Section selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Seção de Gramática Vinculada</label>
                  <select
                    value={editingExercise.sectionId || ''}
                    onChange={(e) => setEditingExercise(prev => ({ ...prev, sectionId: e.target.value }))}
                    id="select-ex-section"
                    className="w-full text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grammarCategory})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Exercício</label>
                  <select
                    value={editingExercise.type || 'multiple_choice'}
                    onChange={(e) => {
                      const type = e.target.value as ExerciseType;
                      setEditingExercise(prev => {
                        const copy = { ...prev, type };
                        if (type === 'multiple_choice') {
                          copy.options = ['Opção A', 'Opção B', 'Opção C', 'Opção D'];
                          copy.correctOptionIndex = 0;
                        } else if (type === 'fill_blanks') {
                          copy.richText = {
                            ...(copy.richText || { text: '' }),
                            text: 'Selecione a palavra para preencher a lacuna: "I [blank] British."'
                          };
                          copy.blankSolutions = ['am'];
                          copy.blankOptions = [['am', 'is', 'are']];
                        } else if (type === 'word_ordering') {
                          copy.sentence = 'I love learning English';
                          copy.scrambledWords = ['learning', 'I', 'English', 'love'];
                        } else if (type === 'listening') {
                          copy.listeningText = 'Pleased to meet you. Would you like some tea?';
                          copy.listeningBaseText = 'Listen to the British speaker.';
                          copy.listeningQuestion = 'What does the speaker offer?';
                          copy.listeningOptions = ['Tea', 'Coffee', 'Water'];
                          copy.listeningCorrectIndex = 0;
                        }
                        return copy;
                      });
                    }}
                    id="select-ex-type"
                    className="w-full text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="multiple_choice">Múltipla Escolha</option>
                    <option value="fill_blanks">Preenchimento de Lacunas</option>
                    <option value="word_ordering">Ordenação de Palavras</option>
                    <option value="listening">Listening (Áudio Inglês Britânico)</option>
                  </select>
                </div>

                {/* RICH TEXT CONFIGURATIONS FOR THE EXERCISE PROMPT */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Edição Visual Enunciado</div>
                  
                  {/* Rich text Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 shadow-inner select-none">
                    <button
                      type="button"
                      onClick={() => setEditingExercise(prev => ({
                        ...prev,
                        richText: { ...(prev?.richText || { text: '' }), bold: !prev?.richText?.bold }
                      }))}
                      id="toolbar-bold"
                      className={`p-1.5 rounded transition-colors ${editingExercise.richText?.bold ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      title="Negrito"
                    >
                      <Bold className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingExercise(prev => ({
                        ...prev,
                        richText: { ...(prev?.richText || { text: '' }), italic: !prev?.richText?.italic }
                      }))}
                      id="toolbar-italic"
                      className={`p-1.5 rounded transition-colors ${editingExercise.richText?.italic ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      title="Itálico"
                    >
                      <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-1"></div>

                    {/* Alignment */}
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setEditingExercise(prev => ({
                          ...prev,
                          richText: { ...(prev?.richText || { text: '' }), align }
                        }))}
                        id={`toolbar-align-${align}`}
                        className={`p-1.5 rounded transition-colors ${editingExercise.richText?.align === align ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                        title={`Alinhar à ${align === 'left' ? 'esquerda' : align === 'center' ? 'centro' : 'direita'}`}
                      >
                        {align === 'left' && <AlignLeft className="w-4 h-4" />}
                        {align === 'center' && <AlignCenter className="w-4 h-4" />}
                        {align === 'right' && <AlignRight className="w-4 h-4" />}
                      </button>
                    ))}

                    <div className="w-px h-5 bg-slate-200 mx-1"></div>

                    {/* Size Selector */}
                    <div className="flex items-center space-x-1 text-slate-500">
                      <Type className="w-3.5 h-3.5" />
                      <select
                        value={editingExercise.richText?.size || 'base'}
                        onChange={(e) => {
                          const size = e.target.value as any;
                          setEditingExercise(prev => ({
                            ...prev,
                            richText: { ...(prev?.richText || { text: '' }), size }
                          }));
                        }}
                        id="select-toolbar-size"
                        className="text-xs bg-transparent border-none font-bold focus:outline-none"
                      >
                        <option value="sm">Pequeno</option>
                        <option value="base">Normal</option>
                        <option value="lg">Médio</option>
                        <option value="xl">Grande</option>
                        <option value="2xl">Enorme</option>
                      </select>
                    </div>

                    <div className="w-px h-5 bg-slate-200 mx-1"></div>

                    {/* Color Selector */}
                    <select
                      value={editingExercise.richText?.color || 'text-slate-800'}
                      onChange={(e) => {
                        const color = e.target.value;
                        setEditingExercise(prev => ({
                          ...prev,
                          richText: { ...(prev?.richText || { text: '' }), color }
                        }));
                      }}
                      id="select-toolbar-color"
                      className="text-xs bg-transparent border-none font-bold text-slate-500 focus:outline-none"
                    >
                      <option value="text-slate-800">Padrão Escuro</option>
                      <option value="text-red-600">Vermelho</option>
                      <option value="text-blue-600">Azul</option>
                      <option value="text-emerald-600">Esmeralda</option>
                      <option value="text-indigo-600">Índigo</option>
                      <option value="text-amber-500">Âmbar</option>
                    </select>
                  </div>

                  {/* Prompt Text Editor */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">
                      Texto do Enunciado / Pergunta (Aceita tags HTML básicas como &lt;b&gt;, &lt;i&gt;)
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={editingExercise.richText?.text || ''}
                      onChange={(e) => {
                        const txt = e.target.value;
                        if (editingExercise.type === 'fill_blanks') {
                          handleBlanksTextChange(txt);
                        } else {
                          setEditingExercise(prev => ({
                            ...prev,
                            richText: { ...(prev?.richText || { text: '' }), text: txt }
                          }));
                        }
                      }}
                      id="input-ex-prompt"
                      className="w-full text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex: Qual é a forma correta do verbo?"
                    />
                    {editingExercise.type === 'fill_blanks' && (
                      <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                        Dica: Insira o termo <code className="bg-indigo-100 px-1 py-0.5 rounded font-bold">[blank]</code> onde as lacunas interativas devem aparecer.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: TYPE SPECIFIC OPTIONS */}
              <div className="space-y-4 border-l border-slate-100 pl-0 md:pl-6">
                
                {/* PREVIEW CONTAINER */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Pré-visualização do Aluno</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 min-h-16 flex flex-col justify-center">
                    <div 
                      className={`leading-relaxed ${
                        editingExercise.richText?.bold ? 'font-bold' : ''
                      } ${
                        editingExercise.richText?.italic ? 'italic' : ''
                      } ${
                        editingExercise.richText?.color || 'text-slate-800'
                      } text-${editingExercise.richText?.size || 'base'} text-${editingExercise.richText?.align || 'left'}`}
                      dangerouslySetInnerHTML={{ 
                        __html: (editingExercise.richText?.text || '')
                          .replace(/\[blank\]/g, '<span style="border-bottom: 2px solid #6366f1; color: #4338ca; padding: 0 10px; font-weight: bold">_______</span>')
                      }}
                    />
                  </div>
                </div>

                {/* TYPE-SPECIFIC EDITOR MODULES */}
                
                {/* A) MCQ */}
                {editingExercise.type === 'multiple_choice' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase">Alternativas da Questão</label>
                      <button
                        type="button"
                        onClick={() => setEditingExercise(prev => ({
                          ...prev,
                          options: [...(prev?.options || []), `Nova Alternativa ${String.fromCharCode(65 + (prev?.options?.length || 0))}`]
                        }))}
                        id="btn-add-option"
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> <span>Adicionar Alternativa</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {editingExercise.options?.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center space-x-2">
                          {/* Correct option selector */}
                          <input
                            type="radio"
                            name="correct_choice"
                            checked={editingExercise.correctOptionIndex === oIdx}
                            onChange={() => setEditingExercise(prev => ({ ...prev, correctOptionIndex: oIdx }))}
                            id={`radio-correct-${oIdx}`}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            title="Marcar como correta"
                          />
                          
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const list = [...(editingExercise.options || [])];
                              list[oIdx] = e.target.value;
                              setEditingExercise(prev => ({ ...prev, options: list }));
                            }}
                            id={`input-opt-${oIdx}`}
                            className="flex-1 text-sm p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={`Alternativa ${String.fromCharCode(65 + oIdx)}`}
                          />

                          {/* Delete option */}
                          {oIdx > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(editingExercise.options || [])];
                                list.splice(oIdx, 1);
                                setEditingExercise(prev => {
                                  let correctIdx = prev.correctOptionIndex || 0;
                                  if (correctIdx >= list.length) correctIdx = list.length - 1;
                                  return { ...prev, options: list, correctOptionIndex: correctIdx };
                                });
                              }}
                              id={`btn-del-option-${oIdx}`}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* B) FILL IN BLANKS */}
                {editingExercise.type === 'fill_blanks' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase block">
                      Configurações das Lacunas Detectadas ({detectBlanksCount(editingExercise.richText?.text || '')})
                    </label>

                    {detectBlanksCount(editingExercise.richText?.text || '') === 0 ? (
                      <div className="text-xs text-amber-600 border border-amber-200 bg-amber-50 p-3 rounded-lg font-semibold flex items-center space-x-1.5">
                        <span>Aviso: Adicione a tag "[blank]" no enunciado para configurar as soluções.</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editingExercise.blankSolutions?.map((sol, bIdx) => (
                          <div key={bIdx} className="border border-slate-100 rounded-xl p-3 bg-slate-50 space-y-2">
                            <div className="text-xs font-extrabold text-indigo-700">CONFIGURAÇÃO DA LACUNA {bIdx + 1}</div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Resposta Correta</label>
                                <input
                                  type="text"
                                  required
                                  value={sol}
                                  onChange={(e) => {
                                    const sols = [...(editingExercise.blankSolutions || [])];
                                    sols[bIdx] = e.target.value;
                                    setEditingExercise(prev => ({ ...prev, blankSolutions: sols }));
                                  }}
                                  id={`input-blank-sol-${bIdx}`}
                                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                  placeholder="Ex: am"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Outras opções (Separadas por vírgula)</label>
                                <input
                                  type="text"
                                  required
                                  value={editingExercise.blankOptions?.[bIdx]?.join(', ') || ''}
                                  onChange={(e) => {
                                    const optsList = [...(editingExercise.blankOptions || [])];
                                    optsList[bIdx] = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                                    setEditingExercise(prev => ({ ...prev, blankOptions: optsList }));
                                  }}
                                  id={`input-blank-opts-${bIdx}`}
                                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                  placeholder="Ex: am, is, are"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* D) WORD ORDERING */}
                {editingExercise.type === 'word_ordering' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block">Frase Correta Completa</label>
                      <input
                        type="text"
                        required
                        value={editingExercise.sentence || ''}
                        onChange={(e) => setEditingExercise(prev => ({ ...prev, sentence: e.target.value }))}
                        id="input-ordering-sentence"
                        className="w-full text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ex: She used to play tennis every Sunday"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Palavras Embaralhadas</span>
                      <button
                        type="button"
                        onClick={() => handleAutoScramble(editingExercise.sentence || '')}
                        id="btn-autoscramble"
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> <span>Embaralhar Automaticamente</span>
                      </button>
                    </div>

                    <div className="bg-slate-100/70 rounded-xl p-3 flex flex-wrap gap-1.5 min-h-12 items-center justify-center">
                      {editingExercise.scrambledWords && editingExercise.scrambledWords.length > 0 ? (
                        editingExercise.scrambledWords.map((word, wIdx) => (
                          <span key={wIdx} className="bg-white border border-slate-200 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                            {word}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Nenhuma palavra embaralhada ainda. Clique em Embaralhar!</span>
                      )}
                    </div>
                  </div>
                )}

                {/* E) LISTENING */}
                {editingExercise.type === 'listening' && (
                  <div className="space-y-4">
                    <div className="border border-indigo-100 rounded-xl p-3 bg-indigo-50/50 space-y-3">
                      <div className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center space-x-1">
                        <Volume2 className="w-4 h-4 text-indigo-600" />
                        <span>Sintetizador Britânico en-GB</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Texto Falado pelo Áudio</label>
                        <textarea
                          required
                          rows={2}
                          value={editingExercise.listeningText || ''}
                          onChange={(e) => setEditingExercise(prev => ({ ...prev, listeningText: e.target.value }))}
                          id="input-listening-text"
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ex: I am chuffed to bits with my brand new flat!"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTestBritishSpeech(editingExercise.listeningText || '')}
                        id="btn-test-speech"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 rounded shadow"
                      >
                        Testar Pronúncia Britânica (UK)
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">Texto Auxiliar de Contexto</label>
                      <input
                        type="text"
                        required
                        value={editingExercise.listeningBaseText || ''}
                        onChange={(e) => setEditingExercise(prev => ({ ...prev, listeningBaseText: e.target.value }))}
                        id="input-listening-base"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ex: Listen carefully to the audio of the London teacher."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 block">Pergunta sobre o Áudio</label>
                      <input
                        type="text"
                        required
                        value={editingExercise.listeningQuestion || ''}
                        onChange={(e) => setEditingExercise(prev => ({ ...prev, listeningQuestion: e.target.value }))}
                        id="input-listening-question"
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ex: Qual foi a expressão usada para felicidade?"
                      />
                    </div>

                    {/* Options list for listening MCQ */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 block">Alternativas do Listening</label>
                      {editingExercise.listeningOptions?.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center space-x-1.5">
                          <input
                            type="radio"
                            name="correct_listening_choice"
                            checked={editingExercise.listeningCorrectIndex === oIdx}
                            onChange={() => setEditingExercise(prev => ({ ...prev, listeningCorrectIndex: oIdx }))}
                            id={`radio-listening-correct-${oIdx}`}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const list = [...(editingExercise.listeningOptions || [])];
                              list[oIdx] = e.target.value;
                              setEditingExercise(prev => ({ ...prev, listeningOptions: list }));
                            }}
                            id={`input-listening-opt-${oIdx}`}
                            className="flex-1 text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON FOOTER */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingExercise(null)}
                id="btn-cancel-ex-form"
                className="border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg bg-white"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-save-ex-form"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow"
              >
                Salvar Exercício
              </button>
            </div>
          </form>
        ) : activeTab === 'content' ? (
          /* --- SECTIONS AND EXERCISES LIST TABLES --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: SECTION LIST (Lg 4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* CREATE SECTION FORM */}
              <form onSubmit={handleCreateSection} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4" id="form-create-section">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Criar Nova Seção (Gramática)</h3>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={newSecName}
                    onChange={(e) => setNewSecName(e.target.value)}
                    id="input-sec-name"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nome: Ex: Seção 4: Adjetivos"
                  />

                  <input
                    type="text"
                    required
                    value={newSecGrammar}
                    onChange={(e) => setNewSecGrammar(e.target.value)}
                    id="input-sec-grammar"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Gramática: Ex: Adjectives & Comparatives"
                  />
                </div>

                {/* Gradient Customizer */}
                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cores & Estilo do Fundo</span>
                  
                  {/* Preset Gradients */}
                  <div className="grid grid-cols-3 gap-1">
                    {PRESET_GRADIENTS.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setNewSecFrom(p.from);
                          setNewSecTo(p.to);
                          setNewSecText(p.text);
                        }}
                        className="text-[9px] p-1 rounded font-medium border border-slate-200 hover:border-slate-400 text-slate-700 truncate cursor-pointer bg-white"
                        title={p.name}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex flex-col space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">De:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={newSecFrom}
                          onChange={(e) => setNewSecFrom(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <span className="text-[10px] font-mono text-slate-500">{newSecFrom}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Até:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={newSecTo}
                          onChange={(e) => setNewSecTo(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <span className="text-[10px] font-mono text-slate-500">{newSecTo}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Texto:</span>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="color"
                          value={newSecText}
                          onChange={(e) => setNewSecText(e.target.value)}
                          className="w-6 h-6 border-0 rounded cursor-pointer shrink-0"
                        />
                        <span className="text-[10px] font-mono text-slate-500">{newSecText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section card preview */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Visualização do Aluno:</span>
                    <div
                      className="p-3 rounded-lg text-center font-bold text-xs shadow-inner min-h-12 flex flex-col justify-center transition-all duration-300"
                      style={{
                        background: `linear-gradient(to right, ${newSecFrom}, ${newSecTo})`,
                        color: newSecText
                      }}
                    >
                      <div className="text-[9px] opacity-80 uppercase font-medium">Foco de Gramática</div>
                      <div className="truncate">{newSecName || 'Exemplo de Seção'}</div>
                      <div className="text-[9px] opacity-85 font-medium truncate">Categoria: {newSecGrammar || 'Categoria'}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-section"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> <span>Adicionar Seção</span>
                </button>
              </form>

              {/* SECTIONS LIST */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Seções Gramaticais Cadastradas ({sections.length})
                </h3>

                <div className="space-y-3">
                  {sections.map((sec, idx) => {
                    const isEditing = editingSectionId === sec.id;
                    const displayFrom = sec.gradientFrom || '#4f46e5';
                    const displayTo = sec.gradientTo || '#0f172a';
                    const displayText = sec.textColor || '#ffffff';
                    return (
                      <div key={sec.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 space-y-2">
                        {isEditing ? (
                          <div className="space-y-3 pt-1 border-t border-slate-200">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Nome da Seção</label>
                              <input
                                type="text"
                                value={editSecName}
                                onChange={(e) => setEditSecName(e.target.value)}
                                id={`input-edit-sec-name-${sec.id}`}
                                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Categoria</label>
                              <input
                                type="text"
                                value={editSecGrammar}
                                onChange={(e) => setEditSecGrammar(e.target.value)}
                                id={`input-edit-sec-grammar-${sec.id}`}
                                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>

                            {/* Edit Gradient Customizer */}
                            <div className="space-y-2 border-t border-slate-100 pt-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Estilo da Caixa</span>
                              
                              <div className="grid grid-cols-3 gap-1">
                                {PRESET_GRADIENTS.map((p, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => {
                                      setEditSecFrom(p.from);
                                      setEditSecTo(p.to);
                                      setEditSecText(p.text);
                                    }}
                                    className="text-[9px] p-0.5 rounded font-medium border border-slate-200 hover:border-slate-400 text-slate-700 truncate bg-white cursor-pointer"
                                    title={p.name}
                                  >
                                    {p.name}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center space-x-1">
                                <div className="flex-1 flex flex-col space-y-0.5">
                                  <span className="text-[8px] text-slate-400 font-bold uppercase">De:</span>
                                  <input
                                    type="color"
                                    value={editSecFrom}
                                    onChange={(e) => setEditSecFrom(e.target.value)}
                                    className="w-full h-5 border-0 rounded cursor-pointer shrink-0"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col space-y-0.5">
                                  <span className="text-[8px] text-slate-400 font-bold uppercase">Até:</span>
                                  <input
                                    type="color"
                                    value={editSecTo}
                                    onChange={(e) => setEditSecTo(e.target.value)}
                                    className="w-full h-5 border-0 rounded cursor-pointer shrink-0"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col space-y-0.5">
                                  <span className="text-[8px] text-slate-400 font-bold uppercase">Txt:</span>
                                  <input
                                    type="color"
                                    value={editSecText}
                                    onChange={(e) => setEditSecText(e.target.value)}
                                    className="w-full h-5 border-0 rounded cursor-pointer shrink-0"
                                  />
                                </div>
                              </div>

                              {/* Section card preview */}
                              <div
                                className="p-2 rounded text-center font-bold text-[11px] shadow-inner min-h-8 flex flex-col justify-center transition-all duration-300"
                                style={{
                                  background: `linear-gradient(to right, ${editSecFrom}, ${editSecTo})`,
                                  color: editSecText
                                }}
                              >
                                <div className="truncate">{editSecName || 'Nome'}</div>
                              </div>
                            </div>

                            <div className="flex space-x-1.5 justify-end pt-1">
                              <button
                                onClick={() => setEditingSectionId(null)}
                                id={`btn-cancel-edit-sec-${sec.id}`}
                                className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-slate-300"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveSection(sec.id)}
                                id={`btn-save-edit-sec-${sec.id}`}
                                className="text-[10px] bg-indigo-600 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-indigo-700 shadow-sm"
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs font-bold text-slate-800">{sec.name}</div>
                                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Gramática: {sec.grammarCategory}</div>
                                <span className="inline-block bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded mt-1">
                                  Ordem: {sec.order}
                                </span>
                              </div>

                              {/* Section controllers */}
                              <div className="flex items-center space-x-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(idx, 'up')}
                                  disabled={idx === 0}
                                  id={`btn-move-up-sec-${sec.id}`}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(idx, 'down')}
                                  disabled={idx === sections.length - 1}
                                  id={`btn-move-down-sec-${sec.id}`}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditSection(sec)}
                                  id={`btn-edit-sec-${sec.id}`}
                                  className="text-slate-400 hover:text-indigo-600 p-1 rounded cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSection(sec.id)}
                                  id={`btn-delete-sec-${sec.id}`}
                                  className={`p-1 rounded transition-all cursor-pointer ${
                                    pendingDeleteSectionId === sec.id
                                      ? 'bg-red-600 text-white rounded px-1.5 text-[10px] font-bold animate-pulse'
                                      : 'text-slate-400 hover:text-red-600'
                                  }`}
                                  title={pendingDeleteSectionId === sec.id ? 'Confirmar exclusão?' : 'Excluir seção'}
                                >
                                  {pendingDeleteSectionId === sec.id ? 'Confirmar?' : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                            {/* Color indicator badge */}
                            <div className="flex items-center space-x-1 text-[9px] text-slate-400 font-semibold border-t border-slate-100 pt-1.5">
                              <span>Aparência:</span>
                              <span 
                                className="w-3 h-3 rounded shadow-inner inline-block" 
                                style={{ background: `linear-gradient(to right, ${displayFrom}, ${displayTo})` }}
                              />
                              <span className="font-mono text-[8px]">{displayFrom} ➔ {displayTo}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {sections.length === 0 && (
                    <div className="text-xs text-slate-400 italic text-center py-4">Nenhuma seção cadastrada.</div>
                  )}
                </div>
              </div>

              {/* DECODE STUDENT RESULT KEY CARD */}
              <form onSubmit={handleProcessStudentKey} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 animate-fade-in" id="form-import-student-key">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Clipboard className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Gerar PDF por Chave de Aluno</h3>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Cole a chave de resultado copiada pelo aluno ao final da prova para re-gerar e baixar o relatório oficial em PDF diretamente.
                </p>

                <div className="space-y-1.5">
                  <textarea
                    rows={2}
                    required
                    value={studentKeyInput}
                    onChange={(e) => {
                      setStudentKeyInput(e.target.value);
                      setStudentKeyError('');
                      setStudentKeySuccess('');
                    }}
                    placeholder="Cole a chave aqui..."
                    id="textarea-student-key"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                {studentKeyError && (
                  <div className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg font-semibold">
                    {studentKeyError}
                  </div>
                )}

                {studentKeySuccess && (
                  <div className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg font-semibold">
                    {studentKeySuccess}
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-import-student-key-submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" /> <span>Gerar e Baixar PDF</span>
                </button>
              </form>

            </div>

            {/* COLUMN 2: EXERCISES LIST (Lg 8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* EXERCISE MANAGER BANNER & FILTER */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="text-xs font-bold text-slate-500 uppercase shrink-0">Filtrar Seção:</div>
                  <select
                    value={selectedSectionFilter}
                    onChange={(e) => setSelectedSectionFilter(e.target.value)}
                    id="select-filter-section"
                    className="text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-56"
                  >
                    <option value="all">Todas as Seções ({exercises.length} ex.)</option>
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStartCreateExercise}
                  disabled={sections.length === 0}
                  id="btn-create-exercise-trigger"
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" /> <span>Criar Exercício</span>
                </button>
              </div>

              {/* EXERCISES ROW CARD */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                    Exercícios Disponíveis ({filteredExercises.length})
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {filteredExercises.map((ex, idx) => {
                    const activeSection = sections.find(s => s.id === ex.sectionId);
                    return (
                      <div key={ex.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              Questão {idx + 1}
                            </span>
                            <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded">
                              {ex.type === 'multiple_choice' && 'Múltipla Escolha'}
                              {ex.type === 'fill_blanks' && 'Lacunas'}
                              {ex.type === 'word_ordering' && 'Ordenar'}
                              {ex.type === 'listening' && 'Listening (UK)'}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-800">{ex.title}</h4>
                          <div className="text-[10px] text-slate-500 font-medium">
                            Seção: <span className="font-bold text-slate-700">{activeSection ? activeSection.name : 'Nenhuma'}</span>
                          </div>
                        </div>

                        {/* Order & action controllers */}
                        <div className="flex items-center space-x-1 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => handleMoveExercise(idx, 'up')}
                            disabled={idx === 0}
                            id={`btn-move-up-ex-${ex.id}`}
                            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg border border-slate-100 hover:bg-white disabled:opacity-30 cursor-pointer"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveExercise(idx, 'down')}
                            disabled={idx === filteredExercises.length - 1}
                            id={`btn-move-down-ex-${ex.id}`}
                            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg border border-slate-100 hover:bg-white disabled:opacity-30 cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          
                          {/* Duplicate Button */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateExercise(ex)}
                            id={`btn-duplicate-ex-${ex.id}`}
                            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg border border-slate-100 hover:bg-white cursor-pointer"
                            title="Duplicar Exercício"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEditExercise(ex)}
                            id={`btn-edit-ex-${ex.id}`}
                            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg border border-slate-100 hover:bg-white cursor-pointer"
                            title="Editar exercício"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Confirmation Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteExercise(ex.id)}
                            id={`btn-delete-ex-${ex.id}`}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              pendingDeleteExerciseId === ex.id
                                ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 animate-pulse'
                                : 'text-slate-400 hover:text-red-600 border-slate-100 hover:bg-white'
                            }`}
                            title={pendingDeleteExerciseId === ex.id ? 'Confirmar exclusão?' : 'Excluir exercício'}
                          >
                            {pendingDeleteExerciseId === ex.id ? (
                              <span className="flex items-center space-x-1 font-sans text-[10px]">
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Confirmar?</span>
                              </span>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredExercises.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      Nenhum exercício encontrado para esta seção. Clique em "Criar Exercício" para adicionar!
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* --- ACCESS CODES DASHBOARD VIEW --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
            {/* COLUMN 1: CREATE NEW ACCESS CODE CARD (Lg 4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              <form onSubmit={handleCreateAccessCode} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4" id="form-create-access-code">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Key className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-sans">Criar Chave de Acesso</h3>
                </div>

                <div className="space-y-3.5">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase block">Nome Completo do Aluno</label>
                    <input
                      type="text"
                      required
                      value={studentNameInput}
                      onChange={(e) => setStudentNameInput(e.target.value)}
                      placeholder="Ex: Ana Clara Silva"
                      id="input-ac-name"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  {/* CPF field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase block">CPF do Aluno</label>
                    <input
                      type="text"
                      required
                      value={studentCpfInput}
                      onChange={(e) => setStudentCpfInput(e.target.value)}
                      placeholder="Ex: 123.456.789-00"
                      id="input-ac-cpf"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  {/* Custom Code field with helper */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Código de Acesso</label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateCode}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Gerar Aleatório</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={customCodeInput}
                        onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                        placeholder="Ex: LFA-ALUNO1 (ou deixe vazio)"
                        id="input-ac-code"
                        className="w-full text-xs p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                      <Key className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  {/* Timer settings selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase block">Configuração do Cronômetro</label>
                    <select
                      value={timerModeInput}
                      onChange={(e) => setTimerModeInput(e.target.value as 'infinite' | 'countdown')}
                      id="select-ac-timer-mode"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium text-slate-700"
                    >
                      <option value="infinite">Tempo Infinito (Cronômetro progressivo)</option>
                      <option value="countdown">Tempo Limitado (Countdown / Regressivo)</option>
                    </select>
                  </div>

                  {/* Countdown Duration (only if countdown chosen) */}
                  {timerModeInput === 'countdown' && (
                    <div className="space-y-1 animate-fade-in">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">Duração da Prova (Minutos)</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min={1}
                          max={300}
                          value={countdownDurationInput}
                          onChange={(e) => setCountdownDurationInput(Number(e.target.value))}
                          id="input-ac-duration"
                          className="w-full text-xs p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-semibold text-slate-700"
                        />
                        <Timer className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  id="btn-create-ac-submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Chave de Acesso</span>
                </button>
              </form>
            </div>

            {/* COLUMN 2: ACTIVE KEYS LIST (Lg 8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center space-x-2 font-sans">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Códigos de Acesso Criados ({accessCodes.length})</span>
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {accessCodes.map((ac) => {
                    return (
                      <div key={ac.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1.5 flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">{ac.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-medium font-mono">CPF: {ac.studentCpf || 'Sem CPF'}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            {/* Access Key mono badge with copy button */}
                            <div className="flex items-center space-x-1 bg-indigo-50 border border-indigo-100/70 text-indigo-800 rounded-lg px-2 py-1 font-mono text-xs font-bold shadow-sm">
                              <span>{ac.accessCode}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(ac.accessCode);
                                  alert('Chave copiada para a área de transferência!');
                                }}
                                className="text-indigo-400 hover:text-indigo-700 transition-colors cursor-pointer"
                                title="Copiar Chave"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Timer settings helper */}
                            <span className="text-[10px] text-slate-500 font-bold flex items-center space-x-1">
                              <Timer className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {ac.timerMode === 'countdown'
                                  ? `Countdown (${ac.countdownDurationMinutes} min)`
                                  : 'Tempo Infinito'
                                }
                              </span>
                            </span>

                            {/* Status badge */}
                            {ac.status === 'completed' ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Realizado
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Não Iniciado
                              </span>
                            )}
                          </div>

                          {/* Render result detail if completed */}
                          {ac.status === 'completed' && ac.examResult && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in w-full">
                              <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
                                {/* Score box */}
                                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-black border flex-shrink-0 ${
                                  ac.examResult.score >= 8.5
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    : 'bg-red-50 border-red-300 text-red-800'
                                }`}>
                                  <span className="text-sm">{ac.examResult.score.toFixed(1)}</span>
                                  <span className="text-[7px] uppercase tracking-widest font-extrabold">Nota</span>
                                </div>
                                <div className="text-center sm:text-left">
                                  <p className="text-xs font-bold text-slate-700">
                                    {ac.examResult.score >= 8.5 ? 'Aprovado(a)' : 'Reprovado(a)'}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-semibold font-mono">
                                    Duração: {Math.floor(ac.examResult.timeSpentSeconds / 60)}m {ac.examResult.timeSpentSeconds % 60}s
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDownloadStudentPDF(ac.studentName, ac.examResult)}
                                className="w-full sm:w-auto bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50 text-indigo-700 font-extrabold text-[11px] px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                              >
                                <FileDown className="w-4 h-4" />
                                <span>Baixar PDF</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteAccessCode(ac.id)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer text-xs font-bold ${
                              pendingDeleteAccessCodeId === ac.id
                                ? 'bg-red-600 border-red-600 text-white animate-pulse px-3 py-1.5'
                                : 'text-slate-400 hover:text-red-600 border-slate-100 hover:bg-white hover:border-red-100'
                            }`}
                            title={pendingDeleteAccessCodeId === ac.id ? 'Confirmar exclusão?' : 'Excluir Chave de Acesso'}
                          >
                            {pendingDeleteAccessCodeId === ac.id ? 'Confirmar?' : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {accessCodes.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      Nenhuma chave de acesso cadastrada. Crie uma chave ao lado para autorizar alunos a fazerem a prova!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
