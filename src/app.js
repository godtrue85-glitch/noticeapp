const missions = [
  { id: 1, title: '오늘 숙제 적기', detail: '알림장에 과목별 숙제를 정리해요.', reward: 30, emoji: '✏️' },
  { id: 2, title: '준비물 챙기기', detail: '내일 필요한 준비물을 가방에 넣어요.', reward: 25, emoji: '🎒' },
  { id: 3, title: '부모님 확인 받기', detail: '중요 공지를 보여드리고 확인 스탬프를 받아요.', reward: 40, emoji: '🧡' },
  { id: 4, title: '칭찬 한 줄 쓰기', detail: '오늘 잘한 일을 한 문장으로 남겨요.', reward: 20, emoji: '🌟' },
];

const closet = [
  { id: 'hat', name: '별빛 모자', price: 80, icon: '🎩', className: 'hat' },
  { id: 'cape', name: '용기 망토', price: 120, icon: '🦸', className: 'cape' },
  { id: 'snack', name: '간식 가방', price: 60, icon: '🍪', className: 'snack' },
];

const state = {
  done: new Set([1]),
  coins: 95,
  level: 3,
  items: new Set(['snack']),
  notices: [
    { id: 1, subject: '국어', message: '받아쓰기 5번 연습하기', supply: '알림장 확인 사인' },
  ],
};

const elements = {
  level: document.querySelector('#levelStat'),
  coins: document.querySelector('#coinStat'),
  progress: document.querySelector('#progressStat'),
  donePill: document.querySelector('#donePill'),
  xpFill: document.querySelector('#xpFill'),
  missionList: document.querySelector('#missionList'),
  shopList: document.querySelector('#shopList'),
  avatar: document.querySelector('#avatar'),
  noticeForm: document.querySelector('#noticeForm'),
  noticeList: document.querySelector('#noticeList'),
  noticeCount: document.querySelector('#noticeCount'),
};

function progress() {
  return Math.round((state.done.size / missions.length) * 100);
}

function toggleMission(mission) {
  if (state.done.has(mission.id)) {
    state.done.delete(mission.id);
    state.coins = Math.max(0, state.coins - mission.reward);
  } else {
    state.done.add(mission.id);
    state.coins += mission.reward;
    if (state.done.size === missions.length) state.level += 1;
  }

  render();
}

function buyItem(item) {
  if (state.items.has(item.id) || state.coins < item.price) return;
  state.items.add(item.id);
  state.coins -= item.price;
  render();
}

function addNotice(formData) {
  const notice = {
    id: Date.now(),
    subject: formData.get('subject').trim(),
    message: formData.get('message').trim(),
    supply: formData.get('supply').trim(),
  };

  if (!notice.subject || !notice.message) return;
  state.notices.unshift(notice);
  state.coins += 10;
  render();
}

function renderMissions() {
  elements.missionList.replaceChildren(...missions.map((mission) => {
    const completed = state.done.has(mission.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `mission ${completed ? 'completed' : ''}`;
    button.setAttribute('aria-pressed', String(completed));
    button.innerHTML = `
      <span class="mission-emoji">${mission.emoji}</span>
      <span class="mission-text"><strong>${mission.title}</strong><small>${mission.detail}</small></span>
      <span class="reward">🪙 ${mission.reward}</span>
      <span class="check" aria-hidden="true">${completed ? '✅' : ''}</span>
    `;
    button.addEventListener('click', () => toggleMission(mission));
    return button;
  }));
}

function renderShop() {
  elements.shopList.replaceChildren(...closet.map((item) => {
    const owned = state.items.has(item.id);
    const locked = state.coins < item.price && !owned;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shop-item';
    button.disabled = owned || locked;
    button.innerHTML = `
      <span class="shop-icon">${item.icon}</span>
      <span><strong>${item.name}</strong><small>${owned ? '보유 중' : `${item.price} 코인`}</small></span>
      <span class="${owned ? 'owned' : locked ? 'locked' : 'buy'}">${owned ? '장착' : locked ? '부족' : '구매'}</span>
    `;
    button.addEventListener('click', () => buyItem(item));
    return button;
  }));
}

function renderNotices() {
  elements.noticeCount.textContent = `${state.notices.length}개 기록`;
  elements.noticeList.replaceChildren(...state.notices.map((notice) => {
    const article = document.createElement('article');
    const subject = document.createElement('strong');
    const message = document.createElement('p');
    const supply = document.createElement('small');

    article.className = 'notice-card';
    subject.textContent = notice.subject;
    message.textContent = notice.message;
    supply.textContent = notice.supply ? `준비물: ${notice.supply}` : '준비물 없음';
    article.append(subject, message, supply);
    return article;
  }));
}

function renderAvatar() {
  const face = elements.avatar.querySelector('.face');
  elements.avatar.replaceChildren(face);

  closet.forEach((item) => {
    if (!state.items.has(item.id)) return;
    const itemElement = document.createElement('span');
    itemElement.className = `item ${item.className}`;
    itemElement.textContent = item.icon;
    elements.avatar.append(itemElement);
  });
}

function render() {
  const completion = progress();
  elements.level.textContent = state.level;
  elements.coins.textContent = state.coins;
  elements.progress.textContent = `${completion}%`;
  elements.donePill.textContent = `${state.done.size}/${missions.length} 완료`;
  elements.xpFill.style.width = `${completion}%`;
  renderMissions();
  renderShop();
  renderNotices();
  renderAvatar();
}

elements.noticeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addNotice(new FormData(elements.noticeForm));
  elements.noticeForm.reset();
  elements.noticeForm.querySelector('input').focus();
});

render();
