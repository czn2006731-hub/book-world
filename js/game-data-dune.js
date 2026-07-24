(function() {
    function L(zh,en,ja){return {zh:zh,en:en||zh,ja:ja||zh};}
    var segments = [
        {type:"event",date:L("10191 AG, 卡拉丹 – 出发前一周","10191 AG, Caladan – One week before departure","10191 AG、カラダン — 出発の一週間前"),
            text:L(
                "出发前往阿拉吉斯的前一周，卡拉丹城堡笼罩在紧张气氛中。深夜，一位神秘的老太婆——圣母凯斯·海伦·莫希阿姆——被引入城堡。母亲杰西卡在门外恭敬侍立。你知道这个老太婆是皇帝的真相师，比·吉斯特姐妹会的重要人物。你也知道她今晚来的目的——考验你。",
                "One week before departing for Arrakis, Castle Caladan is shrouded in tension. Late at night, a mysterious old woman — the Reverend Mother Gaius Helen Mohiam — is ushered into the castle. Your mother Jessica waits respectfully outside the door. You know this crone is the Emperor's Truthsayer, an important figure of the Bene Gesserit Sisterhood. And you know why she has come tonight — to test you.",
                "アラキスへの出発の一週間前、カラダン城は緊張に包まれている。深夜、謎めいた老女——尊母ガイウス・ヘレン・モヒアム——が城に招き入れられる。母ジェシカは扉の外で恭しく控えている。この老婆が皇帝の真実告解者、ベネ・ゲセリット教団の重要人物だと知っている。今夜彼女が来た目的も——お前を試すためだ。"
            )},
        {type:"event",text:L(
            "你是一个现代青年，一觉醒来发现自己穿越到了《沙丘》的世界。你成了保罗·亚崔迪——公爵雷多·亚崔迪的独子，杰西卡女士的儿子。你知道原剧情的走向：圣母的考验、前往阿拉吉斯、遇见弗雷曼人、成为救世主。但你也知道这条路布满血与火。",
            "You are a modern youth who wakes up transmigrated into the world of Dune. You have become Paul Atreides — the only son of Duke Leto Atreides and the Lady Jessica. You know how the original story unfolds: the Reverend Mother's test, the journey to Arrakis, meeting the Fremen, becoming the messiah. But you also know this path is paved with blood and fire.",
            "あなたは現代の青年。目覚めると『デューン』の世界に転生していた。あなたはポール・アトレイデスとなった——レト・アトレイデス公爵の一人息子、ジェシカ様の子だ。原作の展開を知っている：尊母の試練、アラキスへの旅、フレメンとの出会い、救世主となる運命。しかしこの道が血と炎で舗装されていることも知っている。"
        )},
        {type:"action",text:L(
            "母亲来叫你。你知道今天要面对什么——那个老太婆和她的毒针。你走进早祷室，圣母已经在那里等候，手中拿着一个绿色的金属盒子和一枚细长的毒针——高姆佳巴。她开口说：测试开始。",
            "Your mother comes to call you. You know what awaits today — the old woman and her poison needle. You enter the morning prayer room where the Reverend Mother already waits, holding a green metal box and a slender poison needle — the Gom Jabbar. She speaks: 'The test begins.'",
            "母が呼びに来る。今日何が待っているか分かっている——あの老婆と毒針だ。朝の祈りの部屋に入ると、尊母がすでに待っている。手には緑色の金属箱と細長い毒針——ゴム・ジャバー。彼女が言う：「試練を始める」。"
        ), choices:[
            {label:L("按原剧情，将手放进盒子","Follow the plot: place your hand in the box","原作通り、箱に手を入れる"),original:true,result:L("你按照原剧情的走向，将右手放进盒子。灼烧般的剧痛从指尖开始蔓延——像烧红的铁丝在体内游走。毒针抵在脖子上，你无法抽手。你知道这是比·吉斯特的恐惧考验，你必须背诵恐惧祷文。疼痛一波接一波，但你坚持住了。","You follow the original plot and place your right hand into the box. A searing pain spreads from your fingertips — like a red-hot wire crawling through your body. The poison needle presses against your neck; you cannot pull your hand out. You know this is the Bene Gesserit test of fear. You must recite the Litany Against Fear. Wave after wave of pain, but you endure.","原作通りに右手を箱に入れる。灼熱の痛みが指先から広がる——焼けた針金が体内を這うようだ。毒針が首に押し当てられ、手を引くことはできない。これがベネ・ゲセリットの恐怖の試練だと知っている。恐怖への祈りを唱えなければならない。痛みが次々と押し寄せるが、耐え抜く。"),fateDelta:0,moodDelta:5},
            {label:L("在圣母开口前先说话","Speak before the Reverend Mother does","尊母が口を開く前に話す"),original:false,result:L("你没有等她开口，而是先说：我知道这是考验，圣母。我知道盒子里是高姆佳巴，我知道你来自比·吉斯特姐妹会。老太婆震惊了——没有人应该知道这些。她放下毒针，开始认真审视你。你提前揭露了她的秘密。","You don't wait for her to speak. Instead you say: 'I know this is a test, Reverend Mother. I know what's in the box is the Gom Jabbar. I know you are from the Bene Gesserit Sisterhood.' The old woman is stunned — no one should know these things. She lowers the poison needle and studies you intently. You've exposed her secrets ahead of time.","彼女が口を開くのを待たずに言う：「これが試練だと知っています、尊母。箱の中身がゴム・ジャバーだと、あなたがベネ・ゲセリット教団の者だと」。老婆は衝撃を受ける——誰も知るはずのないことだ。彼女は毒針を下ろし、真剣にあなたを見つめる。あなたは彼女の秘密を先に暴いた。"),fateDelta:15,moodDelta:10},
            {label:L("拒绝将手放进去","Refuse to place your hand in the box","箱に手を入れるのを拒否する"),original:false,result:L("你后退一步：我不接受这个考验。圣母眯起眼睛：你害怕了？你摇头：不，我只是不想被别人决定命运。圣母沉默了很久，然后说：你比我预期的更有趣。她收起盒子，但你注意到她看你的眼神变了——带着一丝警惕。","You step back: 'I refuse this test.' The Reverend Mother narrows her eyes: 'You are afraid?' You shake your head: 'No, I simply don't want others to decide my fate.' The Reverend Mother is silent for a long time, then says: 'You are more interesting than I expected.' She puts away the box, but you notice her gaze has changed — tinged with wariness.","一歩後退する：「この試練は受けません」。尊母が目を細める：「恐れているのか？」あなたは首を振る：「いいえ、他人に運命を決められたくないだけです」。尊母は長く沈黙した後、言う：「予想以上に面白い」。彼女は箱をしまうが、その視線が変わったことに気づく——警戒の色を帯びている。"),fateDelta:-5,moodDelta:5},
            {label:L("问圣母更多关于比·吉斯特的问题","Ask more about the Bene Gesserit","ベネ・ゲセリットについてもっと尋ねる"),original:false,result:L("你直视圣母：你们姐妹会想要什么？为什么选中我？圣母一愣，随即开始解释——你们在等待一个能连接过去与未来的人，一个科维扎基·哈得那奇。你打断她：我知道这个说法，但我想知道为什么是我。圣母第一次露出了困惑的表情。","You look the Reverend Mother straight in the eye: 'What does your Sisterhood want? Why me?' She pauses, then begins to explain — they've been waiting for one who can bridge past and future, a Kwisatz Haderach. You interrupt: 'I know the term, but I want to know — why me?' For the first time, the Reverend Mother shows a look of genuine confusion.","尊母をまっすぐに見つめる：「教団は何を求めている？なぜ私なんだ？」彼女は一瞬止まり、説明し始める——過去と未来をつなぐ者、クウィサッツ・ハデラックを待っていたと。あなたは遮る：「その言葉は知っている。しかしなぜ私なのか知りたい」。初めて尊母は困惑した表情を見せる。"),fateDelta:20,moodDelta:8}
        ]},
        {type:"event",text:L(
            "卡拉丹城堡的训练室里回荡着屏蔽场的嗡鸣声。你手握双刃短剑，等待着今天的对练伙伴——哥尼·哈莱克。你知道他是父亲麾下最好的战士，也是你未来最忠实的朋友。",
            "The hum of shield-fields fills the training room of Castle Caladan. You grip your double-edged short sword, waiting for today's sparring partner — Gurney Halleck. You know he is your father's best warrior and will become your most loyal friend.",
            "カラダン城の訓練室にシールドのうなりが響く。両刃の短剣を握り、今日の組手の相手を待つ——ガーニー・ハレック。彼が父の最良の戦士であり、未来の最も忠実な友となることを知っている。"
        )},
        {type:"action",text:L(
            "哥尼推门走了进来，背着那把九弦巴喱斯琴。他脸上的伤疤在晨光中格外醒目——那是哈可宁人在奴隶坑里留下的永久记号。他没有像往常那样先弹曲子，表情严肃。",
            "Gurney pushes through the door, his nine-string baliset slung across his back. The scar on his face is stark in the morning light — a permanent mark left by the Harkonnens in the slave pits. He doesn't play a tune first as usual. His expression is grim.",
            "ガーニーが扉を押し開けて入ってくる。九弦のバリセットを背に負っている。朝日の中で彼の顔の傷跡が一際目立つ——ハルコンネン家が奴隷坑で残した永遠の印だ。彼はいつものようにまず曲を弾かない。表情は険しい。"
        ), choices:[
            {label:L("按原剧情，进行对练","Follow the plot: spar with him","原作通り、組手を行う"),original:true,result:L("你们在屏蔽场中激烈交锋。哥尼的攻势凶猛得不像训练，他在逼你认真。最终你们打成平局——你的锥针抵住他的颈静脉，他的短剑也抵住了你的大腿。哥尼满意地笑了：你很像你父亲。","You clash fiercely within the shield-fields. Gurney's attacks are too fierce for mere training — he's forcing you to take it seriously. In the end, you reach a draw — your needle point at his jugular, his short sword at your thigh. Gurney smiles with satisfaction: 'You are much like your father.'","シールドの中で激しく打ち合う。ガーニーの攻めは訓練とは思えないほど激しい——本気を出させようとしている。最終的に引き分け——君の針が彼の頸静脈に、彼の短剣が君の腿に。ガーニーは満足げに笑う：「お前は父親によく似ている」。"),fateDelta:5,moodDelta:5},
            {label:L("提前问哈可宁的阴谋","Ask about Harkonnen plots ahead of time","先にハルコンネンの陰謀を尋ねる"),original:false,result:L("你直接问：哥尼，阿拉吉斯是不是有危险？哥尼一愣：你怎么知道？你告诉他你有预感。哥尼沉默了一会儿，然后说：哈可宁不会轻易放弃阿拉吉斯，那里有陷阱。你提前获得了原剧情中后来才知道的信息。","You ask directly: 'Gurney, is there danger on Arrakis?' He freezes: 'How do you know?' You tell him you have a feeling. He pauses, then says: 'The Harkonnens won't give up Arrakis easily. There are traps there.' You've obtained information that in the original story was revealed much later.","直接尋ねる：「ガーニー、アラキスに危険があるのか？」彼は固まる：「なぜ分かる？」予感がすると伝える。彼は少し黙った後言う：「ハルコンネンは簡単にアラキスを諦めない。罠がある」。原作ではずっと後に明かされる情報を先に得た。"),fateDelta:15,moodDelta:8},
            {label:L("告诉哥尼关于未来的事","Tell Gurney about the future","ガーニーに未来について話す"),original:false,result:L("你压低声音：哥尼，我知道一些即将发生的事。阿拉吉斯会有危险，但我们可以提前准备。哥尼皱眉：你在说什么？你告诉他你有'预知'能力。哥尼半信半疑，但决定暂时相信你。你有了一个强大的盟友。","You lower your voice: 'Gurney, I know some things that are about to happen. Arrakis holds danger, but we can prepare in advance.' He frowns: 'What are you talking about?' You tell him you have 'prescience'. He's skeptical but decides to trust you for now. You've gained a powerful ally.","声を潜める：「ガーニー、もうすぐ起こることを知っている。アラキスには危険があるが、事前に準備できる」。彼は眉をひそめる：「何を言っているんだ？」あなたは「予知」能力があると伝える。彼は半信半疑だが、とりあえず信じることにした。強力な味方を得た。"),fateDelta:20,moodDelta:5},
            {label:L("不练剑，直接聊弗雷曼人","Skip sparring, talk about Fremen instead","組手をせず、フレメンについて話す"),original:false,result:L("你放下武器：哥尼，我想知道弗雷曼人的事。哥尼一愣，然后开始讲述——他们是沙漠的主人，能在最恶劣的环境中生存，甚至能和沙虫交流。你提前获得了这个原剧情中后来才知道的关键信息。","You set down your weapon: 'Gurney, I want to know about the Fremen.' He pauses, then begins — they are the masters of the desert, capable of surviving the harshest conditions, even communicating with the sandworms. You've gained this key information from the original story's later chapters ahead of time.","武器を置く：「ガーニー、フレメンについて知りたい」。彼は一瞬止まり、語り始める——彼らは砂漠の主、最も過酷な環境で生き抜き、サンドワームとさえ意思疎通できる。原作の後半で明かされる重要な情報を先に得た。"),fateDelta:10,moodDelta:10}
        ]},
        {type:"event",text:L(
            "飞船降落在阿拉吉斯的停机坪上。你走出舱门，迎面而来的是灼热的空气和无尽的黄沙。你知道这里即将成为你的战场，也是你的命运之地。",
            "The ship lands on the tarmac of Arrakis. You step through the hatch into the scorching air and endless yellow sand. You know this will become your battlefield — and the place of your destiny.",
            "宇宙船がアラキスの滑走路に着陸する。ハッチを抜けると、灼熱の空気と果てしない黄砂が迎える。ここが戦場となり、運命の地となることを知っている。"
        )},
        {type:"action",text:L(
            "你站在停机坪上，看着远处的城市。你知道原剧情中哈可宁人会在不久后发动袭击。问题是，你打算怎么利用这段时间？",
            "You stand on the tarmac, looking at the distant city. You know the Harkonnens will attack soon in the original story. The question is — how will you use this time?",
            "滑走路に立ち、遠くの街を見つめる。原作では間もなくハルコンネンが襲撃することを知っている。問題は——この時間をどう使うかだ。"
        ), choices:[
            {label:L("按原剧情，先适应环境","Follow the plot: adapt to the environment first","原作通り、まず環境に適応する"),original:true,result:L("你按照原剧情的走向，先适应阿拉吉斯的环境。你学习沙漠生存技巧，了解弗雷曼人的文化。你知道这些知识在未来的沙漠生活中至关重要。","You follow the original plot and adapt to Arrakis's environment first. You learn desert survival techniques and study Fremen culture. You know this knowledge will be crucial in the desert life ahead.","原作通りに、まずアラキスの環境に適応する。砂漠のサバイバル技術を学び、フレメンの文化を理解する。この知識が今後の砂漠生活で極めて重要になると分かっている。"),fateDelta:5,moodDelta:5},
            {label:L("立刻寻找弗雷曼人","Find the Fremen immediately","すぐにフレメンを探す"),original:false,result:L("你没有去适应环境，而是直接前往沙漠寻找弗雷曼人。你知道他们在沙漠深处有秘密基地。经过几天的寻找，你终于找到了他们。他们惊讶于你的勇气和知识。你提前建立了原剧情中后来才有的联盟。","You don't waste time adapting — you head straight into the desert to find the Fremen. You know they have hidden sietches deep in the sand. After days of searching, you finally find them. They are amazed by your courage and knowledge. You've forged an alliance that in the original story came much later.","適応に時間をかけず、直接砂漠へフレメンを探しに行く。彼らが砂漠の奥深くに秘密のシーチを持つことを知っている。数日間の探索の末、ついに彼らを見つける。彼らはあなたの勇気と知識に驚嘆する。原作ではずっと後に築かれる同盟を先に結んだ。"),fateDelta:20,moodDelta:10},
            {label:L("秘密建造防御工事","Secretly build fortifications","密かに防御施設を建設する"),original:false,result:L("你利用公爵的资源，秘密建造防御工事。你知道哈可宁人会袭击，所以你提前准备。你设计了一套针对哈可宁人战术的防御系统，这在原剧情中从未出现过。","Using the Duke's resources, you secretly construct fortifications. You know the Harkonnens will attack, so you prepare ahead of time. You design a defense system specifically tailored against Harkonnen tactics — something that never appeared in the original story.","公爵の資源を使って、密かに防御施設を建設する。ハルコンネンが襲撃することを知っているから、事前に準備する。ハルコンネンの戦術に特化した防御システムを設計する——原作には登場しなかったものだ。"),fateDelta:15,moodDelta:8},
            {label:L("开始秘密训练弗雷曼战士","Begin secretly training Fremen warriors","密かにフレメンの戦士を訓練する"),original:false,result:L("你找到一些愿意相信你的弗雷曼人，开始秘密训练他们。你教他们原剧情中保罗后来才教他们的战斗技巧。他们惊讶于你的知识和能力。你提前建立了一支精锐部队。","You find some Fremen willing to trust you and begin secretly training them. You teach them combat techniques that in the original story Paul only taught them much later. They marvel at your knowledge and ability. You've built an elite force ahead of time.","あなたを信じる用意のあるフレメンを見つけ、密かに訓練を始める。原作ではポールがずっと後になって教えた戦闘技術を彼らに教える。彼らはあなたの知識と能力に驚嘆する。精鋭部隊を先に作った。"),fateDelta:25,moodDelta:5}
        ]}
    ];

    registerBook('scifi.shaQiu', {
        intro: [
            {title:L("穿越沙丘","Dune: Transmigrated","デューン：転生"),
             html:L("你是一个现代青年，一觉醒来发现自己穿越到了《沙丘》的世界。你成了保罗·亚崔迪——公爵雷多·亚崔迪的独子，杰西卡女士的儿子。你知道原剧情的每一次选择，每一次转折。你打算怎么走这条路？","You are a modern youth who wakes up transmigrated into the world of Dune. You have become Paul Atreides — sole heir of Duke Leto Atreides, son of the Lady Jessica. You know every choice and every twist of the original story. How will you walk this path?","あなたは現代の青年。目覚めると『デューン』の世界に転生していた。あなたはポール・アトレイデスとなった——レト・アトレイデス公爵の一人息子、レディ・ジェシカの子だ。原作のあらゆる選択と展開を知っている。この道をどう進むのか？")},
            {title:L("混入主角","Merged with the Protagonist","主人公と融合"),
             html:L("你与这个世界原本的保罗融合了。你拥有他的记忆、他的身份、他的起点。但你也拥有超越这个世界的知识——你知道每一次选择的结果，知道每一个敌人的弱点，知道每一件宝物的下落。问题是，你会按原剧情走，还是改写命运？","You have merged with this world's original Paul. You possess his memories, his identity, his starting point. But you also possess knowledge beyond this world — you know the outcome of every choice, every enemy's weakness, every treasure's location. Will you follow the original plot, or rewrite destiny?","あなたはこの世界の本来のポールと融合した。彼の記憶、身分、出発点をすべて持っている。しかし、この世界を超えた知識も持っている——あらゆる選択の結果、あらゆる敵の弱点、あらゆる宝物の在処を知っている。原作通りに進むのか、運命を書き換えるのか？")},
            {title:L("命运的岔路口","Crossroads of Fate","運命の分岐点"),
             html:L("每一个选择点，你都会面临四条路：一条是原剧情的道路，三条是改写命运的岔路。选择原剧情，你将安全地走向已知的结局；选择改写，你将踏入未知的深渊。但记住——命运从来不是注定的。你的选择，将决定你是保罗，还是超越保罗的存在。","At every choice point, four paths await: one original, three divergent. Choose the original path and you'll safely reach a known ending; choose divergence and step into the unknown. But remember — fate was never predetermined. Your choices will determine whether you remain Paul, or become something beyond Paul.","あらゆる選択点で四つの道が待つ。一つは原作、三つは運命を書き換える分岐。原作を選べば既知の結末へ、分岐を選べば未知の深淵へ。しかし覚えておけ——運命は決して定められたものではない。あなたの選択が、ポールにとどめるか、ポールを超えた存在にするかを決める。")}
        ],
        segments: segments,
        glossary: L(
            {高姆佳巴:"比·吉斯特姐妹会的毒针",科维扎基·哈得那奇:"能同时存在于诸多时空的存在",比·吉斯特姐妹会:"女性修炼组织",屏蔽场:"能抵挡高速武器的防御力场",弗雷曼人:"沙漠原住民",香料:"珍贵资源，能延长寿命并预知未来",沙虫:"巨型沙漠生物",哈可宁人:"残暴的前任统治者"},
            {高姆佳巴:"Gom Jabbar - Bene Gesserit poison needle",科维扎基·哈得那奇:"Kwisatz Haderach - one who can be in many places at once",比·吉斯特姐妹会:"Bene Gesserit - sisterhood of mental training",屏蔽场:"Shield - defensive field against fast weapons",弗雷曼人:"Fremen - native desert dwellers",香料:"Spice - precious substance extending life and granting prescience",沙虫:"Sandworm - giant desert creature",哈可宁人:"Harkonnens - brutal former rulers"},
            {高姆佳巴:"ゴム・ジャバー - ベネ・ゲセリットの毒針",科维扎基·哈得那奇:"クウィサッツ・ハデラック - 多くの時空に同時に存在できる者",比·吉斯特姐妹会:"ベネ・ゲセリット - 精神修練の教団",屏蔽场:"シールド - 高速武器を防ぐ防御力場",弗雷曼人:"フレメン - 砂漠の原住民",香料:"スパイス - 寿命を延ばし予知をもたらす貴重な資源",沙虫:"サンドワーム - 巨大な砂漠の生物",哈可宁人:"ハルコンネン家 - 残忍な前統治者"}
        ),
        nameGlossary: L(
            {保罗·亚崔迪:"《沙丘》主角，穿越后的你",杰西卡女士:"保罗的母亲",雷多公爵:"保罗的父亲",哥尼·哈莱克:"公爵麾下最好的战士",圣母凯斯·海伦·莫希阿姆:"比·吉斯特姐妹会的真相师"},
            {保罗·亚崔迪:"Paul Atreides - protagonist, you after transmigration",杰西卡女士:"Lady Jessica - Paul's mother",雷多公爵:"Duke Leto - Paul's father",哥尼·哈莱克:"Gurney Halleck - finest warrior under the Duke",圣母凯斯·海伦·莫希阿姆:"Reverend Mother Gaius Helen Mohiam - Bene Gesserit Truthsayer"},
            {ポール・アトレイデス:"『デューン』の主人公、転生後のあなた",ジェシカ様:"レディ・ジェシカ - ポールの母",レト公爵:"レト公爵 - ポールの父",ガーニー・ハレック:"ガーニー・ハレック - 公爵麾下の最良の戦士",尊母ガイウス・ヘレン・モヒアム:"尊母 - ベネ・ゲセリットの真実告解者"}
        )
    });
})();
