import React, { useState, useEffect } from 'react';
import './App.css';

// ひらがな一覧
const hiragana = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん'
];

// バックアップ用の簡易辞書（API呼び出しが失敗した場合に使用）
const fallbackDictionary = [
  'あお', 'あか', 'あめ', 'いし', 'いぬ', 'うみ', 'えき', 'おと',
  'かお', 'かさ', 'きく', 'くつ', 'けん', 'こえ', 'さる', 'しお',
  'すし', 'せき', 'そら', 'たこ', 'ちず', 'つき', 'てら', 'とり',
  'なつ', 'にく', 'ぬま', 'ねこ', 'のり', 'はな', 'ひと', 'ふね',
  'へや', 'ほし', 'まど', 'みず', 'むし', 'めし', 'もり', 'やま',
  'ゆき', 'よる', 'らく', 'りす', 'るす', 'れい', 'ろく', 'わに',
  'あさ', 'いす', 'うた', 'えき', 'おか', 'かみ', 'きた', 'くま',
  'けさ', 'こめ', 'さけ', 'しお', 'すな', 'せん', 'そと'
];

function App() {
  const [board, setBoard] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [message, setMessage] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  // ゲームボードの初期化
  useEffect(() => {
    initializeBoard();
  }, []);

  // ランダムなひらがなでボードを初期化
  const initializeBoard = () => {
    const newBoard = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        const randomIndex = Math.floor(Math.random() * hiragana.length);
        row.push(hiragana[randomIndex]);
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setScore(0);
    setFoundWords([]);
  };

  // セルがすでに選択されているかチェック
  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // 選択したセルが前回選択したセルに隣接しているかチェック
  const isAdjacentToLastSelected = (row, col) => {
    if (selectedCells.length === 0) return true;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    const rowDiff = Math.abs(row - lastCell.row);
    const colDiff = Math.abs(col - lastCell.col);
    
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  };

  // マウスダウン時の処理
  const handleMouseDown = (row, col) => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    const newSelectedCells = [{ row, col }];
    setSelectedCells(newSelectedCells);
    setSelectedWord(board[row][col]);
  };

  // マウス移動時の処理
  const handleMouseEnter = (row, col) => {
    if (!isSelecting) return;
    if (isCellSelected(row, col)) return;
    
    if (isAdjacentToLastSelected(row, col)) {
      const newSelectedCells = [...selectedCells, { row, col }];
      setSelectedCells(newSelectedCells);
      setSelectedWord(newSelectedCells.map(cell => board[cell.row][cell.col]).join(''));
    }
  };

  // マウスアップ時の処理
  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  // JishoAPIで単語チェック
  const checkWordWithJishoAPI = async (word) => {
    try {
      setIsChecking(true);
      setMessage('単語をチェック中...');
      
      const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`);
      const data = await response.json();
      
      // データが存在し、日本語の単語であるかをチェック
      if (data.data && data.data.length > 0) {
        // 検索結果の中から日本語の単語と完全一致するものを探す
        const matchingWord = data.data.find(item => {
          return item.japanese.some(japaneseItem => 
            japaneseItem.reading === word || japaneseItem.word === word
          );
        });
        
        if (matchingWord) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('API呼び出しエラー:', error);
      // API呼び出しに失敗した場合はフォールバック辞書を使用
      return fallbackDictionary.includes(word);
    } finally {
      setIsChecking(false);
    }
  };

  // 単語の存在チェック
  const checkWord = async () => {
    if (selectedWord.length < 2) {
      setMessage('2文字以上の単語を選択してください');
      return;
    }

    if (foundWords.includes(selectedWord)) {
      setMessage(`「${selectedWord}」はすでに見つけています`);
      return;
    }

    // Jisho APIで単語チェック
    const isValidWord = await checkWordWithJishoAPI(selectedWord);

    if (isValidWord) {
      const points = selectedWord.length * 10;
      setScore(prevScore => prevScore + points);
      setFoundWords(prevWords => [...prevWords, selectedWord]);
      setMessage(`「${selectedWord}」は有効な単語です！ +${points}ポイント獲得`);
    } else {
      setMessage(`「${selectedWord}」は辞書に見つかりませんでした`);
    }

    resetSelection();
  };

  // リセットボタン
  const resetSelection = () => {
    setSelectedCells([]);
    setSelectedWord('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Word Puzzle</h1>
      </header>
      <main>
        <div className="game-info">
          <div className="score-area">
            <p>スコア: <strong>{score}</strong></p>
            <p>選択中の単語: <strong>{selectedWord}</strong></p>
          </div>
          {message && <p className="message">{message}</p>}
          <div className="found-words">
            <h3>見つけた単語:</h3>
            <div className="word-list">
              {foundWords.map((word, index) => (
                <span key={index} className="found-word">{word}</span>
              ))}
            </div>
          </div>
          <div className="buttons">
            <button onClick={checkWord} disabled={selectedWord.length < 2 || isChecking}>
              {isChecking ? '確認中...' : '決定'}
            </button>
            <button onClick={resetSelection} disabled={isChecking}>リセット</button>
            <button onClick={initializeBoard} disabled={isChecking}>新しいボード</button>
          </div>
        </div>

        <div 
          className="game-board" 
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
