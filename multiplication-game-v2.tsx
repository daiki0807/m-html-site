import React, { useState, useEffect } from 'react';
import { Star, Heart, Trophy, RotateCcw, Settings } from 'lucide-react';

const MultiplicationGame = () => {
  const [currentProblem, setCurrentProblem] = useState({ num1: 2, num2: 3 });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [gameMode, setGameMode] = useState('menu'); // 'menu', 'game'
  const [selectedTable, setSelectedTable] = useState('random'); // 'random', '1', '2', etc.
  const [difficulty, setDifficulty] = useState('normal'); // 'easy', 'normal'
  const [easyModeProgress, setEasyModeProgress] = useState(1); // 簡単モードの進行状況（1〜9）
  const [easyModeComplete, setEasyModeComplete] = useState(false); // 簡単モード完了フラグ

  // 問題生成関数
  const generateProblem = () => {
    if (selectedTable === 'random') {
      // ランダムモード
      const maxNum = Math.min(5 + level, 9);
      const num1 = Math.floor(Math.random() * maxNum) + 1;
      const num2 = Math.floor(Math.random() * maxNum) + 1;
      return { num1, num2 };
    } else {
      // 特定の段の練習 - 必ず選択した段が最初に来る
      const fixedNum = parseInt(selectedTable);
      let otherNum;
      
      if (difficulty === 'easy') {
        // 簡単モード：順番に1〜9
        otherNum = easyModeProgress;
      } else {
        // 通常モード：1〜9
        otherNum = Math.floor(Math.random() * 9) + 1;
      }
      
      return { num1: fixedNum, num2: otherNum };
    }
  };

  const checkAnswer = () => {
    const correctAnswer = currentProblem.num1 * currentProblem.num2;
    const answer = parseInt(userAnswer);

    if (answer === correctAnswer) {
      setScore(score + 10 + (level * 5));
      setStreak(streak + 1);
      
      // 簡単モードの進行チェック
      if (difficulty === 'easy') {
        if (easyModeProgress >= 9) {
          // 簡単モード完了！
          setEasyModeComplete(true);
          setFeedback('🎉 かんたんモード ぜんぶクリア！すばらしい！');
          setTimeout(() => {
            setGameOver(true);
          }, 2000);
          return;
        } else {
          // 次の問題へ進む
          const nextProgress = easyModeProgress + 1;
          setEasyModeProgress(nextProgress);
          setFeedback(`せいかい！つぎは ${selectedTable} × ${nextProgress} だよ！`);
          
          // 簡単モードでは次の問題を直接設定
          setTimeout(() => {
            setCurrentProblem({ num1: parseInt(selectedTable), num2: nextProgress });
            setUserAnswer('');
            setFeedback('');
          }, 1500);
          return;
        }
      } else {
        setFeedback('せいかい！✨');
        
        // レベルアップ判定（ランダムモードのみ）
        if (selectedTable === 'random' && streak > 0 && (streak + 1) % 5 === 0) {
          setLevel(level + 1);
          setFeedback(`せいかい！レベル${level + 1}になったよ！🎉`);
        }
      }
      
      setTimeout(() => {
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setFeedback('');
      }, 1500);
    } else {
      setLives(lives - 1);
      setStreak(0);
      setFeedback(`ざんねん... こたえは ${correctAnswer} だよ`);
      setShowAnswer(true);
      
      if (lives <= 1) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          setCurrentProblem(generateProblem());
          setUserAnswer('');
          setFeedback('');
          setShowAnswer(false);
        }, 2500);
      }
    }
  };

  const startGame = (mode, diff = 'normal') => {
    setSelectedTable(mode);
    setDifficulty(diff);
    setGameMode('game');
    setUserAnswer('');
    setScore(0);
    setLives(3);
    setGameOver(false);
    setFeedback('');
    setShowAnswer(false);
    setLevel(1);
    setStreak(0);
    setEasyModeProgress(1); // 簡単モードのリセット
    setEasyModeComplete(false);
    
    // 問題を生成する前にselectedTableを設定する必要があるため、直接生成
    let newProblem;
    if (mode === 'random') {
      const maxNum = Math.min(5 + 1, 9);
      const num1 = Math.floor(Math.random() * maxNum) + 1;
      const num2 = Math.floor(Math.random() * maxNum) + 1;
      newProblem = { num1, num2 };
    } else {
      const fixedNum = parseInt(mode);
      let otherNum;
      
      if (diff === 'easy') {
        // 簡単モード：最初は1から
        otherNum = 1;
      } else {
        // 通常モード：1〜9
        otherNum = Math.floor(Math.random() * 9) + 1;
      }
      
      newProblem = { num1: fixedNum, num2: otherNum };
    }
    setCurrentProblem(newProblem);
  };

  const backToMenu = () => {
    setGameMode('menu');
    setGameOver(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userAnswer && !gameOver) {
      checkAnswer();
    }
  };

  // メニュー画面
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <h1 className="text-4xl font-bold text-purple-600 mb-8">かけざんゲーム</h1>
            <p className="text-lg text-gray-600 mb-8">れんしゅうしたいもんだいをえらんでね！</p>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* ランダムモード */}
              <button
                onClick={() => startGame('random')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-xl font-bold hover:scale-105 transform transition-all duration-200 shadow-lg"
              >
                🎲 ランダム<br />
                <span className="text-sm">いろいろなもんだい</span>
              </button>

              {/* 各段の練習 */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <div key={num} className="space-y-2">
                    <button
                      onClick={() => startGame(num.toString(), 'normal')}
                      className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white p-4 rounded-2xl text-lg font-bold hover:scale-105 transform transition-all duration-200 shadow-lg"
                    >
                      {num}のだん<br />
                      <span className="text-sm">{num} × 1〜9</span>
                    </button>
                    <button
                      onClick={() => startGame(num.toString(), 'easy')}
                      className="w-full bg-gradient-to-r from-green-300 to-yellow-400 text-white p-3 rounded-xl text-sm font-bold hover:scale-105 transform transition-all duration-200 shadow-md"
                    >
                      🌟 {num}のだん（かんたん）<br />
                      <span className="text-xs">{num} × 1〜9 じゅんばん</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ゲーム終了画面
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
          <h2 className="text-3xl font-bold text-purple-600 mb-4">ゲームしゅうりょう！</h2>
          <div className="text-2xl font-bold text-gray-700 mb-2">
            さいしゅうスコア: {score}てん
          </div>
          {selectedTable === 'random' && (
            <div className="text-lg text-gray-600 mb-4">
              さいこうレベル: {level}
            </div>
          )}
          <div className="text-lg text-gray-600 mb-6">
            れんしゅうした: {selectedTable === 'random' ? 'ランダム' : `${selectedTable}のだん`}
            {difficulty === 'easy' && easyModeComplete && (
              <div className="text-green-600 font-bold mt-2">
                かんたんモード ぜんぶクリア！🌟
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startGame(selectedTable, difficulty)}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:scale-105 transform transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <RotateCcw size={20} />
              もういちど
            </button>
            <button
              onClick={backToMenu}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold hover:scale-105 transform transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <Settings size={20} />
              メニューへ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ゲーム画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={24} />
              <span className="text-xl font-bold text-gray-700">{score}てん</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {selectedTable === 'random' ? `レベル ${level}` : 
                 `${selectedTable}のだん${difficulty === 'easy' ? '（かんたん）' : ''}`}
              </div>
              <button
                onClick={backToMenu}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                メニューへもどる
              </button>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={i < lives ? "text-red-500" : "text-gray-300"}
                  size={24}
                  fill={i < lives ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* メイン問題エリア */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {difficulty === 'easy' && (
            <div className="mb-4">
              <div className="text-lg font-bold text-purple-600 mb-2">
                {selectedTable}のだん（かんたん）
              </div>
              <div className="text-sm text-gray-600">
                しんちょく: {easyModeProgress}/9
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(easyModeProgress / 9) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {streak >= 3 && difficulty !== 'easy' && (
            <div className="mb-4 text-yellow-600 font-bold animate-bounce">
              🔥 {streak}れんぞくせいかい！
            </div>
          )}

          <div className="text-6xl font-bold text-gray-800 mb-8">
            {currentProblem.num1} × {currentProblem.num2} = ?
          </div>

          {!showAnswer && (
            <div className="mb-6">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-4xl text-center border-4 border-purple-300 rounded-2xl p-4 w-32 focus:border-purple-500 focus:outline-none"
                placeholder="?"
                autoFocus
              />
            </div>
          )}

          {feedback && (
            <div className={`text-2xl font-bold mb-6 ${
              feedback.includes('せいかい') ? 'text-green-600' : 'text-orange-600'
            }`}>
              {feedback}
            </div>
          )}

          {!showAnswer && userAnswer && (
            <button
              onClick={checkAnswer}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full text-2xl font-bold hover:scale-105 transform transition-all duration-200 shadow-lg"
            >
              こたえる！
            </button>
          )}

          {/* ヒント表示 */}
          <div className="mt-8 text-gray-600">
            <p className="text-sm">
              ヒント: {currentProblem.num1} を {currentProblem.num2} かい たしてみよう！
            </p>
          </div>
        </div>

        {/* 激励メッセージ */}
        <div className="mt-6 text-center">
          <div className="bg-white bg-opacity-80 rounded-xl p-4">
            <p className="text-purple-700 font-bold">
              {lives === 3 ? "がんばって！" : 
               lives === 2 ? "あと2かい まちがえられるよ！" : 
               "さいごの1かい！きをつけて！"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplicationGame;