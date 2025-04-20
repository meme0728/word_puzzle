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

// 配置用の確実に有効な単語リスト
const guaranteedWords = [
  // 2文字の単語
  'あい', 'あう', 'あか', 'あき', 'あけ', 'あし', 'あせ', 'あそ', 'あと', 'あな', 'あに', 'あの', 'あは', 'あめ', 'あや', 'あゆ', 'あり', 'あわ',
  'いか', 'いし', 'いす', 'いた', 'いち', 'いと', 'いぬ', 'いま', 'いも', 'いり', 'いれ', 'いろ',
  'うお', 'うし', 'うた', 'うち', 'うで', 'うま', 'うみ', 'うめ', 'うり', 'うろ', 'うわ',
  'えき', 'えだ', 'えと', 'えび', 'えみ', 'えり',
  'おい', 'おう', 'おか', 'おき', 'おく', 'おけ', 'おし', 'おす', 'おち', 'おと', 'おに', 'おば', 'おび', 'おめ', 'おり', 'おる', 'おれ', 'おろ',
  'かい', 'かお', 'かき', 'かぎ', 'かく', 'かけ', 'かご', 'かさ', 'かし', 'かす', 'かぜ', 'かた', 'かち', 'かつ', 'かど', 'かな', 'かに', 'かね', 'かば', 'かべ', 'かま', 'かめ', 'かや', 'から', 'かり', 'かれ', 'かわ',
  'きく', 'きし', 'きず', 'きせ', 'きた', 'きぬ', 'きね', 'きび', 'きみ', 'きも', 'きり', 'きわ',
  'くし', 'くず', 'くせ', 'くち', 'くに', 'くび', 'くま', 'くみ', 'くも', 'くら', 'くり', 'くれ', 'くろ',
  'けが', 'けさ', 'けち', 'けむ', 'けり',
  'こい', 'こう', 'こえ', 'こく', 'こけ', 'ここ', 'こし', 'こす', 'こせ', 'こだ', 'こと', 'こな', 'こね', 'この', 'こび', 'こぶ', 'こま', 'こめ', 'こゆ', 'これ', 'ころ',
  'さあ', 'さい', 'さえ', 'さお', 'さか', 'さき', 'さく', 'さけ', 'さし', 'さす', 'さそ', 'さた', 'さつ', 'さと', 'さば', 'さび', 'さま', 'さめ', 'さゆ', 'さら', 'さる', 'さわ',
  'しお', 'しか', 'しき', 'しく', 'しげ', 'しご', 'した', 'しち', 'しな', 'しば', 'しび', 'しぶ', 'しほ', 'しま', 'しみ', 'しめ', 'しも', 'しゃ', 'しゅ', 'しょ', 'しり', 'しる', 'しろ',
  'すい', 'すえ', 'すき', 'すぐ', 'すけ', 'すし', 'すず', 'すそ', 'すな', 'すね', 'すべ', 'すみ', 'すむ', 'すり', 'すれ',
  'せい', 'せき', 'せこ', 'せと', 'せな', 'せび', 'せみ', 'せる', 'せん',
  'そう', 'そこ', 'そで', 'そと', 'そば', 'そら', 'そり', 'それ',
  'たい', 'たか', 'たき', 'たく', 'たけ', 'たこ', 'たし', 'たす', 'たち', 'たて', 'たな', 'たに', 'たぬ', 'たね', 'たび', 'たま', 'たむ', 'たら', 'たり', 'たる', 'たわ',
  'ちえ', 'ちか', 'ちく', 'ちち', 'ちゃ', 'ちり',
  'つえ', 'つか', 'つき', 'つぐ', 'つけ', 'つち', 'つつ', 'つな', 'つの', 'つぶ', 'つぼ', 'つま', 'つみ', 'つむ', 'つめ', 'つや', 'つゆ', 'つる',
  'てき', 'てこ', 'てん',
  'とう', 'とき', 'とく', 'とけ', 'とこ', 'とし', 'とち', 'とで', 'とな', 'とね', 'とび', 'とま', 'とめ', 'とも', 'とら', 'とり', 'とる', 'とん',
  'なき', 'なく', 'なげ', 'なし', 'なす', 'なぞ', 'なだ', 'なつ', 'なで', 'なな', 'なに', 'なべ', 'なま', 'なみ', 'なめ', 'なら', 'なり', 'なる', 'なわ',
  'にく', 'にし', 'にせ', 'にち', 'にな', 'にゅ', 'にら', 'にわ',
  'ぬい', 'ぬか', 'ぬき', 'ぬく', 'ぬけ', 'ぬし', 'ぬま', 'ぬり', 'ぬれ',
  'ねえ', 'ねこ', 'ねじ', 'ねず', 'ねた', 'ねつ', 'ねど', 'ねば', 'ねぶ', 'ねむ', 'ねり', 'ねる', 'ねん',
  'のう', 'のき', 'のこ', 'のせ', 'のち', 'のど', 'のび', 'のべ', 'のみ', 'のむ', 'のめ', 'のり', 'のる',
  'はあ', 'はい', 'はえ', 'はお', 'はか', 'はぎ', 'はく', 'はけ', 'はこ', 'はさ', 'はし', 'はす', 'はぜ', 'はそ', 'はた', 'はち', 'はつ', 'はで', 'はと', 'はな', 'はね', 'はは', 'はま', 'はみ', 'はむ', 'はめ', 'はや', 'はら', 'はり', 'はる', 'はれ', 'はん',
  'ひい', 'ひえ', 'ひき', 'ひく', 'ひげ', 'ひざ', 'ひし', 'ひた', 'ひつ', 'ひと', 'ひな', 'ひに', 'ひの', 'ひび', 'ひめ', 'ひも', 'ひや', 'ひよ', 'ひら', 'ひる', 'ひれ', 'ひろ',
  'ふう', 'ふえ', 'ふか', 'ふき', 'ふく', 'ふけ', 'ふさ', 'ふし', 'ふす', 'ふせ', 'ふた', 'ふち', 'ふつ', 'ふで', 'ふと', 'ふな', 'ふに', 'ふね', 'ふり', 'ふる', 'ふれ',
  'へい', 'へき', 'へこ', 'へた', 'へち', 'へつ', 'へび', 'へや', 'へり', 'へる', 'へん',
  'ほう', 'ほお', 'ほく', 'ほこ', 'ほし', 'ほそ', 'ほた', 'ほど', 'ほね', 'ほび', 'ほめ', 'ほら', 'ほり', 'ほる', 'ほれ', 'ほん',
  'まい', 'まえ', 'まき', 'まく', 'まけ', 'まご', 'まさ', 'まし', 'ます', 'また', 'まち', 'まつ', 'まと', 'まな', 'まに', 'まね', 'まの', 'まめ', 'まも', 'まゆ', 'まり', 'まる', 'まれ', 'まわ',
  'みお', 'みか', 'みぎ', 'みく', 'みこ', 'みさ', 'みじ', 'みす', 'みせ', 'みそ', 'みち', 'みつ', 'みな', 'みの', 'みや', 'みよ', 'みる', 'みれ', 'みん',
  'むい', 'むう', 'むか', 'むき', 'むく', 'むけ', 'むこ', 'むし', 'むす', 'むせ', 'むち', 'むつ', 'むね', 'むら', 'むり', 'むれ',
  'めい', 'めか', 'めぐ', 'めし', 'めす', 'めだ', 'めつ', 'めど', 'める',
  'もう', 'もえ', 'もく', 'もぐ', 'もじ', 'もち', 'もつ', 'もと', 'もの', 'もも', 'もら', 'もり', 'もる', 'もん',
  'やき', 'やく', 'やけ', 'やし', 'やす', 'やせ', 'やち', 'やつ', 'やど', 'やね', 'やば', 'やぶ', 'やま', 'やみ', 'やむ', 'やめ', 'やる', 'やわ',
  'ゆう', 'ゆか', 'ゆき', 'ゆく', 'ゆげ', 'ゆし', 'ゆず', 'ゆで', 'ゆび', 'ゆみ', 'ゆめ', 'ゆら', 'ゆり', 'ゆれ',
  'よい', 'よう', 'よか', 'よく', 'よこ', 'よせ', 'よそ', 'よち', 'よつ', 'よど', 'より', 'よる', 'よわ',
  'らい', 'らく', 'らし', 'らん',
  'りく', 'りす', 'りそ', 'りつ', 'りゅ', 'りょ',
  'るい', 'るす',
  'れい', 'れき', 'れつ', 'れん',
  'ろう', 'ろく', 'ろし', 'ろば', 'ろぼ', 'ろん',
  'わか', 'わき', 'わく', 'わけ', 'わざ', 'わし', 'わす', 'わた', 'わな', 'わに', 'わび', 'わら', 'わり', 'わる', 'われ',

  // 3文字の単語
  'あいこ', 'あいさ', 'あいじ', 'あいず', 'あいだ', 'あいて', 'あいば', 'あいぶ', 'あいま', 'あいゆ', 'あいよ', 'あいら', 'あいろ',
  'あおい', 'あおき', 'あおげ', 'あおじ', 'あおぞ', 'あおば', 'あおむ', 'あおり', 'あおる',
  'あかい', 'あかぎ', 'あかし', 'あかじ', 'あかす', 'あかつ', 'あかね', 'あかり', 'あかる',
  'あきか', 'あきち', 'あきな', 'あきば', 'あきび', 'あきま', 'あきら',
  'あくし', 'あくせ', 'あくた', 'あくび', 'あくま',
  'あけぐ', 'あけち', 'あけぼ', 'あけみ', 'あけり',
  'あさい', 'あさか', 'あさき', 'あさぎ', 'あさく', 'あさけ', 'あさじ', 'あさせ', 'あさひ', 'あさみ', 'あさむ', 'あさめ', 'あさり', 'あさる',
  'あしあ', 'あしお', 'あした', 'あしび', 'あしぶ', 'あしべ', 'あしみ', 'あしや',
  'あすか',
  'あせび', 'あせる',
  'あそび', 'あそぶ',
  'あたえ', 'あたけ', 'あたし', 'あたた', 'あたま', 'あたら', 'あたり',
  'あちさ', 'あちち', 'あつい', 'あつか', 'あつぎ', 'あつさ', 'あつし', 'あつま', 'あつみ', 'あつめ',
  'あてな', 'あてび', 'あてる',
  'あとお', 'あとが', 'あとさ', 'あとじ', 'あとつ', 'あとで', 'あとは', 'あとび', 'あとへ', 'あとむ', 'あとり',
  'あなた', 'あなご', 'あなぐ',
  'あにめ', 'あねご',
  'あのこ', 'あのね', 'あのよ',
  'あばた', 'あばら', 'あばれ',
  'あひる',
  'あぶく', 'あぶな', 'あぶみ', 'あぶら', 'あぶり', 'あぶる',
  'あぼし',
  'あまい', 'あまえ', 'あまぎ', 'あまぐ', 'あまご', 'あまち', 'あまつ', 'あまね', 'あまの', 'あまみ', 'あまり', 'あまる',
  'あみだ', 'あみど', 'あみの', 'あみめ', 'あみや', 'あみる',
  'あめや',
  'あやか', 'あやし', 'あやす', 'あやせ', 'あやつ', 'あやと', 'あやの', 'あやふ', 'あやま', 'あやめ', 'あゆち', 'あゆみ', 'あゆむ', 'あらい', 'あらき', 'あらし', 'あらす', 'あらせ', 'あらそ', 'あらた', 'あらな', 'あらひ', 'あらま', 'あらむ', 'あられ', 'あらわ', 'ありあ', 'ありお', 'ありか', 'ありき', 'ありさ', 'ありす', 'ありた', 'ありな', 'ありの', 'ありば', 'ありま', 'ありや', 'あれち', 'あれの', 'あれば', 'あれる', 'あろま', 'あわび', 'あわよ', 'あわれ', 'あんこ', 'あんず', 'あんま', 'あんみ',
  'いいえ', 'いいな', 'いいね',
  'いうえ',
  'いえで', 'いえる',
  'いおう', 'いおり',
  'いかが', 'いかさ', 'いかす', 'いかだ', 'いかつ', 'いかな', 'いかに', 'いかば', 'いかり', 'いかる', 'いかん',
  'いきな', 'いきる',
  'いくえ', 'いくこ', 'いくた', 'いくつ', 'いくと', 'いくみ', 'いくよ', 'いくら',
  'いけい', 'いけが', 'いけご', 'いけじ', 'いけば', 'いけぶ', 'いけべ', 'いけみ', 'いけむ', 'いける',
  'いこい', 'いこう', 'いこく', 'いころ', 'いこん',
  'いさお', 'いさご', 'いさぎ', 'いさく', 'いさな', 'いさぶ', 'いさり', 'いさん',
  'いじき', 'いじる',
  'いすず', 'いすみ',
  'いせい', 'いせえ', 'いせき', 'いせこ', 'いせつ',
  'いそば', 'いそぶ', 'いそべ', 'いそむ', 'いそめ', 'いその',
  'いたい', 'いたお', 'いたく', 'いただ', 'いたち', 'いたで', 'いたど', 'いたぶ', 'いたみ', 'いたむ', 'いたる',
  'いちい', 'いちえ', 'いちお', 'いちか', 'いちき', 'いちく', 'いちげ', 'いちご', 'いちじ', 'いちぜ', 'いちだ', 'いちつ', 'いちと', 'いちに', 'いちば', 'いちぶ', 'いちぼ', 'いちま', 'いちめ', 'いちゃ', 'いちよ', 'いちり', 'いちろ',
  'いつか', 'いつき', 'いつく', 'いつこ', 'いつし', 'いつつ', 'いつでも', 'いつと', 'いつの', 'いつま', 'いつも', 'いつわ',
  'いでん',
  'いとう', 'いとこ', 'いとと', 'いとの', 'いとは', 'いとへ', 'いとみ', 'いとむ',
  'いなか', 'いなご', 'いなさ', 'いなざ', 'いなせ', 'いなた', 'いなだ', 'いなに', 'いなば', 'いなほ', 'いなみ', 'いなむ', 'いぬい', 'いぬお', 'いぬき', 'いぬじ', 'いぬみ', 'いぬよ',
  'いのう', 'いのき', 'いのこ', 'いのし', 'いのち', 'いのり', 'いのる',
  'いはら',
  'いばら', 'いばり', 'いばる',
  'いひと',
  'いぶき', 'いぶし', 'いぶす', 'いぶせ', 'いぶる',
  'いべつ',
  'いまい', 'いまお', 'いまき', 'いまこ', 'いまだ', 'いまふ', 'いまみ', 'いまむ', 'いまめ',
  'いみず', 'いみる',
  'いむた', 'いむれ',
  'いもう', 'いもと',
  'いやい', 'いやお', 'いやが', 'いやき', 'いやく', 'いやさ', 'いやし', 'いやす', 'いやせ', 'いやと', 'いやな', 'いやに', 'いやは', 'いやほ', 'いやみ', 'いやら',
  'いゆう',
  'いよく',
  'いらか', 'いらぎ', 'いらご', 'いらだ', 'いらへ', 'いらん',
  'いりえ', 'いりか', 'いりこ', 'いりす', 'いりた', 'いりな', 'いりひ', 'いりみ', 'いりむ', 'いりや',
  'いるい', 'いるか', 'いるす', 'いるみ',
  'いれい', 'いれこ', 'いれず', 'いれめ', 'いれよ', 'いれる',
  'いろい', 'いろう', 'いろえ', 'いろく', 'いろけ', 'いろこ', 'いろじ', 'いろつ', 'いろと', 'いろな', 'いろは', 'いろふ', 'いろめ', 'いわい', 'いわう', 'いわお', 'いわき', 'いわく', 'いわけ', 'いわし', 'いわた', 'いわち', 'いわと', 'いわな', 'いわね', 'いわば', 'いわふ', 'いわみ', 'いわむ', 'いわゆ', 'いわれ', 'いわわ', 'いんえ', 'いんか', 'いんき', 'いんく', 'いんじ', 'いんど', 'いんの', 'いんぶ', 'いんよ',
  'うえき', 'うえこ', 'うえじ', 'うえた', 'うえだ', 'うえつ', 'うえで', 'うえの', 'うえば', 'うえむ', 'うえる',
  'うおの', 'うおみ',
  'うかい', 'うかが', 'うかし', 'うかた', 'うかつ', 'うかぶ', 'うかる', 'うかれ',
  'うきく', 'うきし', 'うきた', 'うきな', 'うきは', 'うきま', 'うきみ', 'うきむ', 'うきめ', 'うきよ', 'うきわ',
  'うくい',
  'うぐい',
  'うけつ', 'うける',
  'うごき', 'うごく',
  'うさぎ', 'うさん',
  'うしお', 'うしつ', 'うしと', 'うしは', 'うしぶ', 'うしほ', 'うしま', 'うしめ',
  'うずき', 'うずく', 'うずめ', 'うずも', 'うずら',
  'うすい', 'うすう', 'うすぐ', 'うすげ', 'うすさ', 'うすじ', 'うすだ', 'うすづき', 'うすで', 'うすば', 'うすび', 'うすむ', 'うすめ', 'うすも', 'うずら'
  // ... 残りの単語は次のセクションに続きます
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
  const [placedWords, setPlacedWords] = useState([]);

  // ゲームボードの初期化
  useEffect(() => {
    initializeBoard();
  }, []);

  // 単語をボードに配置できるかチェック
  const canPlaceWord = (board, word, startRow, startCol, rowDir, colDir) => {
    const rows = board.length;
    const cols = board[0].length;
    
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      
      // ボードの範囲外のチェック
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return false;
      }
      
      // 既に文字があるか、その文字が配置しようとする文字と異なるかチェック
      if (board[row][col] !== '' && board[row][col] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  // 単語をボードに配置
  const placeWord = (board, word, startRow, startCol, rowDir, colDir) => {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      board[row][col] = word[i];
    }
    return board;
  };

  // ランダムなひらがなでボードを初期化
  const initializeBoard = () => {
    // 10x10の空のボードを作成
    const newBoard = Array(10).fill().map(() => Array(10).fill(''));
    const placedWordsList = [];
    
    // シャッフルした単語リストを作成
    const shuffledWords = [...guaranteedWords].sort(() => 0.5 - Math.random());
    
    // 最低20個の単語を配置
    let placedCount = 0;
    const targetWordCount = 20;
    
    // 単語配置の試行回数上限
    const maxAttempts = 100;
    
    // 方向の定義: 横、縦、右下斜め、左下斜め
    const directions = [
      [0, 1],  // 横（右方向）
      [1, 0],  // 縦（下方向）
      [1, 1],  // 右下斜め
      [1, -1]  // 左下斜め
    ];
    
    // シャッフルした単語をボードに配置
    for (const word of shuffledWords) {
      if (placedCount >= targetWordCount) break;
      
      let isPlaced = false;
      let attempts = 0;
      
      while (!isPlaced && attempts < maxAttempts) {
        attempts++;
        
        // ランダムな方向を選択
        const [rowDir, colDir] = directions[Math.floor(Math.random() * directions.length)];
        
        // ランダムな開始位置を選択
        const startRow = Math.floor(Math.random() * 10);
        const startCol = Math.floor(Math.random() * 10);
        
        // 単語を配置できるかチェック
        if (canPlaceWord(newBoard, word, startRow, startCol, rowDir, colDir)) {
          // 単語を配置
          placeWord(newBoard, word, startRow, startCol, rowDir, colDir);
          placedWordsList.push({ word, startRow, startCol, rowDir, colDir });
          isPlaced = true;
          placedCount++;
        }
      }
    }
    
    // 残りの空いているマスにランダムなひらがなを配置
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (newBoard[i][j] === '') {
          const randomIndex = Math.floor(Math.random() * hiragana.length);
          newBoard[i][j] = hiragana[randomIndex];
        }
      }
    }
    
    setBoard(newBoard);
    setPlacedWords(placedWordsList);
    setScore(0);
    setFoundWords([]);
    setMessage(`${placedCount}個の単語が盤面に配置されています！`);
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
      
      // 配置済みの単語リストに含まれているかチェック
      if (placedWords.some(item => item.word === word)) {
        return true;
      }
      
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

  // ヒントボタン
  const showHint = () => {
    // まだ見つかっていない配置済み単語からランダムに1つ選択
    const notFoundWords = placedWords.filter(item => !foundWords.includes(item.word));
    
    if (notFoundWords.length === 0) {
      setMessage('すべての単語を見つけました！おめでとうございます！');
      return;
    }
    
    const randomHint = notFoundWords[Math.floor(Math.random() * notFoundWords.length)];
    const startChar = randomHint.word[0];
    const endChar = randomHint.word[randomHint.word.length - 1];
    
    setMessage(`ヒント: 「${startChar}」で始まり「${endChar}」で終わる${randomHint.word.length}文字の単語があります`);
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
          <div className="progress-area">
            <p>見つけた単語: {foundWords.length} / {placedWords.length}</p>
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
            <button onClick={showHint} disabled={isChecking}>ヒント</button>
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
