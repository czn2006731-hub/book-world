// 书籍轮播逻辑

let currentBookIndex = 0;
let currentBooks = [];
let currentType = '';

// 初始化书籍界面
function initBookScreen(type) {
    currentType = type;
    currentBooks = nebulaData[type].books;
    currentBookIndex = 0;
    
    // 更新标题
    const titleEl = document.getElementById('book-screen-title');
    titleEl.textContent = nebulaData[type].name;
    titleEl.className = 'book-screen-title ' + type;
    
    // 生成书籍卡片
    generateBookCards();
    
    // 初始化星空背景
    initStarsBackground('stars-canvas-book');
    
    // 更新详情
    updateBookDetail(null);
}

// 生成书籍卡片
function generateBookCards() {
    const slider = document.getElementById('book-slider');
    slider.innerHTML = '';
    
    currentBooks.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = `book-card ${currentType}`;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="book-cover">
                <span class="book-cover-title">${book.title}</span>
            </div>
            <div class="book-card-info">
                <h4 class="book-card-title">${book.title}</h4>
                <p class="book-card-author">${book.author}</p>
            </div>
        `;
        
        // 鼠标悬停事件
        card.addEventListener('mouseenter', () => {
            updateBookDetail(book);
        });
        
        // 点击事件
        card.addEventListener('click', () => {
            startBookAdventure(book);
        });
        
        slider.appendChild(card);
    });
    
    // 初始化轮播按钮
    initCarouselButtons();

    // 初始化"开始穿越"按钮
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            if (currentBooks[currentBookIndex]) {
                startBookAdventure(currentBooks[currentBookIndex]);
            }
        };
    }
}

// 更新书籍详情
function updateBookDetail(book) {
    const titleEl = document.getElementById('book-title');
    const authorEl = document.getElementById('book-author');
    const descEl = document.getElementById('book-desc');
    
    if (book) {
        titleEl.textContent = book.title;
        authorEl.textContent = `作者：${book.author}`;
        descEl.textContent = book.desc;
    } else {
        titleEl.textContent = '选择一本书开始冒险';
        authorEl.textContent = '';
        descEl.textContent = '将鼠标悬停在书籍上查看详细信息';
    }
}

// 初始化轮播按钮
function initCarouselButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.onclick = () => {
        currentBookIndex = (currentBookIndex - 1 + currentBooks.length) % currentBooks.length;
        scrollToBook(currentBookIndex);
    };
    
    nextBtn.onclick = () => {
        currentBookIndex = (currentBookIndex + 1) % currentBooks.length;
        scrollToBook(currentBookIndex);
    };
}

// 滚动到指定书籍
function scrollToBook(index) {
    const slider = document.getElementById('book-slider');
    const cards = slider.querySelectorAll('.book-card');
    
    if (cards[index]) {
        cards[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        // 更新详情
        updateBookDetail(currentBooks[index]);
    }
}

// 开始书籍冒险
function startBookAdventure(book) {
    // 构建书籍ID
    const bookId = `${currentType}.${getBookKey(book.title)}`;
    
    // 初始化游戏
    if (typeof initGame === 'function') {
        initGame(bookId, book);
    } else {
        if (typeof showGameAlert === 'function') {
            showGameAlert(`即将进入《${book.title}》的世界...\n\n这是一个占位提示，实际游戏中将进入AI叙事界面。`, '提示');
        } else {
            alert(`即将进入《${book.title}》的世界...\n\n这是一个占位提示，实际游戏中将进入AI叙事界面。`);
        }
    }
    
    // 示例：console.log 游戏数据
    console.log('开始冒险：', {
        type: currentType,
        book: book,
        bookId: bookId,
        timestamp: new Date().toISOString()
    });
}

// 根据书名获取书籍key
function getBookKey(title) {
    const bookKeyMap = {
        '三体': 'sanTi',
        '流浪地球': 'liuLangDiQiu',
        '基地': 'jiDi',
        '沙丘': 'shaQiu',
        '神经漫游者': 'shenJingManYouZhe',
        '凡人修仙传': 'fanRenXiuXianZhuan',
        '遮天': 'zheTian',
        '完美世界': 'wanMeiShiJie',
        '斗破苍穹': 'douPoCangQiong',
        '仙逆': 'xianNi',
        '微微一笑很倾城': 'weiWeiYiXiaoHenQingCheng',
        '何以笙箫默': 'heYiShengXiaoMo',
        '致我们终将逝去的青春': 'zhiQingChun',
        '你好，旧时光': 'niHaoJiuShiGuang',
        '最美的时光': 'zuiMeiDeShiGuang'
    };
    return bookKeyMap[title] || title;
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (currentScreen !== 'book') return;
    
    if (e.key === 'ArrowLeft') {
        document.getElementById('prev-btn').click();
    } else if (e.key === 'ArrowRight') {
        document.getElementById('next-btn').click();
    } else if (e.key === 'Escape') {
        document.getElementById('back-btn').click();
    }
});
