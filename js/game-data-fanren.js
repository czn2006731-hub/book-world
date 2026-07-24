(function() {
    function L(zh,en,ja){return {zh:zh,en:en||zh,ja:ja||zh};}

    // ══════════════════════════════════════════════
    //  弧 (Arc) 数据结构
    //  人界篇分卷弧
    // ══════════════════════════════════════════════
    var arcs = [
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //  弧 1：七玄门篇
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            arcId: 'qixuanmen',
            title: '第一卷 · 七玄门',
            background: '韩立本是镜州青牛镇一个普通山村的少年，因家中兄弟姐妹众多被送往七玄门。七玄门是镜州小有名气的修仙门派，但真正的修仙之路从不平坦。作为一个资质平庸的外门弟子，韩立的一切才刚刚开始。',
            startDpId: 'qm_1',
            keyItems: [
                {
                    name:'神秘小瓶',
                    from:'药园杂物房角落',
                    effect:'拇指大小的青色玉瓶，瓶身刻着奇异纹路，每晚在月光下凝聚一滴翠绿灵液。注意：灵液只对植物灵药有催化神效，人体或活物不可直接服用！',
                    type:'weapon',
                    icon:'small-green-bottle',
                    origin:'韩立在七玄门神手谷药园杂物房清理时，于角落泥土深处无意间发现。此瓶为掌天瓶残件，吸收日月精华凝聚绿液。',
                    specificEffect:'【催化灵药】每晚月光下凝聚一滴翠绿灵液，可使普通药材在数呼吸内化为百年甚至千年珍稀灵药。严禁直接口服！活物吸收灵液会导致气血倒流、经脉寸断甚至爆体而亡。'
                },
                {
                    name:'升仙令',
                    from:'墨大夫遗物',
                    effect:'黄枫谷升仙大会的入场凭证，持有者可直接参加选拔，无需通过层层筛选',
                    type:'scroll',
                    origin:'黄枫谷发放的信物，凭此令牌可参加升仙大会。墨大夫临终前遗落，韩立拾得。',
                    specificEffect:'持有此令可直接参加黄枫谷升仙大会，有机会拜入黄枫谷成为外门弟子，踏上真正的修仙之路。无需通过普通筛选流程。'
                },
                {
                    name:'墨大夫手札',
                    from:'墨大夫遗物',
                    effect:'记载了墨大夫毕生医术和修炼心得的竹简手札',
                    type:'scroll',
                    origin:'墨大夫生前亲笔所著，记载其行医数十载的经验与炼气期修炼心得。墨大夫死后遗留在洞府中。',
                    specificEffect:'记载数百种草药的药性与配伍禁忌，以及墨大夫独创的几味丹方。对炼气期修士的修炼有参考价值。'
                },
                {
                    name:'长春功残卷',
                    from:'墨大夫亲传',
                    effect:'墨大夫修炼长春功的心得残卷，记载基础呼吸吐纳法门，修炼后可感知灵力流动',
                    type:'scroll',
                    icon:'scroll-changchun',
                    origin:'墨大夫所修长春功的残篇，原为完整功法，后因故残缺。墨大夫传于韩立作为入门修炼之用。',
                    specificEffect:'记载长春功前三层的修炼法门，可打通十二正经，感知天地灵气。为韩立修仙之基。修炼后可引气入体，缓慢提升修为。'
                }
            ],
            decisionPoints: [
                {
                    id:'qm_1', combatRelated:false, showResult:false,
                    context:L(
                        '镜州彩霞山，七玄门考核场上。上百名同来的山村少年正在苦苦支撑，你体能单薄，终究没有在规定时间内爬上峭壁，考核落榜。和你一同落榜的还有个皮肤黑粗、性格憨厚的少年，名叫张铁。两人正沮丧际，一位面容枯槁、咳嗽不止的黑衫老者（墨居仁大夫）缓缓走来，打量了你们二人许久。',
                        'On the Seven Mysteries Sect entrance exam ground at Caixia Mountain, over a hundred boys strain themselves. Weak by nature, you fail to climb the cliff in time and fail the exam. Failing alongside you is a dark-skinned, honest boy named Zhang Tie. As you both despair, a gaunt, coughing old man in black robes (Doctor Mo Juren) walks up and studies you both.',
                        '鏡州彩霞山、七玄門の入試場。百人以上の少年が苦闘する中、体力のないあなたは制限時間内に崖を登れず落第する。一緒に落第したのは色の黒い素朴な少年、張鉄。落胆する二人の前に、病弱そうな黒衣の老人（墨居仁大夫）が歩み寄り、二人をじっと見つめる。'
                    ),
                    originalChoice:L('向墨大夫恭敬行礼','Bow respectfully to Doctor Mo','墨大夫に恭しく礼をする'),
                    originalResult:L('墨大夫见你二人眼神清澈纯朴，且身体特征符合某种特殊要求，便收你二人为采药童子，带回神手谷。', 'Doctor Mo, seeing your pure eyes, takes you both as herb-gathering disciples to God Hand Valley.', '墨大夫は二人の純粋な目を見て、薬採り弟子として神手谷へ連れて行く。')
                },
                {
                    id:'qm_1a', combatRelated:false, showResult:false,
                    context:L(
                        '来到神手谷后，墨居仁给你们安排了住处，并安排张铁练习《象甲功》，而把你单独叫到内室。他考较了你几句药理知识后，从怀中取出一卷泛黄的竹简——《长春功残卷》。墨居仁语气低沉：从今天起，你跟着我辨识草药、打理药园。这卷功法你拿去修炼，半年内若能练出灵气，便收你为正式弟子。',
                        'Arriving at God Hand Valley, Doctor Mo assigns housing. He has Zhang Tie practice Elephant Armor Skill and calls you into the inner room alone. After testing your herb knowledge, he hands you a yellowed bamboo scroll — Changchun Gong. He says: Learn herbs and tend the garden with me. Practice this technique; if you sense qi within half a year, I will make you a formal disciple.',
                        '神手谷に到着後、墨居仁は住居を割り当てる。張鉄には『象甲功』を練習させ、あなたを内室に呼び出す。薬理知識を試した後、黄ばんだ竹簡——『長春功残巻』を渡す：明日から草薬の識別と薬園の管理をせよ。これを修行し、半年以内に霊気を感じられたら正式な弟子とする。'
                    ),
                    grantItem: '长春功残卷',
                    choices:[
                        {label:L('恭敬接过长春功残卷，承诺苦修','Humbly accept Changchun Gong and promise to practice','長春功を受け取り、修行を誓う'), next:'qm_3'},
                        {label:L('询问张铁为何修炼不同的功法','Ask why Zhang Tie practices a different skill','なぜ張鉄と違う功法なのか尋ねる'), next:'qm_1b'},
                        {label:L('私下与张铁交流，相互照应','Talk with Zhang Tie in private to look out for each other','私下に張鉄と交流し、助け合う'), next:'qm_1c'}
                    ]
                },
                {
                    id:'qm_1b', combatRelated:false, showResult:true,
                    context:L(
                        '墨居仁冷哼一声：各人有各人的造化，莫要多问！好生打理药园便是。说完拂袖而去。张铁走过来拍拍你的肩膀：韩立，墨大夫脾气古怪，咱们听话便是。',
                        'Doctor Mo snorts: Everyone has their own fate! Do not ask so much, just tend the garden! He leaves in annoyance. Zhang Tie pats your shoulder: Han Li, Doctor Mo is eccentric, let\'s just obey him.',
                        '墨居仁是冷笑：各自に宿命がある、余計なことを聞くな！薬園を管理せよ。言い捨てて去る。張鉄が肩を叩く：韓立、墨大夫は気難しい、言われた通りにしよう。'
                    ),
                    choices:[
                        {label:L('回房研读长春功','Return to room to study Changchun Gong','部屋に戻り長春功を勉強する'), next:'qm_3'},
                        {label:L('与张铁一道前往药园打理','Go tend the herb garden with Zhang Tie','張鉄と共に薬園の管理に向かう'), next:'qm_3'}
                    ]
                },
                {
                    id:'qm_1c', combatRelated:false, showResult:true,
                    context:L(
                        '晚上，你和张铁在竹房中谈心。张铁憨厚一笑：韩立，我笨，墨大夫教我的象甲功练起来全身剧痛，但为了家里能吃饱饭，我得坚持。你脑子聪明，肯定能练成仙法！两人结为至交好友。',
                        'At night, you and Zhang Tie chat in the bamboo hut. Zhang Tie smiles honestly: Han Li, I\'m clumsy. The Elephant Armor Skill causes intense pain, but for my family I must endure. You\'re smart, you\'ll surely master immortal arts! You become close friends.',
                        '夜、竹の小屋で張鉄と打ち解ける。張鉄は笑う：韓立、俺は不器用だ。象甲功は激痛が走るが、家族のために耐える。お前は頭が良いから必ず仙法を修得できる！二人は親友となる。'
                    ),
                    choices:[
                        {label:L('鼓励张铁，随后开始修炼长春功','Encourage Zhang Tie, then begin practicing','張鉄を励まし、長春功の修行を始める'), next:'qm_3'}
                    ]
                },
                {
                    id:'qm_3', combatRelated:false, showResult:true,
                    context:L(
                        '你和其它伪灵根弟子被安排到外门药园做事。药园的管事是墨大夫，一个沉默寡言的老人。一天傍晚，墨大夫叫住你，从药架上取下两株看起来一模一样的灵草，问道：这两株哪一株已经成熟？',
                        'You and other false root disciples are assigned to the herb garden. The overseer is Doctor Mo, a quiet old man. One evening he calls you over, holds up two seemingly identical spirit herbs, and asks: which one is mature?',
                        '他の偽霊根弟子たちと薬園に配属される。管理人墨大夫は寡黙な老人。ある夕方、彼はあなたを呼び止め、見た目が全く同じ二株の霊草を見せて尋ねる：どちらが成熟しているか？'
                    ),
                    choices:[
                        {label:L('仔细观察叶片纹路，指出成熟的那株','Observe leaf veins carefully, identify the mature one','葉脈を注意深く観察し、成熟した方を指摘する'), next:'qm_3b'},
                        {label:L('凭记忆中的药理知识判断','Use pharmacological knowledge from memory','記憶の中の薬理知識で判断する'), next:'qm_3b'},
                        {label:L('诚实说不知道，请求指点','Honestly say you don\'t know, ask for guidance','正直に分からず、指導を請う'), next:'qm_3b'},
                        {label:L('两株都拿走研究','Take both to study','両方持って研究する'), next:'qm_3a'}
                    ]
                },
                {
                    id:'qm_3a', combatRelated:false, showResult:true,
                    context:L(
                        '墨大夫眉毛一挑：倒是个贪心的。不过你两株都分不清，拿走有什么用？他随手从架子上取下一本书扔给你：先把这本《灵药图鉴》看完再说。你翻开书，发现里面记载了数百种灵药的特性——这正是你需要的知识。',
                        'Doctor Mo raises an eyebrow: Greedy, are you? But you can\'t even tell them apart, what use are they? He tosses you a book: Read this \'Illustrated Guide to Spirit Herbs\' first. Inside: hundreds of spirit herbs\' properties — exactly the knowledge you need.',
                        '墨大夫が眉を上げる：欲深いな。しかし区別もできないのに何の役に立つ？本を投げつける：まず『霊薬図鑑』を読め。中には数百種の霊薬の特性が記されており——まさに必要としていた知識だ。'
                    ),
                    choices:[
                        {label:L('认真研读，向墨大夫请教','Study carefully, ask Doctor Mo questions','注意深く読み、墨大夫に请教する'), next:'qm_3b'},
                        {label:L('自己偷偷研究，不让墨大夫知道进度','Study secretly, hide progress from Doctor Mo','こっそり一人で研究し、墨大夫に進捗を見せない'), next:'qm_3b'}
                    ]
                },
                {
                    id:'qm_3b', combatRelated:false, showResult:true,
                    context:L(
                        '你花了半个月研读《灵药图鉴》，对灵药的辨识已经有了很大进步。墨大夫考了你几次，眼中渐渐露出满意之色。一天，他把你叫到内室，从怀中取出一卷泛黄的竹简：你这孩子倒是有几分灵性。这是我修炼长春功的心得残卷，你拿去参悟。若能入门，便算我的记名弟子。',
                        'You spend half a month studying the herb guide and make great progress. Doctor Mo tests you several times, gradually showing satisfaction. One day he calls you to his inner room and produces a yellowed bamboo scroll: You have some aptitude. This is my remnant scroll of the Changchun Gong. Study it. If you can master the basics, you\'ll be my nominal disciple.',
                        '半月かけて『灵药图鉴』を読み、灵药の识别力が大きく向上する。墨大夫が何度も試験し、次第に満足げに。ある日、内室に呼び出され、竹简を取り出す：霊性がある。这是我修炼长春功的心得残卷，你拿去参悟。若能入门，便算我的记名弟子。'
                    ),
                    grantItem: '长春功残卷',
                    choices:[
                        {label:L('恭敬接过，承诺用心修炼','Humbly accept and promise to cultivate diligently','丁寧に受け取り、修行を誓う'), next:'qm_3c'},
                        {label:L('追问长春功的来历','Ask about the origins of Changchun Gong','長春功の由来を追究する'), next:'qm_3c'}
                    ]
                },
                {
                    id:'qm_3c', combatRelated:false, showResult:false,
                    context:L(
                        '这天傍晚你照料完药园，散步至杂物房附近，忽然看到远处的泥土里有一道微弱的绿光闪烁，在落叶和泥土堆里若隐若现。你心中好奇，走上前用脚踢开泥土，发现是一个被泥土包裹得结结实实的物件。你将其捡起，用衣角擦拭干净，发现竟是一个拇指大小的青色玉瓶。瓶身刻着奇异的纹路，在夜色中散发着淡淡的灵光。',
                        'This evening, after tending the herb garden, you stroll near the storage room. Suddenly, you spot a faint green light glowing in the dirt in the distance, flickering beneath fallen leaves. Curious, you walk over and kick the dirt aside to find a mud-covered object. Picking it up and wiping it with your sleeve, you reveal a thumb-sized cyan jade vial carved with strange glowing patterns.',
                        'この日の夕方、薬院の世話を終えて物置の近くを散歩していると、ふと遠くの泥の中にかすかな緑の光が点滅し、落ち葉や泥の山の下で見え隠れしているのに気づく。好奇心から近づいて足で泥を蹴り飛ばすと、泥に包まれた物が見つかった。それを拾い上げ、服の角で拭いてきれいにすると、親指大の青い玉瓶であることがわかった。'
                    ),
                    grantItem: '神秘小瓶',
                    choices:[
                        {label:L('觉得有些神异，仔细收好带回房间研究','Sense its uniqueness, hide it carefully and study it in your room','何か神秘的なものを感じ、慎重に隠して部屋に持ち帰って研究する'), next:'qm_4b'},
                        {label:L('觉得只是个普通凡物，随手扔在一旁','Think it is just a common object, discard it side','普通の物だと思い、そのまま脇に投げ捨てる'), next:'qm_3d'},
                        {label:L('立刻拿给墨大夫看，请教来历','Show it to Doctor Mo immediately to ask about its origin','すぐに墨大夫に見せて、来歴を尋ねる'), next:'qm_4a'}
                    ]
                },
                {
                    id:'qm_3d', combatRelated:false, showResult:true,
                    context:L(
                        '你随手将它扔在了泥土里。可到了夜深人静之时，你翻来覆去无法入眠，脑海中不断浮现出那抹绿光。那种奇异的吸引力让你百爪挠心。最终你还是披上衣服，偷偷溜回原处，在月光下重新将那玉瓶寻回。月光洒在瓶身上，上面的奇异纹路仿佛活了过来。',
                        'You toss it back into the dirt. But in the dead of night, you toss and turn, unable to sleep as the green light haunts your mind. That strange pull is irresistible. Finally, you throw on your clothes, slip back to the spot, and retrieve the vial under the moonlight. The strange patterns seem to come alive.',
                        'あなたはそれを泥の中に投げ捨てた。しかし、夜深まり静まり返った頃、寝返りを打っても眠れず、頭の中にあの緑の光が浮かび続ける。その奇妙な引き付け力に居ても立ってもいられなくなった。結局、服を羽織って元の場所にこっそり戻り、月光の下でその玉瓶を再び探し出した。月光が瓶に注ぐと、その奇妙了紋様が生きているかのように見えた。'
                    ),
                    choices:[
                        {label:L('偷偷收好，不让任何人发现','Secretly hide it, tell no one','こっそり隠し、誰にも見せない'), next:'qm_5'},
                        {label:L('研究瓶身纹路的秘密','Study the patterns on the vial','瓶の紋様の秘密を研究する'), next:'qm_4b'}
                    ]
                },
                {
                    id:'qm_4', combatRelated:false, showResult:true,
                    context:L(
                        '这便是那神秘小瓶。月光透过窗棂洒在瓶身上，那些纹路仿佛活了过来。你知道这是韩立崛起的关键。',
                        'This is the mysterious vial. Moonlight spills onto it and the patterns seem to come alive. You know this is the key to Han Li\'s rise.',
                        'これが神秘の小瓶だ。月光が注ぐと紋様が生きているかのように見える。これが韓立の台頭の鍵だ。'
                    ),
                    choices:[
                        {label:L('偷偷收好，不让任何人发现','Secretly hide it, tell no one','こっそり隠し、誰にも見せない'), next:'qm_5'},
                        {label:L('立刻拿给墨大夫看','Show it to Doctor Mo immediately','すぐに墨大夫に見せる'), next:'qm_4a'},
                        {label:L('研究瓶身纹路的秘密','Study the patterns on the vial','瓶の紋様の秘密を研究する'), next:'qm_4b'},
                        {label:L('假装没看到，以后再来取','Pretend not to see, come back later','気づかないふりをして後で取りに行く'), next:'qm_5'}
                    ]
                },
                {
                    id:'qm_4a', combatRelated:false, showResult:true,
                    context:L(
                        '你把玉瓶拿给墨大夫。他接过去端详了许久，眼中闪过一丝贪婪：这东西……你在哪里找到的？你如实说了位置。墨大夫沉默片刻：这个先放在我这里，我会研究一下。你心中一沉——你知道这瓶子的价值，但墨大夫不是你能得罪的人。他随手给了你几枚灵石作为补偿。',
                        'You show the vial to Doctor Mo. He examines it for a long time, greed flickering in his eyes: Where did you find this? You tell him. He pauses: I\'ll keep this for now. Your heart sinks — you know the vial\'s value, but you can\'t afford to offend him. He gives you a few spirit stones as compensation.',
                        '玉瓶を墨大夫に見せる。彼は長く観察し、目には欲が走る：これは……どこで見つけた？正直に答える。墨大夫はしばらく黙る：これはまず私が預かる。心中がっかり——瓶の価値を知っているが、墨大夫に逆らえない。霊石をいくつか渡される。'
                    ),
                    choices:[
                        {label:L('接受灵石，暗中计划夺回','Accept the stones, plan to reclaim it later','霊石を受け取り、後で取り戻す計画を立てる'), next:'qm_5'},
                        {label:L('假装服从，寻找机会偷回来','Pretend to comply, look for a chance to steal it back','従うふりをして、盗み返す機会を探す'), next:'qm_5'}
                    ]
                },
                {
                    id:'qm_4b', combatRelated:false, showResult:true,
                    context:L(
                        '你仔细研究瓶身纹路。在月光下，那些纹路缓缓流动，瓶口溢出一滴翠绿色的液体。你闻到一股奇香，但想起在医书上看到的药理知识，决定谨慎行事。你试着将这一滴绿液喂给药园里的一只野兔，野兔刚舔食片刻，突然全身抽搐、气血倒流，不多时便凄惨暴毙！你心中一惊——原来这灵液毒性极其猛烈，人体或活物绝对不可直接服用。',
                        'You study the vial. Under moonlight, a drop of emerald liquid seeps out. You smell a strange fragrance but decide to be cautious. You feed it to a wild rabbit in the garden. The rabbit immediately convulses and dies miserably! You realize the liquid is highly toxic to living creatures and must never be consumed directly.',
                        '紋様を観察する。月光の下、翡翠色の液体が一滴滲み出る。奇妙な香りがするが、慎重を期す。一滴を野ウサギに与えると、ウサギはたちまち痙攣して死亡！生き物が直接飲むと猛毒で暴死することを知る。絶対に直接服用してはならない。'
                    ),
                    choices:[
                        {label:L('收好小瓶，继续在药园做事','Hide the vial, continue working in the garden','小瓶を隠し、薬園の仕事を続ける'), next:'qm_5'},
                        {label:L('用灵液催化更多灵药','Use the spirit liquid to grow more herbs','霊液でもっと霊药を栽培する'), next:'qm_4c'}
                    ]
                },
                {
                    id:'qm_4c', combatRelated:false, showResult:true,
                    context:L(
                        '你深夜取出玉瓶，将灵液滴在几株快要枯萎的灵药上。灵药竟然在几个呼吸间恢复了生机，甚至比原来更加茂盛！你心中狂喜——这意味着你以后可以炼制更高品级的丹药。但你也注意到，灵液的产量有限，每晚只能凝聚一滴。',
                        'You take out the vial at night and drip spirit liquid on withered herbs. They revive within moments, even more vibrant than before! You\'re ecstatic — this means you can refine higher-grade pills. But the liquid is limited to one drop per night.',
                        '夜に瓶を取り出し、枯れかけた霊薬に霊液を一滴垂らす。数呼吸で回復し、以前よりさらに繁盛！狂喜——より高級な丹薬が調合できる。しかし霊液の産出は限られ、一晩に一滴だけだ。'
                    ),
                    choices:[
                        {label:L('继续秘密培育灵药','Continue secretly cultivating herbs','密かに霊薬の栽培を続ける'), next:'qm_5'},
                        {label:L('尝试用灵液修炼','Try using spirit liquid for cultivation','霊液で修行を試みる'), next:'qm_5'}
                    ]
                },
                {
                    id:'qm_5', combatRelated:true, showResult:true,
                    context:L(
                        '你在神手谷药园待了两年，借助催化出的珍稀灵药炼制丹药，修为悄然提升到炼气期三层。但你注意到墨大夫最近面色越发阴鸷苍白，眼神中经常闪过诡异的光芒。这天深夜，你被药园木屋内的微弱异响惊醒。你悄悄顺着缝隙往墨大夫的内室看去——只见屋中烛光摇曳，墨大夫正在翻阅一本黑色皮质恶魔般的诡异邪书，口中喃喃念叨着“夺舍”、“灵根”与你的名字！他的桌上还摆放着为你和张铁调配的怪异汤药。你心中大惊，终于确信墨大夫从一开始就没有安好心！',
                        'You spend two years at the herb garden, quietly reaching the 3rd layer of Qi Refining by refining pills from accelerated herbs. But Doctor Mo grows pale and sinister. One midnight, you wake to faint noises from his room. Peering through a crack, you see him reading a sinister black book under candlelight, muttering \'Soul Possession\', \'Spirit Root\', and your name! On his table are strange decoctions prepared for you and Zhang Tie. You realize in horror that he meant you harm all along!',
                        '神手谷の薬園で二年を過ごし、密かに練気期三層に達する。しかし墨大夫の顔色がますます陰険になる。ある深夜、木小屋の異音で目覚める。隙間から部屋を覗くと、墨大夫が黒い邪書を読みながら「奪舎」「霊根」とあなたの名前を呟いている！テーブルには怪しい薬湯。彼が最初から悪意を抱いていたことを確信する！'
                    ),
                    choices:[
                        {label:L('不动声色溜回房间，暗中准备对抗','Slip back softly, prepare secretly for confrontation','静かに部屋に戻り、対決の準備を進める'), next:'qm_5a'},
                        {label:L('趁他全神贯注看邪书，撞开木门直接偷袭！','Ambush him inside the room immediately while he\'s distracted!','彼が邪書に集中している隙にドアを破って突击！'), next:'qm_5a'},
                        {label:L('悄悄向张铁告密，二人合力应对','Secretly warn Zhang Tie, join forces against Doctor Mo','張鉄に密告し、二人で協力して立ち向かう'), next:'qm_5c'}
                    ]
                },
                {
                    id:'qm_5a', combatRelated:true, showResult:true,
                    lootOnKill:{
                        prompt:'墨大夫重伤倒在木屋地砖上，气绝身亡。你在其内室搜寻，找到了他的毕生积累。',
                        items:['升仙令','墨大夫手札','灵石×10','传音简(墨居仁遗书)']
                    },
                    context:L(
                        '木屋内烛火摇晃，你雷霆偷袭直接撞开木门突击！墨大夫惊怒交加，虽然他浸淫武学与邪术多年，但在你的决绝攻击下重伤绝命！',
                        'Inside the candlelit room, Doctor Mo falls under your surprise assault! Surrounded by books and poisons, he succumbs to his wounds.',
                        '狭い木小屋の中で、墨大夫は驚き倒れる！不意打ちにより彼は重伤を负い倒れた。'
                    ),
                    choices:[
                        {label:L('趁势搜刮屋内遗产，随后离开神手谷','Loot the room and leave God Hand Valley','部屋の遺品を回収し、神手谷を去る'), next:'qm_6'},
                        {label:L('打扫战场，处理尸体', 'Clean up the scene and dispose of the body', '現場を片付け、死体を処理する'), next:'qm_6'}
                    ]
                },
                {
                    id:'qm_5b', combatRelated:false, showResult:true,
                    context:L(
                        '你取出珍藏的灵液，悄悄洒向洞中的黑色雾气。灵液接触到邪气后发出嗤嗤声，黑雾竟然被净化了一部分！墨大夫的邪功被打断，他猛地回头——看到了你。他的眼中闪过杀意：你……都看到了？',
                        'You pour spirit liquid toward the black mist. It sizzles and partially purifies the evil qi! Doctor Mo\'s technique is interrupted. He turns and sees you. Killing intent fills his eyes: You... saw everything?',
                        '霊液を取り出し、黒い霧にそっとかける。シーッという音と共に、邪気の一部が浄化される！墨大夫の邪功が中断され、振り返る——あなたを見つける。殺意が目を満たす：あなた……全部見たのか？'
                    ),
                    choices:[
                        {label:L('转身就跑','Turn and flee','踵を返して逃げる'), next:'qm_5d'},
                        {label:L('镇定应对，假装什么都没看到','Stay calm, pretend you saw nothing','落ち着いて、何も見なかったふりをする'), next:'qm_5e'},
                        {label:L('威胁墨大夫，要求他交出秘密','Threaten Doctor Mo, demand his secrets','墨大夫を脅し、秘密を要求する'), next:'qm_5f'}
                    ]
                },
                {
                    id:'qm_5c', combatRelated:false, showResult:true,
                    context:L(
                        '你悄悄记下墨大夫的修炼时间和洞穴位置。接下来几天，你暗中收集他外出的证据——沾血的衣物、神秘的玉简碎片、以及他与一个黑衣人接头的场景。你将这些证据藏在一个只有你知道的地方。总有一天，这些会派上用场。',
                        'You secretly note Doctor Mo\'s schedule and cave location. Over the next days, you collect evidence — blood-stained clothes, mysterious jade slip fragments, and a meeting with a cloaked figure. You hide the evidence. Someday, it will be useful.',
                        '墨大夫のスケジュールと洞窟の場所を暗記する。次の数日間、証拠を集める——血に染まった衣装、謎の玉簡の破片、覆面人物との密会。証拠を隠す。いつか役に立つ。'
                    ),
                    choices:[
                        {label:L('继续暗中监视','Continue secret surveillance','密かに監視を続ける'), next:'qm_6'},
                        {label:L('带着证据去找门派长老','Take the evidence to the sect elders','証拠を持って門派の長老に報告する'), next:'qm_5g'}
                    ]
                },
                {
                    id:'qm_5d', combatRelated:true, showResult:true,
                    lootOnKill:{
                        prompt:'墨大夫重伤倒在木屋地砖上，气绝身亡。你在其内室搜寻，找到了他的毕生积累。',
                        items:['升仙令','墨大夫手札','灵石×10','传音简(墨居仁遗书)']
                    },
                    context:L(
                        '墨大夫怒吼一声亲自追了上来！你利用药园熟络的地形与迷药成功反制，将其重创倒地！',
                        'Doctor Mo roars and chases you! Using familiar terrain and poison powders, you manage to defeat him.',
                        '墨大夫が怒鳴って追ってくる！地形と毒粉を利用して彼を重傷させた。'
                    ),
                    choices:[
                        {label:L('逃向弟子密集区','Flee toward the crowded disciple area','弟子の密集区域へ逃げる'), next:'qm_6'},
                        {label:L('躲进药园仓库','Hide in the herb garden warehouse','薬園の倉庫に隠れる'), next:'qm_6'}
                    ]
                },
                {
                    id:'qm_5e', combatRelated:false, showResult:true,
                    context:L(
                        '你镇定地说：墨大夫，我只是路过，什么都没看到。墨大夫盯着你看了很久，眼中的杀意慢慢消退：最好是这样。你回去吧，今晚的事不要对任何人提起。你转身离开，手心全是冷汗。你知道墨大夫暂时不会动你，但你必须尽快想办法。',
                        'You say calmly: Doctor Mo, I was just passing by. He stares at you for a long time, the killing intent fading: It better be that way. Go, tell no one. You leave with cold sweat on your palms. He won\'t touch you for now, but you must act quickly.',
                        '落ち着いて言う：墨大夫、通りかかっただけです。彼は長く見つめ、殺意が引く：そうである最好い。帰れ、誰にも言うな。冷や汗を握りながら去る。今は動かないが、早く動かねば。'
                    ),
                    choices:[
                        {label:L('回去后立刻做准备','Prepare immediately after returning','戻ってすぐ準備を始める'), next:'qm_6'},
                        {label:L('假装无事发生，继续在药园工作','Act normal, continue working in the garden','何事もなかったように薬園の仕事を続ける'), next:'qm_6'}
                    ]
                },
                {
                    id:'qm_5f', combatRelated:true, showResult:true,
                    lootOnKill:{
                        prompt:'墨大夫重伤倒在木屋地砖上，气绝身亡。你在其内室搜寻，找到了他的毕生积累。',
                        items:['升仙令','墨大夫手札','灵石×10','传音简(墨居仁遗书)']
                    },
                    context:L(
                        '你冷笑道：墨大夫，你修炼邪功的事我都看到了。墨大夫脸色剧变出手，你早有准备，果断反制将其击败！',
                        'You sneer at Doctor Mo. He attacks, but you were ready and defeat him!',
                        '冷たく笑う。墨大夫が突击するが、覚悟を決めたあなたは彼を倒した！'
                    ),
                    choices:[
                        {label:L('拼死一搏','Fight to the death','命がけで戦う'), next:'qm_6'},
                        {label:L('使出最后手段','Use your last resort','最後の手段を使う'), next:'qm_6'}
                    ]
                },
                {
                    id:'qm_5g', combatRelated:false, showResult:true,
                    context:L(
                        '你带着证据找到门派长老。长老看完证据后脸色大变：墨大夫竟然……你做得很好，这件事交给我们处理。接下来几天，门派暗中调查墨大夫。最终在一个月黑风高的夜晚，几个长老联手将墨大夫制服。你从墨大夫的遗物中获得了升仙令和手札。',
                        'You bring the evidence to the elders. They\'re shocked: Doctor Mo actually... Well done, leave this to us. Over the next days, the sect investigates. One dark night, several elders subdue Doctor Mo together. From his belongings, you obtain the ascension order and journal.',
                        '証拠を持って長老に報告。長老たちは驚く：墨大夫が実は……よくやった、任せてくれ。次の数日間、門派が密かに調査。ある暗い夜、数人の長老が協力して墨大夫を制圧する。遺品から昇仙令と手札を手に入れる。'
                    ),
                    choices:[
                        {label:L('接受升仙令，准备离开','Accept the ascension order, prepare to leave','昇仙令を受け取り、出発を準備する'), next:'qm_6'},
                        {label:L('追问墨大夫的同伙是谁','Ask about Doctor Mo\'s accomplices','墨大夫の仲間は誰か追问する'), next:'qm_6'}
                    ]
                },
                {
                    id:'qm_6', combatRelated:false, showResult:false,
                    grantItem: '传音简(墨居仁遗书)',
                    context:L(
                        '墨大夫事件的余波终于过去。你站在七玄门神手谷的山门前，回望这个生活了两年多的地方。你已经不是当初那个落榜的小山村少年——炼气期三层的修为、神秘小瓶、以及从墨大夫遗物中获得的升仙令与手札。你知道继续留在七玄门只会限制你的发展。',
                        'The aftermath of the Doctor Mo incident has settled. You stand at the God Hand Valley gate, looking back. You\'re no longer the clueless village boy — third layer of Qi Refining, the mysterious vial, and the ascension order and journal from Doctor Mo. Staying here will only limit your growth.',
                        '墨大夫事件の余波もようやく収まった。神手谷の山門に立ち、振り返る。もう落第した山村の少年ではない——練気期三層の修為、神秘の小瓶、墨大夫の遺品から得た昇仙令と手札。ここに留まっては成長が限られる。'
                    ),
                    choices:[
                        {label:L('使用升仙令前往黄枫谷','Use the ascension order to go to Yellow Maple Valley','昇仙令を使って黄楓谷へ向かう'), next:'END'},
                        {label:L('先在七玄门继续修炼，等实力更强再走','Continue cultivating at Seven Mysteries Sect first','七玄門でまず修練を続け、実力がついてから出発する'), next:'END'},
                        {label:L('独自闯荡天南大陆','Venture out into the Tiannan Continent alone','一人で天南大陸を放浪する'), next:'END'},
                        {label:L('寻找其他穿越者的线索','Search for clues about other transmigrators','他の転生者の手がかりを探す'), next:'END'}
                    ]
                }
            ],
            arcConclusion: {
                originalPath:L(
                    '韩立在七玄门从一个外门弟子做起，历经灵根测试、药园修行、墨大夫事件，最终获得了神秘小瓶和升仙令。他决定离开七玄门，前往越国更大的舞台——黄枫谷。',
                    'Han Li started as a mere outer disciple at the Seven Mysteries Sect, went through the spirit root test, herb garden training, and the Doctor Mo incident, ultimately obtaining the mysterious vial and the ascension order. He decided to leave for a bigger stage — Yellow Maple Valley.',
                    '韓立は七玄門で外門弟子から始まり、霊根検査、薬園修行、墨大夫事件を経て、神秘の小瓶と昇仙令を手に入れた。彼は七玄門を去り、より大きな舞台——黄楓谷へ向かうことを決意した。'
                ),
                keyOutcomes:L(
                    ['获得神秘小瓶','获得升仙令','修为达到炼气期三层'],
                    ['Obtained Mysterious Vial','Obtained Ascension Order','Reached Qi Refining Layer 3'],
                    ['神秘の小瓶を入手','昇仙令を入手','練気期三層に到達']
                )
            },
            nextArc: {
                title:L('黄枫谷入门篇','Yellow Maple Valley Arc','黄楓谷入門篇'),
                bgHint:L(
                    '黄枫谷是越国三大修仙门派之一，每三年举办一次升仙大会选拔有潜质的弟子。参加升仙大会需要升仙令作为凭证。',
                    'Yellow Maple Valley is one of the three major cultivation sects of the Yue Kingdom. Every three years they hold an Ascension Assembly to select promising disciples. An Ascension Order is required to participate.',
                    '黄楓谷は越国三大修仙门派の一つ。三年ごとに昇仙大会を開催し、有望な弟子を選抜する。参加には昇仙令が必要。'
                )
            }
        },

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //  弧 2：黄枫谷入门篇（扩展分支版）
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            arcId: 'huangfenggu',
            title: '黄枫谷 · 入门篇',
            background: '韩立离开七玄门后，一路打听黄枫谷的下落。黄枫谷位于越国北部苍梧山脉之中，是越国修仙界赫赫有名的大派。按照升仙令上的日期，三个月后黄枫谷将举办三年一度的升仙大会。韩立必须在期限之内赶到，并且通过大会的考核。',
            startDpId: 'hg_1',
            keyItems: [
                {name:'筑基丹',from:'升仙大会奖励',effect:'显著增加筑基成功率的珍贵丹药',type:'pill'},
                {name:'升仙令',from:'七玄门',effect:'黄枫谷升仙大会的入场凭证',type:'scroll'},
                {name:'灵药图鉴',from:'墨大夫遗物',effect:'记载数百种灵药特性的书籍',type:'scroll'}
            ],
            decisionPoints: [
                {
                    id:'hg_1', combatRelated:false, showResult:false,
                    context:L(
                        '你跋涉近两月终于到达苍梧山脉。山脚下有个小镇，聚集着来自各地的修仙者——都是来参加升仙大会的。客栈里人头攒动，你听到人们在讨论升仙大会的规则：灵根测试、功法比试、甚至可以炼丹制药来加分。',
                        'After nearly two months of travel, you finally reach the Cangwu Mountains. At the foothills lies a small town packed with cultivators from all over — all here for the Ascension Assembly. The inns buzz with discussion about the rules: spirit root testing, technique competition, even alchemy can earn bonus points.',
                        '約二か月の旅を経て蒼梧山脈に到着。麓の小さな町は各地から集まった修仙者で賑わっている——皆昇仙大会の参加者だ。宿屋では規則についての議論が飛び交う：霊根検査、功法試合、さらには丹薬製造で加点できるという。'
                    ),
                    choices:[
                        {label:L('在镇上收集情报，了解竞争对手','Gather information about competitors','情報を集め、競争相手を把握する'), next:'hg_1a'},
                        {label:L('直接去黄枫谷山门报到','Go directly to Yellow Maple Valley gate','直接黄楓谷の山門に報告しに行く'), next:'hg_2'},
                        {label:L('在客栈低调修炼，等待大会','Cultivate quietly at the inn, wait for the assembly','宿屋で目立たず修行し、大会を待つ'), next:'hg_1b'},
                        {label:L('找人切磋，试探其他参赛者实力','Find someone to spar with, test others\' strength','誰かと手合わせし、他の参加者の実力を試す'), next:'hg_1c'}
                    ]
                },
                {
                    id:'hg_1a', combatRelated:false, showResult:true,
                    context:L(
                        '你在镇上转了几天，打听到不少消息。这次升仙大会来了不少世家子弟：林家的林师兄擅长剑法，叶家的叶师姐精通符箓，还有一个自称来自天南大陆之外的神秘人。你意识到正面竞争毫无胜算——这些天才从小就有最好的资源和功法。但你也发现了一个机会：大会允许炼丹作为展示，而大部分参赛者都不会炼丹。',
                        'You spend days gathering intelligence. The Assembly has attracted scions of major families: Lin with his sword arts, Ye with her talisman mastery, and a mysterious person claiming to be from beyond the Tiannan Continent. You realize direct competition is futile — these geniuses had the best resources since childhood. But you spot an opportunity: the Assembly allows alchemy demonstrations, and most contestants can\'t refine pills.',
                        '数日間情報を集める。大会には名家の子弟が集まっている：剣術の林、符箓の葉、天南大陸の外から来たという謎の人物。正面競争は無理だと悟る——天才たちは幼い頃から最高の資源で育てられた。しかし機会を見つけた：大会では丹薬製造が展示として認められており、多くの参加者が調合を知らない。'
                    ),
                    choices:[
                        {label:L('专注准备炼丹展示','Focus on preparing alchemy demonstration','丹薬の展示準備に集中する'), next:'hg_2b'},
                        {label:L('想办法打探其他参赛者的弱点','Find weaknesses of other competitors','他の参加者の弱点を探る'), next:'hg_1d'},
                        {label:L('在镇上找一位炼丹师请教','Find an alchemist in town for advice','町の丹師に请教する'), next:'hg_1e'}
                    ]
                },
                {
                    id:'hg_1b', combatRelated:false, showResult:true,
                    context:L(
                        '你在客栈租了一间安静的房间，白天研读《灵药图鉴》，晚上用神秘小瓶凝聚灵液修炼。几天后，你的修为有了明显进步。但你也注意到有人在暗中观察你——一个穿着黄枫谷服饰的弟子在你窗外闪过。',
                        'You rent a quiet room at the inn. By day you study the Illustrated Guide to Spirit Herbs, by night you cultivate with the mysterious vial. After a few days, your cultivation shows clear progress. But you notice someone watching you — a disciple in Yellow Maple Valley attire flashes past your window.',
                        '宿屋の静かな部屋を借りる。昼は霊薬図鑑を読み、夜は神秘の小瓶で修行する。数日後、修為に明らかな進歩が見られる。しかし誰かがこっそり観察していることに気づく——黄楓谷の服を着た弟子が窓の外を素早く通り過ぎた。'
                    ),
                    choices:[
                        {label:L('继续低调修炼，不理他们','Continue cultivating quietly, ignore them','静かに修行を続け、無視する'), next:'hg_2'},
                        {label:L('主动去找那个弟子谈谈','Go talk to that disciple','その弟子に会いに行く'), next:'hg_1f'},
                        {label:L('换个地方修炼，避免暴露','Change locations to avoid exposure','場所を変えて暴露を避ける'), next:'hg_2'}
                    ]
                },
                {
                    id:'hg_1c', combatRelated:true, showResult:true,
                    combat:{enemy:'参赛者甲', enemyHp:50, playerHp:45, playerMp:20,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:8, log:'你施展罗烟步，轻松躲开攻击。'},
                            {label:'基础拳法反击', damage:12, mpCost:3, log:'你用七玄门基础拳法反击！'},
                            {label:'扔出暗器', damage:18, mpCost:5, log:'你从袖中甩出一枚暗器！'},
                            {label:'认输', flee:true, log:'你举起手：我认输，你确实厉害。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被参赛者打成重伤……'}}},
                    context:L(
                        '你在镇外找到一个正在练功的参赛者。他看起来实力不错，正合你意。你上前提出切磋，他上下打量了你一番，冷笑：就你？来吧。',
                        'You find a competitor practicing outside town. He looks strong enough for a test. You approach and propose a spar. He sizes you up and smirks: You? Come then.',
                        '町の外で修行している参加者を見つける。実力がありそうだ。手合わせを申し出る。彼はあなたを見下ろして冷笑する：お前か？来い。'
                    ),
                    choices:[
                        {label:L('认真切磋，学习对方功法','Spar seriously, learn his technique','真剣に手合わせし、相手の功法を学ぶ'), next:'hg_2'},
                        {label:L('点到为止，拉近关系','Stop at first contact, build relationship','手加減して関係を構築する'), next:'hg_1g'}
                    ]
                },
                {
                    id:'hg_1d', combatRelated:false, showResult:true,
                    context:L(
                        '你花了几天时间暗中观察其他参赛者。林师兄的剑法虽然凌厉但体力一般，叶师姐的符箓需要时间准备，而那个神秘人……你发现他在深夜偷偷修炼一种诡异的功法，手上闪烁着黑色光芒。这功法看起来有些眼熟——和墨大夫的邪功有几分相似。',
                        'You spend days secretly observing competitors. Lin\'s sword arts are sharp but his stamina is mediocre. Ye\'s talismans need preparation time. And the mysterious person... you catch him cultivating a sinister technique at night, black light flickering on his hands. It looks familiar — similar to Doctor Mo\'s evil cultivation.',
                        '数日間こっそり観察する。林の剣術は鋭いが持久力が悪い。葉の符箓は準備が必要。そして謎の人物——夜に不気味な功法を修行しているのが見える。手に黒い光。墨大夫の邪功に似ている。'
                    ),
                    choices:[
                        {label:L('记住这个发现，大会时可能有用','Remember this for the assembly','この発見を覚えておく'), next:'hg_2b'},
                        {label:L('威胁那个神秘人，敲诈好处','Threaten the mysterious person for benefits','謎の人物を脅して利益を搾取する'), next:'hg_1h'},
                        {label:L('报告给黄枫谷的巡山弟子','Report to Yellow Maple Valley patrol','黄楓谷の巡山弟子に報告する'), next:'hg_1i'}
                    ]
                },
                {
                    id:'hg_1e', combatRelated:false, showResult:true,
                    context:L(
                        '你在镇上找到一位落魄的炼丹师，他因为一次炼丹事故失去了门派，现在靠卖散药为生。你用几枚灵石换取了他的指点。他告诉你一个秘诀：炼丹时要控制火候，先文火后武火，成丹率能提高两成。他还透露黄枫谷的长老特别看重筑基丹的炼制——如果你能在这方面展现天赋，入选几乎十拿九稳。',
                        'You find a down-on-his-luck alchemist in town who lost his sect after an accident. For a few spirit stones, he shares his secrets: control the fire — gentle first, fierce second — and your success rate improves by 20%. He also reveals that Yellow Maple Valley elders especially value Foundation Pill refinement — show talent there, and selection is virtually guaranteed.',
                        '町で不遇の丹師を見つける。事故で門派を失い、散薬を売って生計を立てている。霊石数枚で助言を買う：火加減のコントロール——弱火から強火へ——で成功率が二割上がる。さらに黄楓谷の長老は特に筑基丹の調合を重視している——ここで天才を見せれば、選抜はほぼ確実だ。'
                    ),
                    choices:[
                        {label:L('谢过他，专心准备炼丹展示','Thank him, focus on alchemy preparation','感謝し、丹薬の準備に集中する'), next:'hg_2b'},
                        {label:L('问他有没有快速提升修为的方法','Ask about methods to quickly boost cultivation','修為を急速に上げる方法を聞く'), next:'hg_1j'}
                    ]
                },
                {
                    id:'hg_1f', combatRelated:false, showResult:true,
                    context:L(
                        '你找到那个黄枫谷弟子。他坦白说：我是丹房主事派来观察新人的。你这几天的表现不错——低调、勤奋、有潜力。如果你在大会上表现出色，我可以向主事推荐你进丹房。他递给你一块令牌：这是我的信物，大会时如果遇到麻烦可以找我帮忙。',
                        'You find the disciple. He confesses: I was sent by the pill refinery supervisor to observe newcomers. You\'ve been good — low-key, diligent, with potential. If you perform well at the Assembly, I can recommend you to the refinery. He hands you a token: Take this. If you have trouble at the Assembly, find me.',
                        'その弟子を見つける。彼は白状する：丹房の責任者に派遣され、新人を観察していた。あなたの这几天の様子は良い——目立たず、勤勉で、潜力がある。大会で結果を出せば、丹房に推薦する。令牌を渡す：これを持っておけ。大会でトラブルがあれば来找我。'
                    ),
                    choices:[
                        {label:L('收下令牌，感谢他的帮助','Accept the token, thank him','令牌を受け取り感謝する'), next:'hg_2'},
                        {label:L('追问丹房主事的情况','Ask about the refinery supervisor','丹房の責任者の情報を聞く'), next:'hg_1k'}
                    ]
                },
                {
                    id:'hg_1g', combatRelated:false, showResult:true,
                    context:L(
                        '你和那个参赛者打了个平手。他对你刮目相看：你功法一般但身法不错，是个人才。他自我介绍叫陈风，来自一个小门派。你提议一起修炼，他欣然同意。接下来几天你们互相切磋，你的实战经验大幅提升。',
                        'You fight to a draw. He\'s impressed: Your technique is ordinary but your footwork is excellent. He introduces himself as Chen Feng from a small sect. You suggest training together, and he agrees. Over the next few days you spar repeatedly, greatly improving your combat experience.',
                        '引き分けに終わる。彼は感心する：功法は一般だが身法は優れている。陳風と名乗り、小門派から来たと言う。一緒に修行しようと提案し、彼は快諾する。数日間の手合わせで実戦経験が大幅に向上する。'
                    ),
                    choices:[
                        {label:L('邀请他一起参加大会','Invite him to join the Assembly together','一緒に大会に参加するよう誘う'), next:'hg_2'},
                        {label:L('独自准备，保持优势','Prepare alone, maintain your edge','一人で準備し、優位を保つ'), next:'hg_2b'}
                    ]
                },
                {
                    id:'hg_1h', combatRelated:true, showResult:true,
                    combat:{enemy:'神秘人', enemyHp:80, playerHp:50, playerMp:25,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:10, log:'你施展罗烟步躲开攻击。'},
                            {label:'用灵液攻击', damage:22, mpCost:12, log:'你将灵液洒向对方，邪功被干扰！'},
                            {label:'扔出暗器', damage:15, mpCost:5, log:'你甩出一枚暗器！'},
                            {label:'逃跑', flee:true, log:'你转身就跑！'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被神秘人重伤了……'}}},
                    context:L(
                        '你找到那个神秘人，威胁要揭发他修炼邪功的事。他冷笑：你以为你能威胁我？他猛然出手，你早有准备——你知道这种人不会轻易就范。',
                        'You find the mysterious person and threaten to expose his evil cultivation. He sneers: You think you can threaten me? He attacks — you were ready. You knew this kind of person wouldn\'t cooperate easily.',
                        '謎の人物を見つけ、邪功修練を暴露すると脅す。冷笑する：脅せると思っているのか？彼が攻撃——覚悟はできていた。この種の人間が簡単に従うとは思っていない。'
                    ),
                    choices:[
                        {label:L('趁他分心偷袭','Sneak attack while he\'s distracted','気が散っている隙を突いて不意打ち'), next:'hg_2'},
                        {label:L('拉开距离，把事情闹大','Back off, make a scene','距離を取り、騒ぎを大きくする'), next:'hg_1i'}
                    ]
                },
                {
                    id:'hg_1i', combatRelated:false, showResult:true,
                    context:L(
                        '你把神秘人修炼邪功的事报告给了黄枫谷的巡山弟子。他们立刻上报长老。几个时辰后，黄枫谷派出执法队将神秘人逮捕。你因此获得了黄枫谷的好感——长老亲自接见了你，称赞你为门派除害。你意识到这是一个绝佳的机会。',
                        'You report the mysterious person\'s evil cultivation to Yellow Maple Valley patrol. They report to elders immediately. Hours later, an enforcement team arrests the person. You earn Yellow Maple Valley\'s goodwill — an elder personally meets you and thanks you for eliminating a threat. You realize this is a golden opportunity.',
                        '謎の人物の邪功修練を黄楓谷の巡山弟子に報告。即座に長老に報告。数時間後、執法隊が逮捕する。黄楓谷の好意を得る——長老が直接面会し、害を除いたことを感謝する。これは絶好のチャンスだと悟る。'
                    ),
                    choices:[
                        {label:L('趁机请求加入丹房','Use this chance to request joining the pill refinery','この機会を逃さず丹房入りを願い出る'), next:'hg_2'},
                        {label:L('请求长老指点修炼','Ask the elder for cultivation guidance','長老に修行の指導を請う'), next:'hg_1k'}
                    ]
                },
                {
                    id:'hg_1j', combatRelated:false, showResult:true,
                    context:L(
                        '那炼丹师想了一会儿：快速提升修为？有是有，但风险极大。你需要找一种叫"灵焰草"的灵药，配合特殊手法可以在短时间内提升一个小境界。但这种草非常稀有，而且服用后会有副作用——三天内修为会倒退半层。你想试试吗？',
                        'The alchemist thinks: Quick cultivation boost? It exists, but extremely risky. You need a herb called "Spirit Flame Grass" with special techniques to raise a minor realm temporarily. But it\'s very rare, and there\'s a side effect — cultivation drops half a layer for three days. Want to try?',
                        '丹師はしばらく考える：急速な修為向上？あるが、極めて危険だ。霊炎草と呼ばれる霊薬を見つけ、特殊な手法で短期間で小境界を上げられる。しかし非常に稀で、副作用がある——三日間修為が半分下がる。試すか？'
                    ),
                    choices:[
                        {label:L('值得冒险，去找灵焰草','Worth the risk, find the Spirit Flame Grass','冒険する価値がある、霊炎草を探す'), next:'hg_1l'},
                        {label:L('太冒险了，还是稳扎稳打','Too risky, play it safe','リスクが高すぎる、安全を取る'), next:'hg_2b'}
                    ]
                },
                {
                    id:'hg_1k', combatRelated:false, showResult:true,
                    context:L(
                        '长老看了你一眼：你倒是识趣。他从袖中取出一枚玉简：这里面记载了黄枫谷的基础功法"黄枫诀"，你先练着。如果你在大会上表现出色，我会收你为亲传弟子。你恭敬地接过玉简，心中暗喜——这比预期的收获大得多。',
                        'The elder eyes you: You know your place. He produces a jade slip: This contains the basic technique "Yellow Maple Art". Practice it. Perform well at the Assembly, and I\'ll take you as a personal disciple. You accept gratefully — this is far more than expected.',
                        '長老が見る：分別があるな。玉簡を出す：黄楓谷の基礎功法『黄楓訣』だ。修行しろ。大会で結果を出せば、直弟子にする。恭敬に受け取る——予想以上の収穫だ。'
                    ),
                    choices:[
                        {label:L('谢过长老，专心修炼黄枫诀','Thank the elder, focus on practicing the Yellow Maple Art','長老に感謝し、黄楓訣の修行に集中する'), next:'hg_2'},
                        {label:L('追问更多关于大会的信息','Ask for more information about the Assembly','大会の情報をもっと聞く'), next:'hg_2'}
                    ]
                },
                {
                    id:'hg_1l', combatRelated:false, showResult:true,
                    context:L(
                        '你花了两天时间在苍梧山脉深处找到了灵焰草。按照炼丹师教你的方法服下——一股灼热的力量涌入丹田，你的修为瞬间从炼气期四层突破到五层！但三天后修为会倒退，你必须在三天内通过大会。你赌对了。',
                        'You spend two days finding Spirit Flame Grass deep in the Cangwu Mountains. Following the alchemist\'s method, you consume it — searing power floods your dantian, instantly breaking through from the fourth to fifth layer of Qi Refining! But cultivation will drop in three days — you must pass the Assembly within that window. You\'ve bet correctly.',
                        '二日間かけて蒼梧山脈の奥深くで霊炎草を見つける。丹師の方法に従って服用する——灼熱の力が丹田に流れ込み、練気期四層から五層に瞬時に突破する！しかし三日後に修為が下がる——三日以内に大会を通過しなければならない。賭けに勝った。'
                    ),
                    choices:[
                        {label:L('趁热打铁，直接去参加大会','Strike while the iron is hot, go to the Assembly immediately','勢いのまま、直ちに大会に参加する'), next:'hg_2'},
                        {label:L('用这三天疯狂炼丹，准备展示','Use these three days to refine pills frantically','三日間猛ダッシュで丹薬を調合し展示を準備する'), next:'hg_2b'}
                    ]
                },
                {
                    id:'hg_2', combatRelated:false, showResult:false,
                    context:L(
                        '升仙大会终于开始了。偌大的广场上，数十名求仙者依次展示自己的才能。有人催动法器证明修为，有人当众炼制丹药，有人演示精妙功法。轮到你了。你知道自己的伪灵根在灵根测试中必定垫底。',
                        'The Ascension Assembly begins. In the vast plaza, dozens of seekers demonstrate their talents one by one. Some activate magic tools to prove their cultivation, some refine pills in public, some show exquisite techniques. It\'s your turn. You know your false spirit root will rank last in testing.',
                        '昇仙大会が始まった。広大な広場で、数十人の志願者が次々と才能を示す。法器を駆使して修為を証明する者、公開で丹薬を調合する者、精妙な功法を披露する者。あなたの番だ。偽。偽霊根では霊根検査で最下位になることは分かっている。'
                    ),
                    choices:[
                        {label:L('当众展示炼丹术','Demonstrate alchemy publicly','公開で丹薬製造を披露する'), next:'hg_2b'},
                        {label:L('先通过灵根测试，再想办法','Pass the spirit root test first, then think','まず霊根検査を通過し、後で考える'), next:'hg_2a'},
                        {label:L('找机会偷偷溜过测试','Sneak past the test','こっそり検査をすり抜ける'), next:'hg_2c'},
                        {label:L('主动挑战其他参赛者，展示实力','Challenge other competitors to show strength','他の参加者に挑戦して実力を示す'), next:'hg_2d'}
                    ]
                },
                {
                    id:'hg_2a', combatRelated:false, showResult:true,
                    context:L(
                        '你硬着头皮将手放在测试石上。五彩光芒亮起——和七玄门时一样的结果。负责测试的长老皱眉：伪灵根。周围响起一片议论声。你注意到有几个世家子弟在嘲笑你。但你不动声色——你知道接下来才是重点。',
                        'You place your hand on the testing stone. Five-colored light appears — same as at the Seven Mysteries Sect. The testing elder frowns: False spirit root. Murmurs spread. You notice several aristocratic disciples mocking you. But you stay calm — you know what comes next is what matters.',
                        '意を決して検査石に手を置く。五色の光——七玄門と同じ結果。検査長老が眉をひそめる：偽霊根。ざわめきが広がる。名家の子弟が嘲笑している。しかし落ち着いている——次が重要だ。'
                    ),
                    choices:[
                        {label:L('立刻展示炼丹术，扭转印象','Immediately demonstrate alchemy to change impression','直ちに丹薬製造を披露し印象を変える'), next:'hg_2b'},
                        {label:L('低调通过，不在意他人眼光','Get through quietly, ignore others\' opinions','静かに通り、他人の目を気にしない'), next:'hg_3'}
                    ]
                },
                {
                    id:'hg_2b', combatRelated:false, showResult:true,
                    context:L(
                        '你深吸一口气，走到广场中央。在众人目光下，你取出丹炉和几味常见灵药，手法娴熟地开始炼制一枚最基础的聚灵丹。你的手法比寻常炼丹师少用了三成药力——这是在药园反复实践的结果。丹药出炉时香气四溢，几位黄枫谷的长老互相交换了一下眼神。你成功了。',
                        'You take a deep breath and walk to the center of the plaza. Under everyone\'s gaze, you take out your cauldron and common herbs, skillfully beginning to refine a basic spirit-gathering pill. Your technique uses 30% less energy — the result of countless practice in the herb garden. When the pill is done, its fragrance fills the air. Several elders exchange meaningful glances. You\'ve succeeded.',
                        '深く息を吸い、広場の中央へ歩く。皆の視線の中、丹炉と数種の霊薬を取り出し、手際よく最も基本的な聚霊丹を調合し始める。あなたの手法は通常の丹師より三割も薬力を節約している——薬園での反復練習の成果だ。丹薬が完成すると香りが広がり、数人の長老が意味深な視線を交わす。成功したのだ。'
                    ),
                    choices:[
                        {label:L('趁势提出进丹房的请求','Use this momentum to request joining the pill refinery','この勢いで丹房入りを願い出る'), next:'hg_3'},
                        {label:L('低调退下，等待结果','Quietly step back, wait for results','静かに下がり、結果を待つ'), next:'hg_3'}
                    ]
                },
                {
                    id:'hg_2c', combatRelated:false, showResult:true,
                    context:L(
                        '你趁着混乱悄悄溜过测试环节。但你没注意到一个黄枫谷长老一直在观察你——他发现了你的小动作。长老冷笑：有点意思。他没有当场揭穿你，而是暗中留意了你。',
                        'You sneak past the testing during the commotion. But you don\'t notice a Yellow Maple Valley elder observing you — he catches your little trick. The elder smirks: Interesting. He doesn\'t expose you but keeps a close watch.',
                        '混乱に乗じて検査をすり抜ける。しかし黄楓谷の長老がずっと観察していたことに気づかない——小細工を見破られていた。長老は冷笑する：面白い。その場では暴露せず、密かに注目する。'
                    ),
                    choices:[
                        {label:L('假装不知情，继续参加','Pretend you don\'t know, continue participating','気づかないふりをして続ける'), next:'hg_3'},
                        {label:L('主动找长老坦白','Go confess to the elder proactively','自ら長老に坦白しに行く'), next:'hg_2e'}
                    ]
                },
                {
                    id:'hg_2d', combatRelated:true, showResult:true,
                    combat:{enemy:'林师兄', enemyHp:90, playerHp:55, playerMp:30,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:10, log:'你施展罗烟步躲开剑招。'},
                            {label:'基础拳法反击', damage:14, mpCost:5, log:'你抓住破绽反击！'},
                            {label:'扔出暗器', damage:20, mpCost:8, log:'你甩出暗器直取面门！'},
                            {label:'认输', flee:true, log:'你举起手：我输了。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被林师兄的剑法重伤了……'}}},
                    context:L(
                        '你主动挑战林师兄。他冷笑：就凭你？他拔剑出手——剑速极快，你勉强接了几招。但你发现他的弱点：体力一般，持久战对他不利。',
                        'You challenge Lin. He sneers: You? He draws his sword — incredibly fast. You barely block a few strikes. But you spot his weakness: mediocre stamina. A prolonged fight favors you.',
                        '林に挑戦する。冷笑：お前で？剣を抜く——速度が速く、かろうじて数発受ける。しかし弱点を発見：持久力が悪い。長引けばこちらに有利だ。'
                    ),
                    choices:[
                        {label:L('拖延战斗，消耗他体力','Drag out the fight, wear him down','戦いを引き伸ばし、体力を消耗させる'), next:'hg_3'},
                        {label:L('全力一击，争取速胜','Go all-out for a quick victory','全力を出して速勝を狙う'), next:'hg_3'}
                    ]
                },
                {
                    id:'hg_2e', combatRelated:false, showResult:true,
                    context:L(
                        '你主动找到那位长老坦白：长老，我刚才用了些小聪明，但我的炼丹术是真的。长老看了你很久：你倒是个坦诚的人。也罢，你去展示你的炼丹术吧，如果真有本事，我不会为难你。你如释重负，走到广场中央开始炼丹。',
                        'You find the elder and confess: Elder, I used a trick just now, but my alchemy is real. He studies you for a long time: You\'re honest at least. Fine, go demonstrate your alchemy. If you truly have skill, I won\'t make things difficult. You exhale with relief and walk to the plaza center to begin refining.',
                        '長老を見つけて坦白する：長老、さっきちょっとした小細工を使いましたが、私の丹薬の腕は本物です。長老は長く見る：少なくとも正直だな。よし、丹薬を披露しろ。本当に腕があれば、わざわざはしない。安堵の息を吐いて広場の中央へ歩く。'
                    ),
                    choices:[
                        {label:L('全力展示炼丹术','Show your full alchemy skills','全力で丹薬の腕前を披露する'), next:'hg_2b'},
                        {label:L('展示更高阶的丹药，惊艳全场','Demonstrate a higher-level pill to impress everyone','より高次の丹薬を披露して全场を驚かせる'), next:'hg_2f'}
                    ]
                },
                {
                    id:'hg_2f', combatRelated:false, showResult:true,
                    context:L(
                        '你决定冒险——炼制一枚培元丹。这比聚灵丹高了两个品级，对炼气期修士有极大好处。你手法娴熟地控制火候，汗水顺着额头滴落。广场上鸦雀无声。半个时辰后，一枚散发着金色光芒的丹药出炉了——培元丹，上品！几位黄枫谷长老同时站了起来。你成功惊艳了全场。',
                        'You decide to take a risk — refine a Foundation Nourishing Pill. Two grades above the spirit-gathering pill, immensely beneficial for Qi Refining cultivators. You skillfully control the fire, sweat dripping down your forehead. The plaza falls silent. Half an hour later, a golden-glowing pill emerges — Foundation Nourishing Pill, superior grade! Several elders stand up simultaneously. You\'ve stunned everyone.',
                        '賭けに出る——培元丹を調合する。聚霊丹より二段階高次の品で、練気期の修士に極めて有益だ。手際よく火をコントロールし、額から汗が落ちる。広場が静まり返る。半時後、金色の光を放つ丹薬が完成——培元丹、上品！数人の長老が同時に立ち上がる。全场を驚かせた。'
                    ),
                    choices:[
                        {label:L('趁势请求长老收为弟子','Use this to request the elder take you as disciple','長老に弟子入りを願い出る'), next:'hg_3'},
                        {label:L('低调退下，不引人注目','Quietly step back, avoid attention','静かに下がり、目立たないようにする'), next:'hg_3'}
                    ]
                },
                {
                    id:'hg_3', combatRelated:false, showResult:false,
                    context:L(
                        '恭喜！你被黄枫谷录取为外门弟子。入门后你面临一个选择——丹房、巡逻队、还是藏经阁。每个部门都有不同的利弊。丹房适合炼丹师，巡逻队能提升战力，藏经阁则能接触大量功法。',
                        'Congratulations! You\'re accepted as an outer disciple. You face a choice — pill refinery, patrol team, or scripture library. Each department has different pros and cons. The refinery suits alchemists, the patrol boosts combat, the library provides access to techniques.',
                        'おめでとう！外門弟子に合格した。丹房、巡房、巡邏隊、蔵経閣——三つの配属先から選ぶ必要がある。それぞれ利点と欠点がある。丹房は丹師向き、巡邏隊は戦力向上、蔵経閣は多くの功法にアクセスできる。'
                    ),
                    choices:[
                        {label:L('选择丹房，发挥炼丹特长','Choose the pill refinery, leverage alchemy skills','丹房を選び、丹薬の腕を活かす'), next:'hg_4'},
                        {label:L('选择巡逻队，提升实战能力','Choose the patrol team, improve combat ability','巡邏隊を選び、実戦能力を上げる'), next:'hg_3a'},
                        {label:L('选择藏经阁，学习更多功法','Choose the scripture library, learn more techniques','蔵経閣を選び、もっと功法を学ぶ'), next:'hg_3b'},
                        {label:L('请求长老收为亲传弟子','Ask the elder to take you as personal disciple','長老に直弟子入りを願い出る'), next:'hg_3c'}
                    ]
                },
                {
                    id:'hg_3a', combatRelated:true, showResult:true,
                    combat:{enemy:'演武对手', enemyHp:60, playerHp:50, playerMp:25,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:8, log:'你施展罗烟步躲开攻击。'},
                            {label:'基础拳法反击', damage:12, mpCost:3, log:'你用基础拳法反击！'},
                            {label:'扔出暗器', damage:18, mpCost:5, log:'你甩出暗器！'},
                            {label:'认输', flee:true, log:'你举起手：我认输。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你在巡逻队训练中受伤了……'}}},
                    context:L(
                        '你选择了巡逻队。巡逻队的训练非常艰苦——每天都要进行实战对练。你虽然是炼丹师出身，但神秘小瓶给你的灵液让你的修为不输于人。一个月后，你的实战能力大幅提升。巡逻队长对你刮目相看：你小子，有两下子。',
                        'You join the patrol team. Training is brutal — daily sparring sessions. Though you\'re an alchemist by trade, the spirit liquid from the mysterious vial keeps your cultivation competitive. After a month, your combat ability improves dramatically. The patrol captain is impressed: Kid, you\'ve got some skill.',
                        '巡邏隊に入る。訓練は過酷——毎日の実戦稽古。丹師だが、神秘の小瓶の霊液のおかげで修為は遅れない。一ヶ月後、実戦能力が劇的に向上する。隊長が感心する：坊主、少しはやるな。'
                    ),
                    choices:[
                        {label:L('继续在巡逻队修炼','Continue training in the patrol','巡邏隊で修行を続ける'), next:'hg_4'},
                        {label:L('申请转到丹房','Request transfer to the pill refinery','丹房への異動を申し出る'), next:'hg_4'}
                    ]
                },
                {
                    id:'hg_3b', combatRelated:false, showResult:true,
                    context:L(
                        '你选择了藏经阁。藏经阁的管事是个古怪的老头，他看你顺眼，允许你阅读低阶功法。你花了一个月时间阅读了大量功法，对修仙之道有了更深的理解。你还发现了一本炼丹秘籍——《火候心法》，这让你的炼丹术更上一层楼。',
                        'You join the scripture library. The keeper is an eccentric old man who takes a liking to you and allows access to low-grade techniques. You spend a month reading extensively, gaining deeper understanding of cultivation. You also discover an alchemy manual — "Fire Control Secrets" — elevating your pill refinement skills.',
                        '蔵経閣に入る。管理人は風変わりな老人で、あなたを見て気に入り、低級功法の閲覧を許可する。一ヶ月間大量の功法を読み、修仙の道をより深く理解する。丹薬の秘伝書『火候心法』も発見——丹薬の腕がさらに上がる。'
                    ),
                    choices:[
                        {label:L('专心研读火候心法','Focus on studying Fire Control Secrets','火候心法の研究に集中する'), next:'hg_4'},
                        {label:L('继续广泛阅读，寻找更多秘籍','Continue reading widely for more secrets','さらに広く読み、更多の秘伝を探す'), next:'hg_4'}
                    ]
                },
                {
                    id:'hg_3c', combatRelated:false, showResult:true,
                    context:L(
                        '你鼓起勇气找到长老：长老，我想拜您为师。长老看了你很久：你倒是有野心。也罢，如果你能在一个月内将炼气期提升到五层，我就收你为亲传弟子。你心中暗喜——有神秘小瓶的帮助，这个目标不难实现。',
                        'You gather courage and find the elder: Elder, I wish to become your disciple. He studies you for a long time: Ambitious. Very well — raise your cultivation to the fifth layer within a month, and I\'ll take you as a personal disciple. You\'re secretly pleased — with the mysterious vial, this goal is easily achievable.',
                        '勇気を出して長老を見つける：長老、弟子になりたいです。長老は長く見る：野心があるな。よし、一ヶ月以内に練気期五層に達すれば、直弟子にしてやる。内心喜ぶ——神秘の小瓶のおかげなら、この目標は容易だ。'
                    ),
                    choices:[
                        {label:L('接受挑战，全力以赴','Accept the challenge, give it your all','挑戦を受け入れ、全力で取り組む'), next:'hg_4'},
                        {label:L('追问更多关于亲传弟子的事','Ask more about being a personal disciple','直弟子のことをもっと聞く'), next:'hg_4'}
                    ]
                },
                {
                    id:'hg_4', combatRelated:false, showResult:false,
                    context:L(
                        '你在黄枫谷稳定下来。无论选择哪个部门，你都制定了严格的作息：白天工作获得宗门贡献，晚上用神秘小瓶凝聚灵液加速修炼。这样的节奏持续了三个月，你的修为悄然提至炼气期五层，炼丹术也小有名气。一切都在稳步前进。',
                        'You settle into Yellow Maple Valley. Regardless of department, you establish a strict routine: work by day for sect contribution, cultivate with the mysterious vial by night. After three months, your cultivation quietly reaches the fifth layer of Qi Refining, and your alchemy gains reputation. Everything progresses steadily.',
                        '黄楓谷で落ち着く。どの部門でも厳格な日課を定める：昼は貢献度を得て働き、夜は神秘の小瓶で修行する。三ヶ月後、修為は密かに練気期五層に達し、丹薬術も評判を得る。すべてが着実に進んでいる。'
                    ),
                    choices:[
                        {label:L('继续保持低调','Continue keeping a low profile','目立たず続ける'), next:'hg_5'},
                        {label:L('主动寻找更多机会','Actively seek more opportunities','積極的に更多の機会を探す'), next:'hg_4a'}
                    ]
                },
                {
                    id:'hg_4a', combatRelated:false, showResult:true,
                    context:L(
                        '你打听到黄枫谷即将举行一次内部丹药比试，获胜者可以得到一枚筑基丹作为奖励。你决定参加——这是展示实力的好机会。但你也知道，丹房的其他丹师也在觊觎这枚筑基丹。',
                        'You learn that Yellow Maple Valley will hold an internal pill competition, with a Foundation Pill as the winner\'s prize. You decide to participate — a great chance to showcase your skills. But you know other alchemists in the refinery also covet this pill.',
                        '黄楓谷で内部丹薬試合が行われる情報を得る。優勝賞品は筑基丹。参加を決意——実力を示す絶好の機会だ。しかし丹房の他の丹師もこの筑基丹を狙っている。'
                    ),
                    choices:[
                        {label:L('全力以赴参加比试','Give it your all in the competition','全力で試合に参加する'), next:'hg_5'},
                        {label:L('暗中动手脚，确保胜利','Secretly sabotage competitors to ensure victory','こっそり妨害工作をして勝利を確実にする'), next:'hg_4b'}
                    ]
                },
                {
                    id:'hg_4b', combatRelated:false, showResult:true,
                    context:L(
                        '你趁人不注意，在竞争对手的丹炉中做了手脚——你调整了他们的火候控制器。比试时，他们的丹药接连失败，而你顺利炼制出上品丹药。你赢了，但心里有些不安。主事看了你一眼，意味深长地说：赢了就好。',
                        'You tamper with a competitor\'s cauldron — adjusting their fire controller. During the competition, their pills fail one after another while you smoothly refine a superior pill. You win, but feel uneasy. The supervisor gives you a meaningful look and says: A win is a win.',
                        '隙をついて競争相手の丹炉に細工する——火加減コントローラーを調整。試合中、相手の丹薬が次々と失敗し、あなたは上品の丹薬をスムーズに調合する。勝利するが、不安を感じる。責任者が意味深に言う：勝てばよい。'
                    ),
                    choices:[
                        {label:L('接受胜利，获得筑基丹','Accept the victory, obtain the Foundation Pill','勝利を受け入れ、筑基丹を手に入れる'), next:'hg_5'},
                        {label:L('向主事坦白，请求宽大处理','Confess to the supervisor, ask for leniency','責任者に坦白し、寛大な処理を請う'), next:'hg_4c'}
                    ]
                },
                {
                    id:'hg_4c', combatRelated:false, showResult:true,
                    context:L(
                        '你向主事坦白了一切。主事沉默了很久：你倒是诚实。也罢，你的炼丹天赋确实不错，这次就放过你。但下次再犯，绝不轻饶。你松了一口气。主事接着说：不过，你的筑基丹名额没了。你需要用其他方式证明自己的价值。',
                        'You confess everything to the supervisor. He\'s silent for a long time: You\'re honest, at least. Your alchemy talent is genuine, so I\'ll let it go this time. But never again. You sigh with relief. He adds: However, your Foundation Pill quota is gone. You\'ll need to prove your worth another way.',
                        'すべてを責任者に坦白する。責任者は長く黙る：正直ではあるな。丹薬の才能は本物だから、今回は見逃してやる。だが次はない。安堵の息をつく。彼は続ける：しかし、筑基丹の枠はなくなった。別の方法で価値を証明する必要がある。'
                    ),
                    choices:[
                        {label:L('接受惩罚，用其他方式证明自己','Accept the punishment, prove yourself another way','罰を受け、別の方法で価値を証明する'), next:'hg_5'},
                        {label:L('暗中计划偷取筑基丹','Secretly plan to steal a Foundation Pill','こっそり筑基丹を盗む計画を立てる'), next:'hg_4d'}
                    ]
                },
                {
                    id:'hg_4d', combatRelated:true, showResult:true,
                    combat:{enemy:'丹房守卫', enemyHp:60, playerHp:50, playerMp:25,
                        actions:[
                            {label:'罗烟步潜入', dodge:true, mpCost:10, log:'你施展罗烟步悄悄潜入。'},
                            {label:'打晕守卫', damage:15, mpCost:5, log:'你从背后打晕了守卫！'},
                            {label:'快速偷取', damage:0, mpCost:3, log:'你趁乱快速偷走了筑基丹！'},
                            {label:'放弃逃跑', flee:true, log:'你决定不冒这个险。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被丹房守卫抓住了……'}}},
                    context:L(
                        '深夜，你偷偷潜入丹房。守卫正在打瞌睡，但中间有一道灵力屏障。你知道这是唯一的机会——如果被发现，你在黄枫谷的一切努力都会付诸东流。',
                        'Late at night, you sneak into the pill refinery. Guards doze off, but a spirit barrier blocks the way. You know this is your only chance — if caught, everything you\'ve built in Yellow Maple Valley will be lost.',
                        '深夜、こっそり丹房に侵入する。守衛が居眠りしているが、霊力の障壁がある。これが唯一のチャンスだ——見つかれば、黄楓谷でのすべてが水の泡になる。'
                    ),
                    choices:[
                        {label:L('成功偷到筑基丹，全身而退','Successfully steal the pill and escape','見事に筑基丹を盗み、無傷で撤退する'), next:'hg_5'},
                        {label:L('被发现，但成功逃脱','Get spotted but manage to escape','見つかるが、何とか逃げ切る'), next:'hg_5'}
                    ]
                },
                {
                    id:'hg_5', combatRelated:true, showResult:true,
                    context:L(
                        '一天丹房主事把你叫到一旁，交给你一个重要任务：炼制一批筑基丹。筑基丹是黄枫谷最珍贵的丹药之一，使用失败会浪费大量稀有灵药，所以长老们只把任务交给最信任的丹师。主事之所以选你，是因为你在三个月内从未出过一次废丹。',
                        'One day the refinery supervisor pulls you aside with an important task: refine a batch of Foundation Establishment Pills. These are among the sect\'s most precious pills — a single failure wastes vast rare herbs, so only the most trusted alchemists get the task. The supervisor chose you because you haven\'t produced a single failed pill in three months.',
                        'ある日、丹房の責任者があなたを呼び止め、重要な任務を与える：筑基丹の調合だ。筑基丹は黄楓谷で最も貴重な丹薬の一つで、失敗すれば大量の希少霊薬を無駄にするため、長老たちは最も信頼する丹師にしか任せない。責任者があなたを選んだのは、三ヶ月間一度も失敗作を出さなかったからだ。'
                    ),
                    choices:[
                        {label:L('认真炼丹，同时暗中藏下两枚筑基丹','Refine carefully while secretly keeping two','丁寧に調合しつつ、密かに二粒を取っておく'), next:'hg_6'},
                        {label:L('全力炼制，不留私心','Refine with full effort, no selfishness','全力で調合し、私心を持たない'), next:'hg_6'},
                        {label:L('假装生病，推掉任务','Pretend to be sick, refuse the task','病気のふりをして任務を断る'), next:'hg_5a'},
                        {label:L('趁机在丹药中做手脚','Take this chance to tamper with the pills','この機会に丹薬に細工をする'), next:'hg_5b'}
                    ]
                },
                {
                    id:'hg_5a', combatRelated:false, showResult:true,
                    context:L(
                        '你假装生病推掉了任务。主事虽然有些不满，但也没有勉强。你后来听说，这次炼丹任务被另一个丹师接手了，但他失败了——浪费了大量珍贵灵药。长老们大发雷霆。你暗自庆幸自己的决定，但也错失了一个展示实力的机会。',
                        'You pretend to be sick and decline. The supervisor is displeased but doesn\'t force you. You later learn another alchemist took the task — and failed, wasting precious herbs. The elders were furious. You\'re secretly glad but also missed a chance to prove yourself.',
                        '病気のふりをして断る。責任者は不満だが無理はしない。後に別の丹師が引き受けたが、失敗し、貴重な霊薬を無駄にしたことが分かる。長老たちは激怒する。内心庆幸するが、実力を示す機会も逃した。'
                    ),
                    choices:[
                        {label:L('趁机请求接手任务','Use this chance to request taking over','この機会に任務の引き受けを願い出る'), next:'hg_5'},
                        {label:L('继续保持低调','Continue keeping a low profile','目立たず続ける'), next:'hg_6'}
                    ]
                },
                {
                    id:'hg_5b', combatRelated:false, showResult:true,
                    context:L(
                        '你在炼制过程中悄悄在几枚筑基丹中掺入了特殊材料——这些丹药服用后虽然短期效果显著，但长期会有副作用。你将这些做了手脚的丹药混入正常丹药中。任务完成后，主事对你赞不绝口。但你知道，迟早会有人发现异常。',
                        'You secretly add special materials to several Foundation Pills — they\'ll have short-term benefits but long-term side effects. You mix these tampered pills with normal ones. After completion, the supervisor praises you. But you know sooner or later someone will notice.',
                        '調合中にいくつかの筑基丹に特殊な材料を混ぜる——短期的には効果的だが、長期的には副作用がある。細工した丹薬を正常な丹薬に混ぜる。完了後、責任者に褒められる。しかし遅かれ早かれ誰かが異常に気づくだろう。'
                    ),
                    choices:[
                        {label:L('接受赞誉，暗中观察谁会出问题','Accept praise, secretly watch for side effects','褒めを受け、誰に副作用が出るか密かに観察する'), next:'hg_6'},
                        {label:L('立刻离开黄枫谷，避免被发现','Leave Yellow Maple Valley immediately to avoid detection','すぐに黄楓谷を出て、発見を避ける'), next:'hg_6'}
                    ]
                },
                {
                    id:'hg_6', combatRelated:false, showResult:false,
                    context:L(
                        '你在黄枫谷的日子逐渐稳定下来。但你注意到黄枫谷的气氛越来越紧张——长老们频繁开会，巡逻队加强了戒备。你听到一些风声：越国修仙界即将发生大事。一天，你被召去参加全谷大会。谷主亲自宣布：百年一度的血色试炼即将开启，黄枫谷将选拔炼气期弟子参加。',
                        'Your days in Yellow Maple Valley gradually stabilize. But you notice the atmosphere growing tense — elders hold frequent meetings, patrol security tightens. You catch whispers: something big is coming to the Yue Kingdom\'s cultivation world. One day, you\'re summoned to a valley-wide assembly. The Valley Master announces: The centennial Bloody Trial is about to begin, and Yellow Maple Valley will select Qi Refining disciples to participate.',
                        '黄楓谷での日々が徐々に安定する。しかし空気が緊張していることに気づく——長老が頻繁に会議を開き、巡邏の警戒が強化されている。噂を聞く：越国修仙界に大きな事件が起きる。ある日、全谷大会に召集される。谷主が発表する：百年一度の血色試練が間もなく開始され、黄楓谷から練気期弟子を選抜して参加させる。'
                    ),
                    choices:[
                        {label:L('主动报名参加试炼','Volunteer to participate in the trial','自ら志願して試練に参加する'), next:'END'},
                        {label:L('等被选中再说，先做好准备','Wait to be selected, prepare first','選ばれるまで待ち、まず準備する'), next:'END'},
                        {label:L('想办法避开试炼，太危险了','Try to avoid the trial, too dangerous','試練を回避する方法を探す、危険すぎる'), next:'END'},
                        {label:L('趁乱离开黄枫谷','Seize the chaos to leave Yellow Maple Valley','混乱に乗じて黄楓谷を去る'), next:'END'}
                    ]
                }
            ],
            arcConclusion: {
                originalPath:L(
                    '韩立凭借炼丹天赋成功进入黄枫谷，在丹房踏实做事获得了炼制筑基丹的机会，暗中为自己备下筑基丹。这些准备为他日后突破筑基期奠定了基础。然而，黄枫谷的平静不会持续太久——越国修仙界即将发生一件大事。',
                    'Han Li entered Yellow Maple Valley through his alchemy talent, worked diligently in the pill refinery, earned the chance to refine Foundation Establishment Pills, and secretly kept some for himself. These preparations laid the foundation for his future breakthrough. However, the peace of Yellow Maple Valley won\'t last — a major event is about to shake the Yue Kingdom\'s cultivation world.',
                    '韓立は丹薬の才能で黄楓谷に入門し、丹房で着実に働いて筑基丹調合の機会を得て、密かに自分の分を確保した。これらの準備は後の筑基期突破の基礎となる。しかし黄楓谷の平穏は長く続かない——越国修仙界に大きな事件が迫っている。'
                ),
                keyOutcomes:L(
                    ['进入黄枫谷','获得筑基丹','修为达到炼气期五层'],
                    ['Entered Yellow Maple Valley','Obtained Foundation Establishment Pill','Reached Qi Refining Layer 5'],
                    ['黄楓谷に入門','筑基丹を入手','練気期五層に到達']
                )
            },
            nextArc: {
                title:L('血色试炼篇','The Bloody Trial','血色試練篇'),
                bgHint:L(
                    '越国七大门派百年一度的秘境试炼即将开启。试炼之地充满了上古遗迹、珍稀灵药和无尽危险，各派炼气期弟子皆可参加。试炼中最危险的不是秘境本身的凶机，而是其他门派的试炼者——杀人与夺宝，在这片土地上再正常不过。',
                    'The centennial secret realm trial of the Yue Kingdom\'s seven major sects is about to begin. The trial grounds are filled with ancient ruins, rare herbs, and endless dangers. All Qi Refining disciples may participate. The greatest danger isn\'t the realm itself, but the trial participants from other sects — killing and looting are commonplace here.',
                    '越国七大门派百年一度の秘境試練が間もなく開幕する。試練の地には上古の遺跡、希少な霊薬、無限の危険が満ちている。各派の練気期弟子が参加可能。最大の危険は秘境そのものではなく、他派の試練参加者だ——殺人と奪宝はこの地では日常茶飯事である。'
                )
            }
        },

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //  弧 3：血色试炼篇（扩展分支版）
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
            arcId: 'blood-trial',
            title: '血色试炼 · 秘境求生',
            background: '越国七大门派联合举办的百年秘境试炼即将开始。试炼之地是一片上古战场，蕴含无数机缘和危险。各派炼气期弟子皆可报名，但生存率不到三成。韩立因为炼丹天赋被宗门举荐参加，既是机遇也是考验。',
            startDpId: 'bt_1',
            keyItems: [
                {name:'金色书页',from:'秘境遗迹',effect:'记载上古功法的残页',type:'scroll'},
                {name:'筑基丹材料',from:'秘境灵药采集',effect:'炼制更多筑基丹的关键材料',type:'herb'},
                {name:'疗伤丹',from:'秘境宝箱',effect:'快速恢复伤势',type:'pill'},
                {name:'低阶法器',from:'秘境遗迹',effect:'基础攻击法器',type:'weapon'}
            ],
            decisionPoints: [
                {
                    id:'bt_1', combatRelated:false, showResult:false,
                    context:L(
                        '你随着黄枫谷的队伍进入秘境。传送阵的灵光散去后，你发现自己独自出现在一片荒凉的废墟中。远处传来厮杀声和灵兽的咆哮。按照规则，试炼持续七日，你需要收集足够的灵药和宝物证明自己的价值。但最重要的是——活着出去。',
                        'You enter the secret realm with the Yellow Maple Valley team. After the teleportation light fades, you find yourself alone in a desolate ruin. Shouts of battle and beast roars echo from afar. The trial lasts seven days — you must collect enough herbs and treasures to prove your worth. But most importantly — survive.',
                        '黄楓谷の隊列と共に秘境に入る。転送陣の光が消えた後、荒廃した廃墟に一人で立っていることに気づく。遠くから殺戮の叫び声と霊獣の咆哮が聞こえる。試練は七日間、価値を証明するために十分な霊薬と宝物を集めなければならない。しかし何より大切なのは——生きて帰ることだ。'
                    ),
                    choices:[
                        {label:L('先找到安全的隐蔽处观察形势','Find a safe hiding spot first','まず安全な隠れ場所を見つけて形勢を観察する'), next:'bt_1a'},
                        {label:L('主动探索废墟，寻找资源','Actively explore ruins for resources','積極的に廃墟を探索し資源を探す'), next:'bt_1b'},
                        {label:L('寻找其他黄枫谷弟子结盟','Find other Yellow Maple Valley disciples','他の黄楓谷の弟子を探して同盟を結ぶ'), next:'bt_1c'},
                        {label:L('直接往秘境深处前进','Head deep into the realm','真っ直ぐ秘境の奥へ進む'), next:'bt_1d'}
                    ]
                },
                {
                    id:'bt_1a', combatRelated:false, showResult:true,
                    context:L(
                        '你花了小半个时辰在废墟中找了一个隐蔽角落藏身。从藏身处你观察到三队不同门派的弟子先后经过——有两个小队在你眼前厮杀了起来。等他们两败俱伤后才悄然离开。你搜刮了他们的储物袋，获得了灵石、低阶法器和疗伤丹。',
                        'You spend nearly an hour finding a hidden corner. From there you observe three teams passing by — two fight each other. You leave after both sides exhaust themselves. You loot their storage pouches, obtaining spirit stones, a low-grade magic tool, and healing pills.',
                        '一時間近くかけて隠れ場所を見つける。そこから三隊が通り過ぎ、二つが殺し合いを始める。両者が消耗した後、略奪する。霊石、低級法器、療傷丹を手に入れる。'
                    ),
                    choices:[
                        {label:L('继续隐藏观察','Continue hiding and observing','隠れて観察を続ける'), next:'bt_2'},
                        {label:L('趁乱离开，寻找更多资源','Leave during chaos for more resources','混乱に乗じて更多の資源を探す'), next:'bt_2'}
                    ]
                },
                {
                    id:'bt_1b', combatRelated:true, showResult:true,
                    combat:{enemy:'秘境妖兽', enemyHp:70, playerHp:50, playerMp:25,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:10, log:'你施展罗烟步躲开攻击。'},
                            {label:'基础拳法反击', damage:14, mpCost:5, log:'你用基础拳法反击！'},
                            {label:'扔出暗器', damage:20, mpCost:8, log:'你甩出暗器直取妖兽要害！'},
                            {label:'逃跑', flee:true, log:'你转身就跑！'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被秘境妖兽重伤了……'}}},
                    context:L(
                        '你主动探索废墟。在一个坍塌的建筑下，你发现了一个宝箱——但旁边有一只受伤的妖兽在守护。它虽然受伤但依然凶猛。你必须击败它才能获得宝箱中的东西。',
                        'You actively explore. Under a collapsed building, you find a treasure chest guarded by an injured but fierce beast. You must defeat it to claim the contents.',
                        '積極的に廃墟を探索する。崩れた建物の下に宝箱を発見——しかし怪我をした妖獣が守っている。宝箱の中身を手に入れるには倒す必要がある。'
                    ),
                    choices:[
                        {label:L('全力战斗','Fight with all your might','全力で戦う'), next:'bt_2'},
                        {label:L('智取，利用地形','Use tactics and terrain','戦術と地形を活用する'), next:'bt_2'}
                    ]
                },
                {
                    id:'bt_1c', combatRelated:false, showResult:true,
                    context:L(
                        '你在废墟中找到了两个黄枫谷弟子。他们也在寻找同伴。你们三人组成临时小队，决定互相照应。其中一个叫王林的弟子擅长剑法，另一个叫张梅的女弟子精通符箓。你们分工合作，互相照应。',
                        'You find two Yellow Maple Valley disciples also seeking companions. You form a temporary squad. Wang Lin excels in sword arts, Zhang Mei in talismans. You divide roles and watch each other\'s backs.',
                        '黄楓谷の弟子二人を見つける。三人で臨時の小隊を結成する。王林は剣術、張梅は符箓が得意。役割分担して互いに守り合う。'
                    ),
                    choices:[
                        {label:L('一起探索秘境深处','Explore the realm depths together','一緒に秘境の奥を探索する'), next:'bt_2'},
                        {label:L('分开行动寻找机缘','Split up to find opportunities','分かれて各自で機会を探す'), next:'bt_1e'}
                    ]
                },
                {
                    id:'bt_1d', combatRelated:true, showResult:true,
                    combat:{enemy:'天罗国弟子', enemyHp:80, playerHp:55, playerMp:30,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:10, log:'你施展罗烟步躲开攻击。'},
                            {label:'基础拳法反击', damage:14, mpCost:5, log:'你用基础拳法反击！'},
                            {label:'扔出暗器', damage:20, mpCost:8, log:'你甩出暗器！'},
                            {label:'认输', flee:true, log:'你举起手：我认输。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被天罗国弟子重伤了……'}}},
                    context:L(
                        '你直接往秘境深处前进。在一个岔路口，你遇到了一个天罗国的弟子——他看到你黄枫谷的服饰，立刻拔剑出手。天罗国和越国是宿敌，试炼中相遇就是你死我活。',
                        'You head deep into the realm. At a junction, you encounter a Tianluo Kingdom disciple who immediately draws his sword upon seeing your attire. Tianluo and Yue Kingdoms are ancient enemies — encountering each other means death.',
                        '秘境の奥へ進む。分岐点で天羅国の弟子に遭遇——黄楓谷の服を見て剣を抜く。宿敵同士だ。'
                    ),
                    choices:[
                        {label:L('全力以赴战斗','Fight with everything','全力で戦う'), next:'bt_2'},
                        {label:L('智取后逃跑','Use tricks then flee','手を使ってから逃げる'), next:'bt_2'}
                    ]
                },
                {
                    id:'bt_1e', combatRelated:false, showResult:true,
                    context:L(
                        '你和王林、张梅分开行动。独自一人在秘境中行走更加危险，但也更灵活。你在一处隐蔽的山洞中发现了一株百年灵芝——这是炼制筑基丹的关键材料！但你也注意到洞口有人影晃动。',
                        'You split from the group. Alone is more dangerous but flexible. In a hidden cave, you discover a century-old Spirit Mushroom — key material for Foundation Pills! But you notice a figure near the entrance.',
                        '別行動。一人は危険だが柔軟性がある。隠された洞窟で百年窟で百年霊芝を発見——筑基丹の鍵となる素材だ！しかし入口に人影が揺れている。'
                    ),
                    choices:[
                        {label:L('先采灵芝再应对来人','Pick the mushroom first','まず霊芝を採取する'), next:'bt_2'},
                        {label:L('躲起来观察来人','Hide and observe','隠れて観察する'), next:'bt_2'}
                    ]
                },
                {
                    id:'bt_2', combatRelated:false, showResult:false,
                    context:L(
                        '你在一处上古废墟中发现了半页金色书页，上面记载着一段残缺的功法要诀。虽然不完整，但你能感觉到这段功法蕴含着远超你现有认知的奥秘。就在这时，远处传来脚步声——有人正在靠近。',
                        'You discover half a page of golden parchment in an ancient ruin, inscribed with an incomplete cultivation mantra. Though fragmentary, you sense mysteries far beyond your understanding. Then you hear footsteps approaching.',
                        '上古の廃墟で金色の書頁の半分を発見する。不完全だが、現在の理解をはるかに超える奥義を感じ取れる。その時、足音が近づいてくる。'
                    ),
                    choices:[
                        {label:L('收好书页迅速离开','Stash the page and leave quickly','書頁をしまって立ち去る'), next:'bt_3'},
                        {label:L('伏击靠近的人','Ambush the approaching person','近づく者を奇襲する'), next:'bt_2a'},
                        {label:L('主动打招呼，提出合作','Greet them and propose cooperation','挨拶し協力を提案する'), next:'bt_2b'}
                    ]
                },
                {
                    id:'bt_2a', combatRelated:true, showResult:true,
                    combat:{enemy:'落单弟子', enemyHp:50, playerHp:50, playerMp:25,
                        actions:[
                            {label:'偷袭', damage:25, mpCost:5, log:'你从暗处冲出，全力一击！'},
                            {label:'罗烟步近身', dodge:true, mpCost:10, log:'你施展罗烟步逼近。'},
                            {label:'扔出暗器', damage:18, mpCost:5, log:'你甩出暗器！'},
                            {label:'放弃', flee:true, log:'你决定不冒这个险。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被对方反杀了……'}}},
                    context:L(
                        '你躲在暗处，等那个人走近。他看起来是一个落单的弟子。你猛然冲出——但对方反应极快，拔剑迎击！',
                        'You hide and wait. A lone disciple approaches. You charge — but he reacts instantly and draws his sword!',
                        '暗がりに隠れて待つ。一人の弟子。猛然突撃——しかし相手は素早く剣を抜く！'
                    ),
                    choices:[
                        {label:L('全力战斗','Fight with everything','全力で戦う'), next:'bt_3'},
                        {label:L('趁机逃跑','Seize the chance to flee','その隙に逃げる'), next:'bt_3'}
                    ]
                },
                {
                    id:'bt_2b', combatRelated:false, showResult:true,
                    context:L(
                        '来人是一个女弟子，也是黄枫谷的。她看到你手中的金色书页，眼中闪过一丝贪婪，但很快掩饰住了。她说：我叫李婉儿，我们可以合作——我知道哪里有更多宝物。你同意了，但暗中保持警惕。',
                        'A female disciple appears, also from Yellow Maple Valley. She glimpses the golden page, greed flickering in her eyes. She says: I\'m Li Waner. We can cooperate — I know where more treasures are. You agree but stay vigilant.',
                        '女弟子が現れる。同じ黄楓谷。金色の書頁を見て欲が走るが隠す。私は李婉儿。協力しましょう——もっと宝物がある場所を知っているわ。同意するが警戒する。'
                    ),
                    choices:[
                        {label:L('和她一起去寻找宝物','Go with her to find treasures','彼女と一緒に宝物を探す'), next:'bt_3'},
                        {label:L('暗中提防，找机会甩掉她','Stay alert, find chance to ditch her','警戒し甩掉する機会を探す'), next:'bt_3'}
                    ]
                },
                {
                    id:'bt_3', combatRelated:false, showResult:false,
                    context:L(
                        '试炼已经过去了三天。你收集了一些灵药和低阶法器，但还远远不够。你注意到秘境中有一个规律——每隔一段时间，某个区域会出现灵气波动，那里往往有珍贵的灵药或宝物出现。你决定前往下一个灵气波动点。',
                        'Three days have passed. You\'ve collected some herbs and tools but it\'s far from enough. You notice a pattern — spirit energy fluctuations periodically appear, heralding rare herbs or treasures. You head to the next fluctuation point.',
                        '三日が経過した。霊薬と法器を少し集めたが足りない。規則性に気づく——一定間隔で霊力の波動が起き、希少な宝物が出現する。次の波動ポイントに向かう。'
                    ),
                    choices:[
                        {label:L('谨慎前往，提前观察','Go cautiously, observe from afar','慎重に行き遠くから観察する'), next:'bt_4'},
                        {label:L('全速前进抢先到达','Rush there at full speed','全力で急いで先に到着する'), next:'bt_4a'},
                        {label:L('设下陷阱等别人来','Set traps and wait','罠を仕掛けて待つ'), next:'bt_4b'}
                    ]
                },
                {
                    id:'bt_4', combatRelated:false, showResult:true,
                    context:L(
                        '你谨慎地来到灵气波动点。果然，一株散发着金色光芒的灵药出现在一块巨石上。你观察了一会儿，确认没有危险后才上前采摘。这是一株千年灵芝——炼制筑基丹的极品材料！',
                        'You cautiously reach the fluctuation point. A golden-glowing herb appears on a boulder. You observe, confirm no danger, then approach. A thousand-year Spirit Mushroom — top-grade Foundation Pill material!',
                        '慎重に波動ポイントに到着。金色の光を放つ霊薬が大岩の上に。観察し危険がないことを確認して採取。千年霊芝——筑基丹の最高級素材だ！'
                    ),
                    choices:[
                        {label:L('继续搜索更多资源','Continue searching for more','さらに探索を続ける'), next:'bt_5'},
                        {label:L('找安全地方炼丹','Find safe spot to refine pills','安全な場所で丹薬を調合する'), next:'bt_5'}
                    ]
                },
                {
                    id:'bt_4a', combatRelated:true, showResult:true,
                    combat:{enemy:'天罗国弟子', enemyHp:70, playerHp:50, playerMp:25,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:10, log:'你施展罗烟步躲开攻击。'},
                            {label:'基础拳法反击', damage:14, mpCost:5, log:'你用基础拳法反击！'},
                            {label:'扔出暗器', damage:20, mpCost:8, log:'你甩出暗器！'},
                            {label:'认输', flee:true, log:'你举起手：我认输。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你被天罗国弟子重伤了……'}}},
                    context:L(
                        '你全速赶到灵气波动点。但有人比你先到——一个天罗国弟子正在采集灵药。他看到你，立刻拔剑：这是我的！',
                        'You rush to the point. But a Tianluo disciple arrived first, collecting the herb. He draws his sword: This is mine!',
                        '全力で駆けつける。しかし天羅国の弟子が先に到着し霊薬を採取している。剣を抜く：俺のものだ！'
                    ),
                    choices:[
                        {label:L('和他战斗争夺灵药','Fight him for the herb','霊薬をめぐって戦う'), next:'bt_5'},
                        {label:L('谈判一人一半','Negotiate, split half','交渉し半分ずつ'), next:'bt_5'}
                    ]
                },
                {
                    id:'bt_4b', combatRelated:false, showResult:true,
                    context:L(
                        '你在灵气波动点周围设下陷阱。你用灵液浸泡过的绳索布置了绊网，又在关键位置撒了迷药。不久后，一个来自万剑门的弟子踏入了你的陷阱——他被绊倒后吸入迷药，晕了过去。你轻松搜刮了他的储物袋。',
                        'You set traps using spirit-liquid ropes and sleeping powder. A Myriad Sword Sect disciple stumbles in, trips, inhales the powder, and passes out. You easily loot his storage pouch.',
                        '霊液で浸した縄で罠を仕掛け、迷薬を撒く。万剣門の弟子が罠にかかり、絆まって迷薬を吸入し気絶する。簡単に儲物袋を略奪する。'
                    ),
                    choices:[
                        {label:L('继续在附近搜索','Continue searching nearby','近くで更に探索する'), next:'bt_5'},
                        {label:L('前往下一个波动点','Head to the next fluctuation point','次の波動ポイントへ向かう'), next:'bt_5'}
                    ]
                },
                {
                    id:'bt_5', combatRelated:false, showResult:false,
                    context:L(
                        '试炼第五天。你在秘境深处发现了一座上古遗迹，入口处刻着奇怪的符文。你感觉到遗迹内部有强大的灵力波动——里面一定有珍贵的宝物。但入口处已经有其他门派的弟子在争夺。你决定如何行动？',
                        'Day five. You discover ancient ruins deep in the realm, strange runes carved at the entrance. You sense powerful spirit energy within — precious treasures inside. But other sect disciples are already fighting for entry. What do you do?',
                        '五日目。秘境の奥で上古の遺跡を発見し、入口に不思議な符文が刻まれている。内部に強力な霊力の波動を感じる——貴重な宝物があるはずだ。しかし他の門派の弟子たちが入り口を争っている。どうする？'
                    ),
                    choices:[
                        {label:L('趁乱偷偷溜进去','Sneak in during the chaos','混乱に乗じてこっそり入る'), next:'bt_6'},
                        {label:L('加入争夺，正面突破','Join the fight, break through','正面から突破する'), next:'bt_5a'},
                        {label:L('在外围等待，等两败俱伤','Wait outside for both sides to exhaust','外周で待機し両者が消耗するのを待つ'), next:'bt_5b'}
                    ]
                },
                {
                    id:'bt_5a', combatRelated:true, showResult:true,
                    combat:{enemy:'争夺遗迹的弟子们', enemyHp:100, playerHp:60, playerMp:30,
                        actions:[
                            {label:'罗烟步闪避', dodge:true, mpCost:10, log:'你施展罗烟步在混战中穿梭。'},
                            {label:'基础拳法反击', damage:14, mpCost:5, log:'你用基础拳法击退靠近的敌人！'},
                            {label:'扔出暗器', damage:20, mpCost:8, log:'你甩出暗器干扰对手！'},
                            {label:'逃跑', flee:true, log:'你决定撤退。'}
                        ],
                        outcomes:{'enemy_hp_0':{type:'victory'},'player_hp_0':{type:'death',reason:'你在混战中被重伤了……'}}},
                    context:L(
                        '你冲入混战。几个门派的弟子正在遗迹入口厮杀。你虽然实力不算最强，但罗烟步让你在混战中如鱼得水。你一边战斗一边向遗迹入口推进。',
                        'You charge into the melee. Several sect disciples fight at the entrance. Though not the strongest, your footwork lets you weave through. You fight while pushing toward the entrance.',
                        '混戦に突入する。数門派の弟子が入り口で殺し合い。最強ではないが羅烟步で容易く戦いながら入り口へ押し進める。'
                    ),
                    choices:[
                        {label:L('冲进遗迹内部','Rush into the ruins','遺跡内部へ突入する'), next:'bt_6'},
                        {label:L('搜刮倒下之人的储物袋','Loot the fallen','倒れた者の儲物袋を略奪する'), next:'bt_6'}
                    ]
                },
                {
                    id:'bt_5b', combatRelated:false, showResult:true,
                    context:L(
                        '你在外围等待。果然，争夺的弟子们打得两败俱伤。等他们纷纷撤退疗伤后，你悄悄进入遗迹。遗迹内部布满了灰尘和蛛网，但你发现了一个完整的储物箱——里面有一枚筑基丹和数枚灵石！',
                        'You wait outside. Indeed, the fighters exhaust each other. After they retreat to heal, you sneak in. Dust and cobwebs fill the interior, but you find an intact storage box — a Foundation Pill and several spirit stones inside!',
                        '外周で待機する。果然、争った弟子たちは両者とも消耗し撤退する。その後、こっそり遺跡に入る。埃とクモの巣に満ちているが、完全な収納箱を発見——中には筑基丹と霊石が！'
                    ),
                    choices:[
                        {label:L('收好宝物迅速离开','Take the treasures and leave quickly','宝物を持って素早く立ち去る'), next:'bt_6'},
                        {label:L('继续探索遗迹深处','Continue exploring deeper','さらに奥を探索する'), next:'bt_6'}
                    ]
                },
                {
                    id:'bt_6', combatRelated:false, showResult:false,
                    context:L(
                        '试炼第六天。你已经在秘境中收集了不少资源——灵药、法器、灵石。但你也注意到自己的灵力消耗了不少。明天试炼就结束了，你决定最后一天怎么过？',
                        'Day six. You\'ve collected many resources — herbs, tools, spirit stones. But your spirit energy is depleted. The trial ends tomorrow. How will you spend the last day?',
                        '六日目。多くの資源を収集した——霊薬、法器、霊石。しかし霊力も消耗している。明日試練が終了する。最後の日はどう過ごす？'
                    ),
                    choices:[
                        {label:L('找个安全地方休息，保存体力','Find a safe place to rest and conserve energy','安全な場所で休憩し体力を保存する'), next:'END'},
                        {label:L('再去搜刮一轮，尽量多收集','Scavenge one more round for more resources','もう一度略奪して更多の資源を集める'), next:'END'},
                        {label:L('寻找传送阵位置，提前准备撤离','Find the teleportation array, prepare to leave early','転送陣の場所を見つけ早期撤退を準備する'), next:'END'},
                        {label:L('尝试突破修为，利用灵药修炼','Try to breakthrough using gathered herbs','集めた霊薬で修為の突破を試みる'), next:'END'}
                    ]
                }
            ],
            arcConclusion: {
                originalPath:L(
                    '血色试炼结束。韩立活着走出了秘境，带回了足够的灵药和金色书页。他的谨慎让他从残酷的试炼中存活下来，而收获的宝物和炼丹材料让他离筑基期更近了一步。',
                    'The Bloody Trial ends. Han Li walks out of the secret realm alive, having brought back sufficient herbs and the golden page. His caution kept him alive, and the treasures bring him closer to Foundation Establishment.',
                    '血色試練が終了する。韓立は生きて秘境から出て、十分な霊薬と金色の書頁を持ち帰った。慎重さが生還させ、宝物は筑基期への一歩を縮めた。'
                ),
                keyOutcomes:L(
                    ['活着走出试炼','获得金色书页','收集筑基丹材料'],
                    ['Survived the trial','Obtained golden page','Collected Foundation Pill materials'],
                    ['試練から生還','金色の書頁を入手','筑基丹材料を収集']
                )
            },
            nextArc: {
                title:L('筑基与越国风云篇','Foundation Establishment Arc','筑基と越国風雲篇'),
                bgHint:L(
                    '试炼之后，你积累的资源足以尝试筑基。筑基是修仙路上的第一道大坎——筑基成功即为真正的修士，失败则可能永远停留在炼气期。与此同时，越国修仙界的暗流涌动正在演变为一场风暴。',
                    'After the trial, you\'ve accumulated enough resources to attempt Foundation Establishment — the first major hurdle on the cultivation path. Success makes you a true cultivator; failure may trap you in Qi Refining forever. Meanwhile, undercurrents are brewing into a storm.',
                    '試練の後、蓄えた資源で筑基に挑戦できる。筑基は修仙の大関門——成功すれば真の修士となり、失敗すれば永遠に練気期に。一方で越国修仙界の暗流は嵐へと発展しつつある。'
                )
            }
        }
    ];

    // ══════════════════════════════════════════════
    //  兼容旧格式：segments（保留给传统模式）
    // ══════════════════════════════════════════════
    var segments = [
        {type:"event",date:L("天南大陆，镜州，七玄门","Tiannan Continent, Jingzhou, Seven Mysteries Sect","天南大陸、鏡州、七玄門"),
            text:L("你在一阵刺耳的钟声中醒来。周围是简陋的木床和粗糙的墙壁，空气中弥漫着淡淡的草药味。窗外，几道剑光划过天际——有人御剑飞行。你的脑海中涌入大量不属于你的记忆：你是七玄门新入门的外门弟子韩立，来自一个贫苦的山村。","You wake to the sound of harsh bells. Rough wooden beds and crude walls surround you. Outside, sword-lights cut across the sky. Memories flood your mind: you are Han Li, a newly enrolled outer disciple of the Seven Mysteries Sect.","耳障りな鐘の音で目が覚める。周りには粗末な木製の寝台と荒い壁。窓の外では剣光が空を横切る。記憶が頭に流れ込む：あなたは七玄門の新入外門弟子、韓立。")
        },
        {type:"event",text:L("你努力消化着脑海中的记忆。韩立——《凡人修仙传》的主角，一个资质平庸却最终成就大乘期的传奇修士。而现在，你就是他。你知道原剧情的走向，但此刻的你，拥有超越这个世界的知识。每一个选择都将影响你的命运。","You process these memories. Han Li — the protagonist of 'A Record of a Mortal's Journey to Immortality', who ultimately reached the legendary Mahayana stage. And now, you ARE him. Every choice will shape your destiny.","必死に記憶を整理する。韓立——『凡人修仙伝』の主人公、最終的に大乗期に達した伝説の修士。そして今、あなたが彼だ。すべての選択が運命を左右する。")
        },
        {type:"action",text:L("天色刚亮，同屋的其他弟子还在沉睡。窗外传来练功的呼喝声。你从木床上坐起，感受着这个修仙世界真实的空气。今天有很多事要做——灵根测试在即，而你知道自己的结果。问题是，你打算怎么面对这一天？","Dawn breaks. Fellow disciples still sleep. Shouts of training echo from outside. You sit up, breathing the real air of this cultivation world. The spirit root test is imminent, and you already know your result. How will you face this day?","夜明け。同室の弟子たちはまだ眠っている。窓の外から修行の掛け声。あなたは起き上がり、修仙世界の本物の空気を感じる。霊根検査が迫っている。この一日にどう立ち向かう？"), choices:[
            {label:L("按照记忆中的情节去练功场观察","Follow the plot: go observe at the training ground","原作通り、練功場を見に行く"),original:true,result:L("你按照记忆中的情节走向练功场。晨光中，上百名外门弟子练习拳法。远处几道剑光掠过——内门弟子在御剑飞行。","You walk to the training ground. In the morning light, hundreds of outer disciples practice. Sword-lights flash in the distance.","記憶通り練功場へ。朝日の中、何百人もの外門弟子が拳法を練習。遠くで剣光が走る。"),fateDelta:0},
            {label:L("提前去找灵泉瓶的线索","Search for clues about the spirit vial","先に霊泉瓶の手がかりを探す"),original:false,result:L("你循着记忆中的描述找到药园方向。门口一个老者正在浇灌灵药——应该是墨大夫。他的浇灌手法与普通园丁截然不同。","You follow your memories to the herb garden. An old man is watering herbs — Doctor Mo. His technique is completely different from an ordinary gardener's.","記憶の描写に従って薬園の方向へ。老人が霊薬に水をやっている——墨大夫だ。彼の手法は普通の庭師とは全く違う。"),fateDelta:10},
            {label:L("尝试提前修炼，感受灵力","Try cultivating early","先に修行を試みる"),original:false,result:L("你盘腿坐在床上尝试运转灵力。一股微弱暖流从丹田升起——你确实感受到了灵力。穿越带来的灵魂融合似乎改变了灵根。","You try to circulate spirit energy. A faint warmth rises from your dantian — you can feel it. The soul fusion seems to have altered your spirit roots.","あぐらをかいて霊力を循環させる。丹田から微かな温かさ——確かに霊力を感じる。魂の融合が霊根を変えたようだ。"),fateDelta:15},
            {label:L("去找其他穿越者或异常迹象","Look for other transmigrators","他の転生者を探す"),original:false,result:L("你小心翼翼地在营地里转了一圈。在一个偏僻角落，一个弟子正在偷偷练习一种你从未见过的功法，手上闪烁着诡异的黑光。","You cautiously wander around. In a hidden corner, a disciple secretly practices a technique you've never seen, black light flickering on his hands.","慎重に敷地内を見回る。人目につかない隅で、弟子が見たこともない功法を練習している。手に不気味な黒い光がきらめく。"),fateDelta:5}
        ]},
        {type:"event",text:L("修炼之路漫长，你的每一步选择都在改写命运。随着你的修为逐步提升，更大的挑战和机遇在前方等待。","The cultivation path is long, and every choice rewrites your destiny. As your cultivation grows, greater challenges and opportunities await.","修仙の道は長く、あらゆる選択が運命を書き換える。修为の向上とともに、より大きな挑戦と機会が待っている。")}
    ];

    // ══════════════════════════════════════════════
    //  注册数据
    // ══════════════════════════════════════════════
    var glossary = L(
        {灵根:"修仙者感应天地灵气的根本",炼气期:"修仙第一大境界，共十三层",筑基期:"可御器飞行，寿元倍增",伪灵根:"五行灵根俱全",灵液:"催化灵药生长的液体",夺魂术:"邪道禁术",筑基丹:"筑基必备丹药",升仙令:"黄枫谷入门凭证"},
        {灵根:"Spirit Root - foundation for sensing energy","炼气期":"Qi Refining - first realm","筑基期":"Foundation Establishment - flight capability",伪灵根:"False Spirit Root",灵液:"Spirit Liquid - accelerates growth","夺魂术":"Soul-Seizing Technique","筑基丹":"Foundation Pill","升仙令":"Ascension Order"},
        {灵根:"霊根",炼气期:"練気期","筑基期":"筑基期",伪灵根:"偽霊根",灵液:"霊液","夺魂术":"奪魂術","筑基丹":"筑基丹","升仙令":"昇仙令"}
    );

    var nameGlossary = L(
        {韩立:"《凡人修仙传》主角",墨大夫:"药园管事，实为邪道余孽",七玄门:"主角所在门派",黄枫谷:"越国三大门派之一"},
        {韩立:"Han Li - protagonist","墨大夫":"Doctor Mo","七玄门":"Seven Mysteries Sect","黄枫谷":"Yellow Maple Valley"},
        {韓立:"『凡人修仙伝』の主人公","墨大夫":"墨大夫","七玄門":"七玄門","黄楓谷":"黄楓谷"}
    );

    var intro = [
        {title:L("穿越凡人修仙传","A Mortal's Journey to Immortality","凡人修仙伝"),
         html:L("你是一个现代青年，一觉醒来发现自己穿越到了《凡人修仙传》的世界。你成了韩立——那个资质平庸却最终成就大乘期的传奇修士。但现在，你知道原剧情的每一次选择，每一次转折。你打算怎么走这条路？","You are a modern youth who wakes up transmigrated into 'A Record of a Mortal's Journey to Immortality'. You have become Han Li. Now, you know every choice and twist of the original plot. How will you walk this path?","あなたは現代の青年。目覚めると『凡人修仙伝』の世界に転生していた。あなたは韓立となった。今や原作のあらゆる選択と展開を知っている。この道をどう進む？")},
        {title:L("命运在你的手中","Fate in Your Hands","運命はあなたの手に"),
         html:L("每一个选择点，你都会面临四条路：一条原剧情的道路，三条改写命运的岔路。不会有任何标记告诉你哪个是原著——你必须靠自己的判断。记住——命运从来不是注定的。","At every choice, you face four paths — only one follows the original story. No labels will tell you which one it is — you must rely on your own judgment. Remember — fate was never predetermined.","あらゆる選択点で、あなたは四つの道に直面する。どれが原作かは示されない——自分の判断に頼らなければならない。覚えておけ——運命は決して定められたものではない。")},
        {title:L("人界篇开启","The Human Realm Begins","人界編開始"),
         html:L("故事从天南大陆镜州的七玄门开始。你是刚入门的外门弟子韩立，资质平庸，出身贫寒。但你知道这个世界的一切秘密——神秘的小瓶、隐藏的上古传承、修仙界的暗流涌动。现在，你的旅程正式开始。","The story begins at the Seven Mysteries Sect in Jingzhou. You are Han Li, a newly enrolled outer disciple of mediocre talent and humble origin. But you know all the secrets of this world. Your journey begins now.","物語は天南大陸鏡州の七玄門から始まる。あなたは入門したばかりの外門弟子韓立。平凡な資質、貧しい出自。しかし、この世界のすべての秘密を知っている。あなたの旅が今始まる。")}
    ];

    // ══════════════════════════════════════════════
    //  双重注册：arcs 给新引擎，segments 给旧引擎
    // ══════════════════════════════════════════════
    registerBook('xianxia.fanRenXiuXianZhuan', {
        intro: intro,
        segments: segments,
        arcs: arcs,       // ← 新增：弧数据结构
        glossary: glossary,
        nameGlossary: nameGlossary
    });

    // ══════════════════════════════════════════════
    //  导出一个全局引用，方便 arc engine 直接访问
    // ══════════════════════════════════════════════
    window._fanrenArcs = arcs;
})();
