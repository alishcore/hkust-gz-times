// Layout controls
const tocLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const toc = document.querySelector('nav');
const tocTitle = document.querySelector('nav h2');
const mainColumn = document.querySelector('main');
const introHeading = document.querySelector('#introduction h2');
const readingProgressBar = document.getElementById('reading-progress-bar');
const tocStopScreenRatio = 0.05;
const linkById = new Map(tocLinks.map((link) => [link.getAttribute('href').slice(1), link]));
const trackedHeadings = Array.from(document.querySelectorAll('main section[id] > h2, main article[id] .article-hero-title, main h3[id]'))
  .map((heading) => ({
    heading,
    id: heading.id || heading.closest('article, section').id
  }))
  .filter((item) => linkById.has(item.id));

const quizQuestions = [
  {
    question: "According to Pang (2021), what primarily shapes social media users' online behaviour?",
    options: [
      "A desire for authentic self-expression",
      "Hedonic and utilitarian values seeking external approval",
      "Fear of missing out on events",
      "Creative curiosity"
    ],
    answer: 1,
    feedback: "Pang (2021) found that mobile social media users are driven by hedonic and utilitarian values, orienting behaviour toward external reward and approval rather than genuine self-expression."
  },
  {
    question: "What does Masur (2019) argue happens to self-disclosure when communication moves online?",
    options: [
      "People share more authentically",
      "Contextual cues collapse, and content reaches an undifferentiated audience",
      "Privacy concerns naturally disappear",
      "Users develop stronger personal boundaries"
    ],
    answer: 1,
    feedback: "Masur (2019) argues that online communication collapses contextual cues, meaning content can reach the same broad audience simultaneously."
  },
  {
    question: "According to Zuboff (2016), what is the core purpose of data collection on digital platforms?",
    options: [
      "To improve user experience genuinely",
      "To predict and modify user behaviour for profit",
      "To enforce government surveillance",
      "To personalise advertising only"
    ],
    answer: 1,
    feedback: "Zuboff (2016) argues that behavioural data is collected not just to describe users, but to predict and modify future behaviour for commercial gain."
  },
  {
    question: "What does Brayne (2018) show about big-data policing systems?",
    options: [
      "They reduce surveillance to only confirmed suspects",
      "They shift policing from reaction to prediction, including people with no police contact",
      "They are fully transparent and auditable",
      "They eliminate bias in law enforcement"
    ],
    answer: 1,
    feedback: "Brayne (2018) shows that big-data policing shifts from reactive to predictive logic and expands surveillance to people with no direct police contact."
  },
  {
    question: "What is the filter bubble effect identified by Nguyen et al. (2014)?",
    options: [
      "Algorithms that block offensive content",
      "Personalised recommendations that narrow information diversity and reinforce existing beliefs",
      "A tool that helps users find new topics",
      "A social media privacy setting"
    ],
    answer: 1,
    feedback: "Nguyen et al. (2014) showed that recommender systems can limit the range of information users encounter and reinforce pre-existing beliefs."
  },
  {
    question: "What does Sundar (2020) mean by acquired cognitive passivity?",
    options: [
      "A state of relaxation from too much screen time",
      "The gradual loss of the habit and ability to think critically, caused by reliance on algorithmic filtering",
      "A new form of digital mindfulness",
      "Passive aggressive behaviour online"
    ],
    answer: 1,
    feedback: "Sundar (2020) argues that frictionless algorithmic design can reduce cognitive effort enough to weaken independent evaluation habits."
  }
];

const quizProgress = document.getElementById('quiz-progress');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizNext = document.getElementById('quiz-next');
const quizResult = document.getElementById('quiz-result');
const quizScore = document.getElementById('quiz-score');
const quizMessage = document.getElementById('quiz-message');
const quizRestart = document.getElementById('quiz-restart');
let quizIndex = 0;
let quizTotal = 0;
let quizAnswered = false;

function renderQuizQuestion() {
  const item = quizQuestions[quizIndex];
  quizAnswered = false;
  quizProgress.textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
  quizQuestion.textContent = item.question;
  quizFeedback.hidden = true;
  quizFeedback.textContent = '';
  quizNext.hidden = true;
  quizOptions.textContent = '';

  item.options.forEach((option, optionIndex) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => answerQuizQuestion(optionIndex));
    li.appendChild(button);
    quizOptions.appendChild(li);
  });
}

function answerQuizQuestion(optionIndex) {
  if (quizAnswered) return;
  quizAnswered = true;
  const item = quizQuestions[quizIndex];
  const optionButtons = quizOptions.querySelectorAll('button');

  optionButtons.forEach((button) => {
    button.disabled = true;
  });

  if (optionIndex === item.answer) {
    quizTotal++;
    quizFeedback.textContent = `Correct. ${item.feedback}`;
  } else {
    quizFeedback.textContent = `Not quite. ${item.feedback}`;
  }

  quizFeedback.hidden = false;
  quizNext.hidden = false;
}

function showQuizResult() {
  quizProgress.textContent = '';
  quizQuestion.textContent = '';
  quizOptions.textContent = '';
  quizFeedback.hidden = true;
  quizNext.hidden = true;
  quizResult.hidden = false;
  quizScore.textContent = `Score: ${quizTotal} / ${quizQuestions.length}`;
  quizMessage.textContent = quizTotal === quizQuestions.length
    ? 'You have mastered the arguments across all three articles.'
    : 'Review the articles above and try again.';
}

function restartQuiz() {
  quizIndex = 0;
  quizTotal = 0;
  quizResult.hidden = true;
  renderQuizQuestion();
}

quizNext.addEventListener('click', () => {
  quizIndex++;
  if (quizIndex < quizQuestions.length) {
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
});
quizRestart.addEventListener('click', restartQuiz);
renderQuizQuestion();

function updateViewportWidth() {
  document.documentElement.style.setProperty('--viewport-width', `${document.documentElement.clientWidth}px`);
}

function getTocStickyTop() {
  const stickyTop = Math.round(window.innerHeight * tocStopScreenRatio);
  document.documentElement.style.setProperty('--toc-sticky-top', `${stickyTop}px`);
  return stickyTop;
}

function layoutToc() {
  const root = document.documentElement;
  const edgeGap = 24;
  const articleGap = 32;
  const stickyTop = getTocStickyTop();

  document.body.classList.remove('toc-inline', 'toc-stuck');

  const articleLeft = mainColumn.getBoundingClientRect().left;
  const tocWidth = toc.getBoundingClientRect().width;
  const availableLeftSpace = articleLeft - edgeGap;

  if (availableLeftSpace < tocWidth + articleGap) {
    document.body.classList.add('toc-inline');
    return;
  }

  const centeredInLeftSpace = (articleLeft / 2) - (tocWidth / 2);
  const maxLeft = articleLeft - tocWidth - articleGap;
  const left = Math.max(edgeGap, Math.min(centeredInLeftSpace, maxLeft));

  const introCenterY = introHeading.getBoundingClientRect().top + window.scrollY + (introHeading.offsetHeight / 2);
  const top = Math.max(stickyTop, introCenterY - (tocTitle.offsetHeight / 2));

  root.style.setProperty('--toc-runtime-left', `${Math.round(left)}px`);
  root.style.setProperty('--toc-runtime-top', `${Math.round(top)}px`);
}

function updateTocStickiness() {
  if (document.body.classList.contains('toc-inline')) {
    document.body.classList.remove('toc-stuck');
    return;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const tocStartTop = parseFloat(rootStyles.getPropertyValue('--toc-runtime-top')) || 0;
  const stickyTop = getTocStickyTop();

  document.body.classList.toggle('toc-stuck', window.scrollY + stickyTop >= tocStartTop);
}

function updateReadingProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  readingProgressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}

function updateActiveTocLink() {
  const activationLine = window.innerHeight * 0.11;
  let active = trackedHeadings[0];

  for (const item of trackedHeadings) {
    if (item.heading.getBoundingClientRect().top <= activationLine) {
      active = item;
    } else {
      break;
    }
  }

  for (const link of tocLinks) {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  }

  if (active) {
    const link = linkById.get(active.id);
    link.classList.add('active');
    link.setAttribute('aria-current', 'true');
  }
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateTocStickiness();
      updateActiveTocLink();
      updateReadingProgress();
      ticking = false;
    });
    ticking = true;
  }
});
function refreshLayout() {
  updateViewportWidth();
  layoutToc();
  updateTocStickiness();
  updateActiveTocLink();
  updateReadingProgress();
}
window.addEventListener('resize', refreshLayout);
window.addEventListener('load', refreshLayout);
if (document.fonts) {
  document.fonts.ready.then(refreshLayout);
}
refreshLayout();
updateActiveTocLink();
