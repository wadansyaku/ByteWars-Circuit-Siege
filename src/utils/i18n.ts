// Japanese localization for ByteWars: Circuit Siege

export const ja = {
    // Game title
    title: 'バイトウォーズ',
    subtitle: 'サーキット・シージ',
    tagline: 'デジタル軍団を率いて敵の拠点を破壊せよ！',

    // Menu
    startGame: 'ゲームスタート',
    howToPlay: '遊び方',
    settings: '設定',
    back: '戻る',
    selectStage: 'ステージ選択',

    // Stage selection
    stage: 'ステージ',
    locked: 'ロック中',
    unlockHint: '前のステージをクリアして解放',

    // Game UI
    yourBase: '自軍拠点',
    enemyBase: '敵拠点',
    wave: 'ウェーブ',
    energy: 'エネルギー',
    pause: '一時停止',
    resume: '再開',
    paused: 'ポーズ中',

    // Controls
    controlsTitle: '操作方法',
    controlsPC: 'PC: ボタンクリック または 1-6キー',
    controlsMobile: 'スマホ: ボタンタップ',

    // How to play
    objective: '目標',
    objectiveDesc: '敵の拠点を破壊しよう！自軍の拠点が破壊される前に！',
    energyTitle: 'エネルギー',
    energyDesc: 'ユニット召喚に必要。毎秒1回復（最大10）',
    cooldownTitle: 'クールダウン',
    cooldownDesc: '各ユニットは召喚後、一定時間再召喚不可',
    unitTypes: 'ユニット一覧',

    // Result
    victory: '勝利！',
    defeat: '敗北...',
    victoryMessage: 'やった！敵の拠点を破壊した！',
    defeatMessage: '拠点が破壊された...もう一度挑戦しよう！',
    nextStage: '次のステージへ',
    retry: 'リトライ',
    playAgain: 'もう一度',
    backToMenu: 'メニューに戻る',

    // Stats
    stats: '戦績',
    winRate: '勝率',
    totalGames: '総プレイ回数',
    favoriteUnit: 'お気に入りユニット',
    playTime: 'プレイ時間',
    minutes: '分',

    // Units (Japanese names)
    units: {
        byterunner: {
            name: 'バイトランナー',
            description: '高速・低コスト。偵察向き。',
        },
        shieldgolem: {
            name: 'シールドゴーレム',
            description: '高耐久の重装甲。前線の壁役。',
        },
        arcslinger: {
            name: 'アークスリンガー',
            description: '遠距離攻撃。安全な位置から援護。',
        },
        novaburst: {
            name: 'ノヴァバースト',
            description: '範囲攻撃。複数の敵を一掃。',
        },
        syncdrone: {
            name: 'シンクドローン',
            description: '支援型。周囲の味方を強化。',
        },
        hexbit: {
            name: 'ヘックスビット',
            description: '高火力だが短命。決定打に。',
        },
    },

    // Stages (Japanese names)
    stages: {
        1: {
            name: 'ゲートウェイ・プロトコル',
            description: 'チュートリアル。基本操作を学ぼう。',
        },
        2: {
            name: 'ファイアウォール・ブリーチ',
            description: '重装甲の敵が出現。防御を固めろ。',
        },
        3: {
            name: 'システム・オーバーライド',
            description: '全敵タイプ出現。最高難度に挑め！',
        },
        4: {
            name: 'ニューラル・ネットワーク',
            description: '高速な敵が大量に出現。素早い対応を！',
        },
        5: {
            name: 'データ・コア',
            description: '重装甲の敵が接近中。高火力で迎撃せよ。',
        },
        6: {
            name: 'システム・ルート',
            description: '汚染源を特定。オーバーロードを撃破せよ！',
        },
    },

    // Footer
    copyright: '© 2026 バイトウォーズ',
    license: 'MITライセンス',

    // Keyboard hints
    keyHint: 'キー',
    deployHint: '召喚',
};

export type Locale = typeof ja;
