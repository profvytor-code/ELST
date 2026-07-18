import React, { useState, useEffect, useRef } from 'react';
import { Section, Exercise, StudentResponse, ExamResult, StudentAccessCode } from '../types';
import { Play, Volume2, HelpCircle, Check, ArrowRight, ArrowLeft, Star, Clock, AlertTriangle, ShieldAlert, Award, FileText } from 'lucide-react';

interface StudentExamProps {
  sections: Section[];
  exercises: Exercise[];
  activeAccessCode: StudentAccessCode;
  onFinish: (result: ExamResult) => void;
  onExit: () => void;
}

export default function StudentExam({
  sections,
  exercises,
  activeAccessCode,
  onFinish,
  onExit
}: StudentExamProps) {
  const studentName = activeAccessCode.studentName;
  
  // Sort sections and exercises to ensure proper sequence
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const sortedExercises = [...exercises].sort((a, b) => {
    const secA = sortedSections.find(s => s.id === a.sectionId);
    const secB = sortedSections.find(s => s.id === b.sectionId);
    if (!secA || !secB) return a.order - b.order;
    if (secA.order !== secB.order) return secA.order - secB.order;
    return a.order - b.order;
  });

  const [showingInstructions, setShowingInstructions] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const activeExercise = sortedExercises[currentIdx];

  // Map of exerciseId -> array of shuffled indices (each element is the original index)
  const [shuffledIndicesMap] = useState<Record<string, number[]>>(() => {
    const map: Record<string, number[]> = {};
    exercises.forEach(ex => {
      if (ex.type === 'multiple_choice' && ex.options && ex.options.length > 0) {
        const indices = ex.options.map((_, idx) => idx);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = indices[i];
          indices[i] = indices[j];
          indices[j] = temp;
        }
        map[ex.id] = indices;
      } else if (ex.type === 'listening' && ex.listeningOptions && ex.listeningOptions.length > 0) {
        const indices = ex.listeningOptions.map((_, idx) => idx);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = indices[i];
          indices[i] = indices[j];
          indices[j] = temp;
        }
        map[ex.id] = indices;
      }
    });
    return map;
  });

  // Map of exerciseId -> StudentResponse
  const [responses, setResponses] = useState<Record<string, Partial<StudentResponse>>>(() => {
    const initial: Record<string, Partial<StudentResponse>> = {};
    sortedExercises.forEach(ex => {
      initial[ex.id] = {
        exerciseId: ex.id,
        type: ex.type,
        timeSpentSeconds: 0,
        understandingRating: 0,
        isLeftBlank: true
      };
    });
    return initial;
  });

  // Map of sectionId -> rating
  const [sectionRatings, setSectionRatings] = useState<Record<string, number>>({});

  // Trackers for time
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [activeQuestionSeconds, setActiveQuestionSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (activeAccessCode.timerMode === 'countdown') {
      return activeAccessCode.countdownDurationMinutes * 60;
    }
    return 0; // count up
  });
  
  // Audio plays tracker
  const [audioPlays, setAudioPlays] = useState<Record<string, number>>({});
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Auto-saved timer references
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Word sorting temporary pool states (to manage words placed and remaining)
  const [scrambledPool, setScrambledPool] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Keep refs of values that are needed inside intervals to avoid stale closures
  const totalSecondsRef = useRef(totalSeconds);
  const activeQuestionSecondsRef = useRef(activeQuestionSeconds);
  const responsesRef = useRef(responses);
  const currentIdxRef = useRef(currentIdx);
  const sectionRatingsRef = useRef(sectionRatings);

  useEffect(() => { totalSecondsRef.current = totalSeconds; }, [totalSeconds]);
  useEffect(() => { activeQuestionSecondsRef.current = activeQuestionSeconds; }, [activeQuestionSeconds]);
  useEffect(() => { responsesRef.current = responses; }, [responses]);
  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);
  useEffect(() => { sectionRatingsRef.current = sectionRatings; }, [sectionRatings]);

  // Update timers
  useEffect(() => {
    if (showingInstructions) return;

    timerRef.current = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      setActiveQuestionSeconds(prev => prev + 1);

      if (activeAccessCode.timerMode === 'countdown') {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Submit immediately when timer runs out
            setTimeout(() => {
              triggerAutoFinish();
            }, 10);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showingInstructions]);

  // Whenever we change the active question, save the accumulated seconds to the previous question and reset the counter
  const previousIdxRef = useRef<number>(currentIdx);
  useEffect(() => {
    const prevIdx = previousIdxRef.current;
    if (prevIdx !== currentIdx && sortedExercises[prevIdx]) {
      const prevEx = sortedExercises[prevIdx];
      setResponses(prev => {
        const existing = prev[prevEx.id] || {};
        return {
          ...prev,
          [prevEx.id]: {
            ...existing,
            timeSpentSeconds: (existing.timeSpentSeconds || 0) + activeQuestionSeconds
          }
        };
      });
      setActiveQuestionSeconds(0);
    }
    previousIdxRef.current = currentIdx;

    // Reset Word Sorting pools for the new question if it's a word_ordering type
    if (activeExercise && activeExercise.type === 'word_ordering') {
      const currentResp = responses[activeExercise.id];
      if (currentResp && currentResp.orderedWords && currentResp.orderedWords.length > 0) {
        // User already has some ordered words
        setSelectedWords(currentResp.orderedWords);
        // Scrambled pool is original scrambled words minus whatever was selected
        const originalScrambled = activeExercise.scrambledWords || [];
        const chosen = [...currentResp.orderedWords];
        const pool: string[] = [];
        // Handle duplicates safely
        const tempChosen = [...chosen];
        originalScrambled.forEach(w => {
          const chosenIdx = tempChosen.indexOf(w);
          if (chosenIdx !== -1) {
            tempChosen.splice(chosenIdx, 1);
          } else {
            pool.push(w);
          }
        });
        setScrambledPool(pool);
      } else {
        // Empty state
        setScrambledPool(activeExercise.scrambledWords || []);
        setSelectedWords([]);
      }
    }
  }, [currentIdx, activeExercise]);

  // Load British voices
  const playListeningAudio = (text: string, exerciseId: string) => {
    const plays = audioPlays[exerciseId] || 0;
    if (plays >= 3) {
      alert("Você já atingiu o limite de 3 reproduções para este exercício.");
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert("Speech Synthesis não é suportado pelo seu navegador.");
      return;
    }

    // Stop any current voice
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find en-GB voice
    const voices = window.speechSynthesis.getVoices();
    let gbVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').includes('en-gb'));
    if (!gbVoice) {
      gbVoice = voices.find(v => v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('uk') || v.name.toLowerCase().includes('united kingdom'));
    }
    
    if (gbVoice) {
      utterance.voice = gbVoice;
    } else {
      utterance.lang = 'en-GB';
    }

    utterance.pitch = 1.0;
    utterance.rate = 0.92; // Slightly paced for educational purposes

    utterance.onstart = () => setIsAudioPlaying(true);
    utterance.onend = () => {
      setIsAudioPlaying(false);
      setAudioPlays(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
    };
    utterance.onerror = () => setIsAudioPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Helper to handle Multiple Choice responses
  const selectOptionMC = (optionIdx: number) => {
    setResponses(prev => ({
      ...prev,
      [activeExercise.id]: {
        ...prev[activeExercise.id],
        selectedOptionIndex: optionIdx,
        isLeftBlank: false
      }
    }));
  };

  // Helper to handle Blank Choice responses
  const selectBlankChoice = (blankIdx: number, value: string) => {
    setResponses(prev => {
      const existing = prev[activeExercise.id] || {};
      const answers = [...(existing.blankAnswers || [])];
      answers[blankIdx] = value;

      // check if any blank is still empty to set isLeftBlank
      const expectedCount = activeExercise.blankSolutions?.length || 0;
      let filledCount = 0;
      for (let i = 0; i < expectedCount; i++) {
        if (answers[i]) filledCount++;
      }
      const isBlank = filledCount === 0;

      return {
        ...prev,
        [activeExercise.id]: {
          ...existing,
          blankAnswers: answers,
          isLeftBlank: isBlank
        }
      };
    });
  };

  // Click on word chip to add to order list
  const addWordToOrder = (word: string, indexInPool: number) => {
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    const newPool = [...scrambledPool];
    newPool.splice(indexInPool, 1);
    setScrambledPool(newPool);

    setResponses(prev => ({
      ...prev,
      [activeExercise.id]: {
        ...prev[activeExercise.id],
        orderedWords: newSelected,
        isLeftBlank: false
      }
    }));
  };

  // Click on ordered word chip to return it to pool
  const removeWordFromOrder = (word: string, indexInOrder: number) => {
    const newSelected = [...selectedWords];
    newSelected.splice(indexInOrder, 1);
    setSelectedWords(newSelected);

    const newPool = [...scrambledPool, word];
    setScrambledPool(newPool);

    setResponses(prev => ({
      ...prev,
      [activeExercise.id]: {
        ...prev[activeExercise.id],
        orderedWords: newSelected,
        isLeftBlank: newSelected.length === 0
      }
    }));
  };

  // Reset entire word order
  const resetWordOrdering = () => {
    const original = activeExercise.scrambledWords || [];
    setScrambledPool(original);
    setSelectedWords([]);
    setResponses(prev => ({
      ...prev,
      [activeExercise.id]: {
        ...prev[activeExercise.id],
        orderedWords: [],
        isLeftBlank: true
      }
    }));
  };

  // Handle comprehension rating change (per section)
  const rateComprehension = (rating: number) => {
    if (!currentSectionId) return;
    setSectionRatings(prev => ({
      ...prev,
      [currentSectionId]: rating
    }));
  };

  const handleNext = () => {
    if (currentIdx < sortedExercises.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const triggerAutoFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Save current active question accumulated time before finishing
    const finalResponses = { ...responsesRef.current };
    const currentActiveEx = sortedExercises[currentIdxRef.current];
    if (currentActiveEx) {
      const current = finalResponses[currentActiveEx.id] || {};
      finalResponses[currentActiveEx.id] = {
        ...current,
        timeSpentSeconds: (current.timeSpentSeconds || 0) + activeQuestionSecondsRef.current
      };
    }

    let correctCount = 0;
    const totalQuestions = sortedExercises.length;
    let blankCount = 0;

    const detailedResponses = sortedExercises.map(ex => {
      const resp = finalResponses[ex.id] || {};
      let isCorrect = false;
      let studentAnswerStr = '';
      let correctAnswerStr = '';

      // Check correctness by type
      if (ex.type === 'multiple_choice') {
        const selected = resp.selectedOptionIndex;
        isCorrect = selected !== undefined && selected === ex.correctOptionIndex;
        studentAnswerStr = selected !== undefined && ex.options ? ex.options[selected] : '';
        correctAnswerStr = ex.options && ex.correctOptionIndex !== undefined ? ex.options[ex.correctOptionIndex] : '';
      } 
      else if (ex.type === 'fill_blanks') {
        const studentBlanks = resp.blankAnswers || [];
        const solutions = ex.blankSolutions || [];
        
        const isAllCorrect = solutions.length > 0 && solutions.every((sol, i) => {
          const ans = studentBlanks[i] || '';
          return ans.trim().toLowerCase() === sol.trim().toLowerCase();
        });
        isCorrect = isAllCorrect;
        
        studentAnswerStr = studentBlanks.map((b, i) => `[Lacuna ${i+1}: ${b || 'Em branco'}]`).join(', ');
        correctAnswerStr = solutions.map((s, i) => `[Lacuna ${i+1}: ${s}]`).join(', ');
      } 
      else if (ex.type === 'word_ordering') {
        const ordered = resp.orderedWords || [];
        const studentSent = ordered.join(' ').trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const correctSent = (ex.sentence || '').trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        isCorrect = studentSent === correctSent;
        studentAnswerStr = ordered.join(' ');
        correctAnswerStr = ex.sentence || '';
      } 
      else if (ex.type === 'listening') {
        const selected = resp.selectedOptionIndex;
        isCorrect = selected !== undefined && selected === ex.listeningCorrectIndex;
        studentAnswerStr = selected !== undefined && ex.listeningOptions ? ex.listeningOptions[selected] : '';
        correctAnswerStr = ex.listeningOptions && ex.listeningCorrectIndex !== undefined ? ex.listeningOptions[ex.listeningCorrectIndex] : '';
      }

      if (resp.isLeftBlank) {
        blankCount++;
      } else if (isCorrect) {
        correctCount++;
      }

      const activeSection = sortedSections.find(s => s.id === ex.sectionId);

      return {
        exerciseId: ex.id,
        sectionId: ex.sectionId,
        sectionName: activeSection ? activeSection.name : 'Outros',
        exerciseTitle: ex.title,
        type: ex.type,
        isCorrect,
        studentAnswer: studentAnswerStr || 'Tempo esgotado',
        correctAnswer: correctAnswerStr,
        timeSpentSeconds: resp.timeSpentSeconds || 0,
        understandingRating: sectionRatingsRef.current[ex.sectionId] || 0,
        isLeftBlank: !!resp.isLeftBlank
      };
    });

    const overallScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;

    const sectionGrades = sortedSections.map(sec => {
      const secExercises = sortedExercises.filter(e => e.sectionId === sec.id);
      const secQuestionsCount = secExercises.length;
      let secCorrectCount = 0;

      secExercises.forEach(e => {
        const det = detailedResponses.find(d => d.exerciseId === e.id);
        if (det && det.isCorrect) {
          secCorrectCount++;
        }
      });

      const secGrade = secQuestionsCount > 0 ? (secCorrectCount / secQuestionsCount) * 10 : 0;

      return {
        sectionId: sec.id,
        sectionName: sec.name,
        grammarCategory: sec.grammarCategory,
        totalQuestions: secQuestionsCount,
        correctCount: secCorrectCount,
        grade: secGrade,
        understandingRating: sectionRatingsRef.current[sec.id] || 0
      };
    });

    let maxTime = 0;
    let maxTimeId = '';
    let maxTimeTitle = 'Nenhum';
    
    detailedResponses.forEach(r => {
      if (r.timeSpentSeconds > maxTime) {
        maxTime = r.timeSpentSeconds;
        maxTimeId = r.exerciseId;
        maxTimeTitle = r.exerciseTitle;
      }
    });

    const finalResult: ExamResult = {
      score: overallScore,
      totalQuestions,
      correctCount,
      timeSpentSeconds: totalSecondsRef.current,
      averageTimePerQuestion: totalQuestions > 0 ? totalSecondsRef.current / totalQuestions : 0,
      mostTimeConsumingExerciseId: maxTimeId,
      mostTimeConsumingExerciseTitle: maxTimeTitle,
      mostTimeConsumingSeconds: maxTime,
      blankCount,
      sectionGrades,
      detailedResponses
    };

    onFinish(finalResult);
  };

  const handleExitWithZero = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const detailedResponses = sortedExercises.map(ex => {
      const activeSection = sortedSections.find(s => s.id === ex.sectionId);
      return {
        exerciseId: ex.id,
        sectionId: ex.sectionId,
        sectionName: activeSection ? activeSection.name : 'Outros',
        exerciseTitle: ex.title,
        type: ex.type,
        isCorrect: false,
        studentAnswer: 'Prova abandonada pelo aluno',
        correctAnswer: ex.type === 'multiple_choice' ? (ex.options?.[ex.correctOptionIndex ?? 0] ?? '') : '',
        timeSpentSeconds: 0,
        understandingRating: 0,
        isLeftBlank: true
      };
    });

    const finalResult: ExamResult = {
      score: 0,
      totalQuestions: sortedExercises.length,
      correctCount: 0,
      timeSpentSeconds: totalSecondsRef.current,
      averageTimePerQuestion: 0,
      mostTimeConsumingExerciseId: '',
      mostTimeConsumingExerciseTitle: 'Nenhum',
      mostTimeConsumingSeconds: 0,
      blankCount: sortedExercises.length,
      sectionGrades: sortedSections.map(sec => ({
        sectionId: sec.id,
        sectionName: sec.name,
        grammarCategory: sec.grammarCategory,
        totalQuestions: sortedExercises.filter(e => e.sectionId === sec.id).length,
        correctCount: 0,
        grade: 0,
        understandingRating: 0
      })),
      detailedResponses
    };

    onFinish(finalResult);
  };

  const calculateFinalResults = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Save current active question accumulated time before finishing
    const finalResponses = { ...responses };
    if (activeExercise) {
      const current = finalResponses[activeExercise.id] || {};
      finalResponses[activeExercise.id] = {
        ...current,
        timeSpentSeconds: (current.timeSpentSeconds || 0) + activeQuestionSeconds
      };
    }

    let correctCount = 0;
    const totalQuestions = sortedExercises.length;
    let blankCount = 0;

    const detailedResponses = sortedExercises.map(ex => {
      const resp = finalResponses[ex.id] || {};
      let isCorrect = false;
      let studentAnswerStr = '';
      let correctAnswerStr = '';

      // Check correctness by type
      if (ex.type === 'multiple_choice') {
        const selected = resp.selectedOptionIndex;
        isCorrect = selected !== undefined && selected === ex.correctOptionIndex;
        studentAnswerStr = selected !== undefined && ex.options ? ex.options[selected] : '';
        correctAnswerStr = ex.options && ex.correctOptionIndex !== undefined ? ex.options[ex.correctOptionIndex] : '';
      } 
      else if (ex.type === 'fill_blanks') {
        const studentBlanks = resp.blankAnswers || [];
        const solutions = ex.blankSolutions || [];
        
        // Correct only if all blanks match solutions exactly (case insensitive, trimmed)
        const isAllCorrect = solutions.length > 0 && solutions.every((sol, i) => {
          const ans = studentBlanks[i] || '';
          return ans.trim().toLowerCase() === sol.trim().toLowerCase();
        });
        isCorrect = isAllCorrect;
        
        studentAnswerStr = studentBlanks.map((b, i) => `[Lacuna ${i+1}: ${b || 'Em branco'}]`).join(', ');
        correctAnswerStr = solutions.map((s, i) => `[Lacuna ${i+1}: ${s}]`).join(', ');
      } 
      else if (ex.type === 'word_ordering') {
        const ordered = resp.orderedWords || [];
        const studentSent = ordered.join(' ').trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const correctSent = (ex.sentence || '').trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        isCorrect = studentSent === correctSent;
        studentAnswerStr = ordered.join(' ');
        correctAnswerStr = ex.sentence || '';
      } 
      else if (ex.type === 'listening') {
        const selected = resp.selectedOptionIndex;
        isCorrect = selected !== undefined && selected === ex.listeningCorrectIndex;
        studentAnswerStr = selected !== undefined && ex.listeningOptions ? ex.listeningOptions[selected] : '';
        correctAnswerStr = ex.listeningOptions && ex.listeningCorrectIndex !== undefined ? ex.listeningOptions[ex.listeningCorrectIndex] : '';
      }

      if (resp.isLeftBlank) {
        blankCount++;
      } else if (isCorrect) {
        correctCount++;
      }

      const activeSection = sortedSections.find(s => s.id === ex.sectionId);

      return {
        exerciseId: ex.id,
        sectionId: ex.sectionId,
        sectionName: activeSection ? activeSection.name : 'Outros',
        exerciseTitle: ex.title,
        type: ex.type,
        isCorrect,
        studentAnswer: studentAnswerStr,
        correctAnswer: correctAnswerStr,
        timeSpentSeconds: resp.timeSpentSeconds || 0,
        understandingRating: sectionRatingsRef.current[ex.sectionId] || 0,
        isLeftBlank: !!resp.isLeftBlank
      };
    });

    // Score on a 0-10 scale
    const overallScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;

    // Grades per section
    const sectionGrades = sortedSections.map(sec => {
      const secExercises = sortedExercises.filter(e => e.sectionId === sec.id);
      const secQuestionsCount = secExercises.length;
      let secCorrectCount = 0;

      secExercises.forEach(e => {
        const det = detailedResponses.find(d => d.exerciseId === e.id);
        if (det && det.isCorrect) {
          secCorrectCount++;
        }
      });

      const secGrade = secQuestionsCount > 0 ? (secCorrectCount / secQuestionsCount) * 10 : 0;

      return {
        sectionId: sec.id,
        sectionName: sec.name,
        grammarCategory: sec.grammarCategory,
        totalQuestions: secQuestionsCount,
        correctCount: secCorrectCount,
        grade: secGrade
      };
    });

    // Find exercise with most time spent
    let maxTime = 0;
    let maxTimeId = '';
    let maxTimeTitle = 'Nenhum';
    
    detailedResponses.forEach(r => {
      if (r.timeSpentSeconds > maxTime) {
        maxTime = r.timeSpentSeconds;
        maxTimeId = r.exerciseId;
        maxTimeTitle = r.exerciseTitle;
      }
    });

    const finalResult: ExamResult = {
      score: overallScore,
      totalQuestions,
      correctCount,
      timeSpentSeconds: totalSeconds,
      averageTimePerQuestion: totalQuestions > 0 ? totalSeconds / totalQuestions : 0,
      mostTimeConsumingExerciseId: maxTimeId,
      mostTimeConsumingExerciseTitle: maxTimeTitle,
      mostTimeConsumingSeconds: maxTime,
      blankCount,
      sectionGrades,
      detailedResponses
    };

    onFinish(finalResult);
  };

  const getSectionName = (secId: string) => {
    const sec = sortedSections.find(s => s.id === secId);
    return sec ? sec.name : '';
  };

  const getGrammarCategory = (secId: string) => {
    const sec = sortedSections.find(s => s.id === secId);
    return sec ? sec.grammarCategory : '';
  };

  const currentSectionId = activeExercise?.sectionId;
  const activeSection = sortedSections.find(s => s.id === currentSectionId);
  const currentSectionName = currentSectionId ? getSectionName(currentSectionId) : '';
  const currentGrammarCategory = currentSectionId ? getGrammarCategory(currentSectionId) : '';

  const currentSectionExercises = sortedExercises.filter(ex => ex.sectionId === currentSectionId);
  const indexInSection = currentSectionExercises.findIndex(ex => ex.id === activeExercise?.id);

  // Render blanks nicely by replacing [blank] with styled dropdowns
  const renderFillBlanksText = (exercise: Exercise) => {
    if (!exercise.richText.text) return null;

    const parts = exercise.richText.text.split('[blank]');
    const blankSolutionsCount = exercise.blankSolutions?.length || 0;
    const currentResp = responses[exercise.id] || {};
    const studentBlanks = currentResp.blankAnswers || [];

    return (
      <div className="leading-relaxed text-slate-800 dark:text-slate-100">
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          const blankIdx = index;

          return (
            <React.Fragment key={index}>
              {/* Insert HTML markup formatted text safely for parts */}
              <span dangerouslySetInnerHTML={{ __html: part }} />
              
              {!isLast && blankIdx < blankSolutionsCount && (
                <span className="inline-block mx-1">
                  <select
                    value={studentBlanks[blankIdx] || ''}
                    onChange={(e) => selectBlankChoice(blankIdx, e.target.value)}
                    id={`blank-select-${exercise.id}-${blankIdx}`}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-md px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-100 transition-colors"
                  >
                    <option value="">-- Selecione --</option>
                    {exercise.blankOptions && exercise.blankOptions[blankIdx] ? (
                      exercise.blankOptions[blankIdx].map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>
                          {opt}
                        </option>
                      ))
                    ) : (
                      // Fallback pool of answers
                      exercise.blankSolutions?.map((sol, sIdx) => (
                        <option key={sIdx} value={sol}>
                          {sol}
                        </option>
                      ))
                    )}
                  </select>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showingInstructions) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 p-4 md:p-8 justify-center items-center overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-xl overflow-hidden animate-fade-in flex flex-col">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 rounded-xl p-2.5 font-black text-xl tracking-wider text-white">ELST</div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight">Instruções Importantes</h1>
                <p className="text-xs text-slate-400">Avaliação Geral de Proficiência</p>
              </div>
            </div>
            <div className="bg-slate-800 text-slate-300 font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-slate-700">
              {activeAccessCode.accessCode}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6 flex-1">
            {/* Student metadata */}
            <div className="bg-indigo-50 border border-indigo-100/55 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-900/50 uppercase tracking-wider">Estudante</span>
                <p className="text-sm font-extrabold text-indigo-950">{studentName}</p>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-indigo-900/50 uppercase tracking-wider">CPF</span>
                <p className="text-sm font-bold text-slate-700">{activeAccessCode.studentCpf || 'Não Informado'}</p>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-indigo-900/50 uppercase tracking-wider">Duração</span>
                <p className="text-sm font-bold text-slate-700">
                  {activeAccessCode.timerMode === 'countdown' 
                    ? `${activeAccessCode.countdownDurationMinutes} minutos` 
                    : 'Tempo ilimitado'
                  }
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                Regras para Realização do Teste
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-slate-700">
                  <div className="bg-slate-100 rounded p-1 shrink-0 text-slate-600 mt-0.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-xs leading-relaxed">
                    <strong className="text-slate-900">Não acesse outros sites:</strong> O teste exige foco e exclusividade. Evite sair desta tela ou abrir novas abas no seu navegador.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-700">
                  <div className="bg-slate-100 rounded p-1 shrink-0 text-slate-600 mt-0.5">
                    <Clock className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-xs leading-relaxed">
                    <strong className="text-slate-900">Tempo de realização:</strong> 
                    {activeAccessCode.timerMode === 'countdown' ? (
                      <span> Seu prazo total é de <strong className="text-indigo-600">{activeAccessCode.countdownDurationMinutes} minutos</strong> em contagem regressiva. Ao esgotar o prazo, a prova será submetida automaticamente com o que estiver preenchido.</span>
                    ) : (
                      <span> Você tem prazo indeterminado (em minutos) para responder às questões. O cronômetro registrará o tempo de esforço por questão para análise pedagógica. Uma vez iniciada, você deve terminar.</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-700 bg-red-50 border border-red-100 p-3 rounded-xl">
                  <div className="bg-red-100 rounded p-1 shrink-0 text-red-600 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-xs leading-relaxed text-red-800">
                    <strong className="text-red-950">Abandonar a prova zera a nota:</strong> Se você clicar em "Sair" ou fechar a janela durante a realização da prova, ela será finalizada imediatamente e sua nota final será <strong className="text-red-950">automaticamente ZERADA</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExit}
              id="btn-instructions-back"
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 rounded-xl transition-all text-center cursor-pointer"
            >
              Voltar ao Menu Anterior
            </button>
            <button
              onClick={() => setShowingInstructions(false)}
              id="btn-instructions-start"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow hover:shadow-lg text-center flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Começar a Prova</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full transition-all duration-700 ease-in-out"
      style={{
        background: activeSection?.gradientFrom && activeSection?.gradientTo
          ? `linear-gradient(135deg, ${activeSection.gradientFrom}, ${activeSection.gradientTo})`
          : 'linear-gradient(135deg, #1e1b4b, #0f172a)'
      }}
    >
      {/* EXAM HEADER */}
      <div className="bg-slate-900 text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white rounded-lg p-2 font-black text-lg tracking-wider">ELST</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Avaliação Geral</h1>
            <p className="text-xs text-slate-400">Estudante: <span className="text-indigo-300 font-medium">{studentName}</span></p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`border px-3 py-1.5 rounded-full flex items-center space-x-2 font-mono text-sm font-bold ${
            activeAccessCode.timerMode === 'countdown' && timeLeft < 120 
              ? 'bg-red-950/85 border-red-500 text-red-400 animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-amber-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {activeAccessCode.timerMode === 'countdown'
                ? `${formatTime(timeLeft)} (Restante)`
                : formatTime(totalSeconds)
              }
            </span>
          </div>
          
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1.5 rounded transition-all"
            id="btn-exit-exam"
          >
            Sair
          </button>
        </div>
      </div>

      {/* STEPPROGRESS BAR (CAROUSEL) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-center space-x-2 select-none shrink-0">
        {indexInSection > 2 && (
          <span className="text-slate-400 font-extrabold px-1 text-xs select-none animate-pulse">...</span>
        )}

        {currentSectionExercises.map((ex, idx) => {
          // Only show indexInSection - 2 to indexInSection + 2
          if (idx < indexInSection - 2 || idx > indexInSection + 2) {
            return null;
          }

          const isCurrent = ex.id === activeExercise?.id;
          const isAnswered = !responses[ex.id]?.isLeftBlank;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                const globalIdx = sortedExercises.findIndex(item => item.id === ex.id);
                if (globalIdx !== -1) {
                  setCurrentIdx(globalIdx);
                }
              }}
              id={`step-indicator-${ex.id}`}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110 shadow'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
              title={`Ir para questão ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}

        {indexInSection < currentSectionExercises.length - 3 && (
          <span className="text-slate-400 font-extrabold px-1 text-xs select-none animate-pulse">...</span>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* CURRENT SECTION BOX */}
        <div 
          className="text-white p-4 rounded-xl shadow-sm transition-all duration-300"
          style={{
            background: activeSection?.gradientFrom && activeSection?.gradientTo
              ? `linear-gradient(to right, ${activeSection.gradientFrom}, ${activeSection.gradientTo})`
              : 'linear-gradient(to right, #312e81, #0f172a)',
            color: activeSection?.textColor || '#ffffff'
          }}
        >
          <div className="text-xs font-semibold tracking-wider opacity-80 uppercase">Foco de Gramática</div>
          <h2 className="text-base font-bold">{currentSectionName}</h2>
          <p className="text-xs opacity-90 mt-1">Categoria: <span className="font-semibold">{currentGrammarCategory}</span></p>
        </div>

        {/* EXERCISE CONTENT CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-500 flex items-center space-x-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-indigo-500" />
              <span>QUESTÃO {indexInSection + 1} DE {currentSectionExercises.length} <span className="text-slate-400 font-medium text-xs ml-1">({currentIdx + 1} de {sortedExercises.length} total)</span></span>
            </h3>
            
            <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium uppercase">
              {activeExercise.type === 'multiple_choice' && 'Múltipla Escolha'}
              {activeExercise.type === 'fill_blanks' && 'Preencher Lacunas'}
              {activeExercise.type === 'word_ordering' && 'Ordenar Frase'}
              {activeExercise.type === 'listening' && 'Listening (UK)'}
            </span>
          </div>

          {/* Exercise prompt text rendered with its formatting parameters if not customized per type */}
          <div className="space-y-4">
            {activeExercise.type !== 'fill_blanks' && (
              <div 
                className={`leading-relaxed text-slate-800 ${
                  activeExercise.richText.bold ? 'font-bold' : ''
                } ${
                  activeExercise.richText.italic ? 'italic' : ''
                } ${
                  activeExercise.richText.color || 'text-slate-800'
                } text-${activeExercise.richText.size || 'base'} text-${activeExercise.richText.align || 'left'}`}
                dangerouslySetInnerHTML={{ __html: activeExercise.richText.text }}
              />
            )}

            {/* TYPE SPECIFIC RENDERERS */}

            {/* A) MULTIPLE CHOICE */}
            {activeExercise.type === 'multiple_choice' && activeExercise.options && (
              <div className="grid grid-cols-1 gap-2.5 mt-4">
                {(shuffledIndicesMap[activeExercise.id] || activeExercise.options.map((_, i) => i)).map((originalIdx, renderIdx) => {
                  const option = activeExercise.options![originalIdx];
                  const isSelected = responses[activeExercise.id]?.selectedOptionIndex === originalIdx;
                  return (
                    <button
                      key={renderIdx}
                      type="button"
                      onClick={() => selectOptionMC(originalIdx)}
                      id={`mc-option-${activeExercise.id}-${renderIdx}`}
                      className={`flex items-center text-left p-3 rounded-lg border transition-all font-medium text-sm ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm font-semibold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border text-xs font-bold ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'border-slate-300 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + renderIdx)}
                      </div>
                      <div className="flex-1">{option}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* B) FILL IN BLANKS */}
            {activeExercise.type === 'fill_blanks' && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4 leading-relaxed font-medium">
                {renderFillBlanksText(activeExercise)}
              </div>
            )}

            {/* D) WORD ORDERING */}
            {activeExercise.type === 'word_ordering' && (
              <div className="space-y-4 mt-4 select-none">
                <div className="text-xs font-semibold text-slate-500 uppercase">Sua Frase Ordenada:</div>
                <div className="min-h-16 bg-indigo-50/50 border-2 border-dashed border-indigo-100 rounded-xl p-3 flex flex-wrap gap-2 items-center">
                  {selectedWords.length === 0 ? (
                    <span className="text-slate-400 text-xs italic mx-auto">Selecione as palavras abaixo para formar a frase...</span>
                  ) : (
                    selectedWords.map((word, wIdx) => (
                      <button
                        key={wIdx}
                        onClick={() => removeWordFromOrder(word, wIdx)}
                        id={`ordering-chosen-${wIdx}`}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center space-x-1"
                      >
                        <span>{word}</span>
                        <span className="text-[10px] text-indigo-300">×</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Banco de Palavras:</div>
                  {selectedWords.length > 0 && (
                    <button
                      onClick={resetWordOrdering}
                      id="btn-reset-words"
                      className="text-[11px] text-slate-500 hover:text-red-600 underline font-semibold"
                    >
                      Limpar tudo
                    </button>
                  )}
                </div>

                <div className="bg-slate-100/70 border border-slate-200/50 rounded-xl p-3 flex flex-wrap gap-2 justify-center min-h-16 items-center">
                  {scrambledPool.length === 0 && selectedWords.length > 0 ? (
                    <span className="text-emerald-600 font-bold text-xs flex items-center space-x-1">
                      <Check className="w-4 h-4" /> <span>Todas as palavras organizadas!</span>
                    </span>
                  ) : scrambledPool.map((word, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => addWordToOrder(word, pIdx)}
                      id={`ordering-pool-${pIdx}`}
                      className="bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* E) LISTENING */}
            {activeExercise.type === 'listening' && (
              <div className="space-y-4 mt-4">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
                  <Volume2 className="w-10 h-10 text-indigo-600 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">{activeExercise.listeningBaseText || 'Ouça atentamente'}</h4>
                    <p className="text-xs text-indigo-700 mt-0.5">Áudio gravado em Inglês Britânico (UK Voice)</p>
                  </div>

                  <button
                    onClick={() => playListeningAudio(activeExercise.listeningText || '', activeExercise.id)}
                    disabled={isAudioPlaying}
                    id={`btn-play-audio-${activeExercise.id}`}
                    className={`px-5 py-2.5 rounded-lg font-bold text-xs shadow transition-all flex items-center space-x-2 ${
                      isAudioPlaying
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                    }`}
                  >
                    <Play className="w-4.5 h-4.5" />
                    <span>{isAudioPlaying ? 'Ouvindo...' : 'Tocar Áudio'}</span>
                  </button>

                  <div className="text-xs text-slate-600 font-medium">
                    Reproduções utilizadas:{' '}
                    <span className="font-bold text-indigo-600">{audioPlays[activeExercise.id] || 0}</span> / 3
                  </div>
                </div>

                {/* Sub multiple choice for listening */}
                {activeExercise.listeningQuestion && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-bold text-slate-800">{activeExercise.listeningQuestion}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {(shuffledIndicesMap[activeExercise.id] || activeExercise.listeningOptions!.map((_, i) => i)).map((originalIdx, renderIdx) => {
                        const opt = activeExercise.listeningOptions![originalIdx];
                        const isSelected = responses[activeExercise.id]?.selectedOptionIndex === originalIdx;
                        return (
                          <button
                            key={renderIdx}
                            type="button"
                            onClick={() => selectOptionMC(originalIdx)}
                            id={`listening-option-${activeExercise.id}-${renderIdx}`}
                            className={`flex items-center text-left p-3 rounded-lg border transition-all text-sm ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm font-semibold'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border text-xs font-bold ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : 'border-slate-300 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + renderIdx)}
                            </div>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* UNDERSTANDING SELF-EVALUATION */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Autoavaliação de Compreensão da Seção</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">O quanto você compreende o tema <strong className="text-indigo-600">"{currentSectionName}"</strong> como um todo?</p>
              </div>
              <span className="bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                Seção Atual
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const currentRating = currentSectionId ? (sectionRatings[currentSectionId] || 0) : 0;
                const isSelected = currentRating >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => rateComprehension(star)}
                    id={`star-btn-${star}`}
                    className="p-1 hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-all ${
                        isSelected 
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                          : 'text-slate-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs text-slate-500 ml-2 font-semibold">
                {currentSectionId && sectionRatings[currentSectionId] === 1 && 'Pouco entendimento'}
                {currentSectionId && sectionRatings[currentSectionId] === 2 && 'Entendimento básico'}
                {currentSectionId && sectionRatings[currentSectionId] === 3 && 'Entendimento razoável'}
                {currentSectionId && sectionRatings[currentSectionId] === 4 && 'Bom entendimento'}
                {currentSectionId && sectionRatings[currentSectionId] === 5 && 'Entendimento excelente!'}
                {(!currentSectionId || !sectionRatings[currentSectionId]) && 'Selecione uma avaliação'}
              </span>
            </div>
          </div>
        </div>

        {/* CHECKS BEFORE SUBMITTING */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-100 border border-slate-200 rounded-xl p-4 gap-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Respostas preenchidas: {(Object.values(responses) as Partial<StudentResponse>[]).filter(r => !r.isLeftBlank).length} de {sortedExercises.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Seções avaliadas: {Object.keys(sectionRatings).length} de {sortedSections.length} seções</span>
          </div>
        </div>
      </div>

      {/* EXAM FOOTER CONTROLS */}
      <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          id="btn-prev-question"
          className="flex items-center space-x-2 border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 px-4 py-2.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {currentIdx === sortedExercises.length - 1 ? (
          <button
            onClick={calculateFinalResults}
            id="btn-finish-exam"
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Finalizar e Ver Resultado</span>
            <Check className="w-4.5 h-4.5" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            id="btn-next-question"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Próxima</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* EXIT CONFIRMATION MODAL */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-center text-amber-500">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <div className="space-y-1.5 text-center">
              <h3 className="font-extrabold text-slate-800 text-lg">
                Abandonar Avaliação?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tem certeza de que deseja sair? Seu progresso atual nesta avaliação será perdido e você voltará à tela inicial.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                Continuar Prova
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  handleExitWithZero();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Sim, Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
