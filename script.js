const state = {
  identity: "",
  task: "",
  style: "",
  prompt: "",
  resultIndex: 0,
  colorIndex: 0
};

const totalScreens = 10;

const globalProgress = document.getElementById("globalProgress");
const toast = document.getElementById("toast");

const themeMap = {
  "清新治愈": "theme-fresh",
  "高级极简": "theme-minimal",
  "活力撞色": "theme-pop",
  "科技商务": "theme-tech",
  "可爱潮流": "theme-cute",
  "国潮醒目": "theme-china"
};

const colorThemes = [
  "theme-fresh",
  "theme-minimal",
  "theme-pop",
  "theme-tech",
  "theme-cute",
  "theme-china"
];

const resultPool = [
  {
    title: "自律学习计划",
    subtitle: "7天找回生活节奏",
    tag: "#学习 #效率 #成长",
    advice: "建议采用大标题、高对比信息层级和清晰视觉留白，增强社媒平台首屏点击率。"
  },
  {
    title: "咖啡新品上新",
    subtitle: "一口进入今日松弛感",
    tag: "#新品 #咖啡 #生活方式",
    advice: "建议使用柔和场景氛围、产品关键词和生活方式文案，突出新品带来的情绪价值。"
  },
  {
    title: "社团招新季",
    subtitle: "加入我们，让热爱被看见",
    tag: "#招新 #校园 #热爱",
    advice: "建议采用强节奏构图和活力色彩，突出年轻感、参与感和行动召唤。"
  },
  {
    title: "新品推荐指南",
    subtitle: "把卖点讲清楚，把选择变简单",
    tag: "#产品 #推荐 #实用",
    advice: "建议突出核心卖点、使用场景和购买理由，让用户快速理解产品价值。"
  },
  {
    title: "3分钟搞定设计",
    subtitle: "从空白画布到专业视觉表达",
    tag: "#Canva #设计 #效率",
    advice: "建议强调模板、素材、字体、配色与在线编辑能力，体现Canva可画的低门槛创作价值。"
  }
];

const titlePool = [
  "下一张爆款封面",
  "你的灵感正在加载",
  "让设计变简单一点",
  "从空白开始也能很好看",
  "今天也要好好创作",
  "创作不再卡住"
];

function goTo(num) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(`screen-${num}`);

  if (!target) return;

  target.classList.add("active");

  const percent = (num / totalScreens) * 100;
  globalProgress.style.width = `${percent}%`;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

document.querySelectorAll("[data-type]").forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    const value = card.dataset.value;

    state[type] = value;

    document.querySelectorAll(`[data-type="${type}"]`).forEach(item => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");
  });
});

function nextWithCheck(nextPage, key) {
  if (!state[key]) {
    showToast("请先选择一个选项");
    return;
  }

  goTo(nextPage);
}

function fillPrompt(text) {
  const input = document.getElementById("promptInput");
  input.value = text;
}

function startGenerate() {
  const input = document.getElementById("promptInput");
  const value = input.value.trim();

  if (!value) {
    showToast("请先输入一句创作需求");
    return;
  }

  state.prompt = value;

  goTo(7);

  const bar = document.getElementById("generateBar");
  const loadingText = document.getElementById("loadingText");

  const steps = [
    document.getElementById("g1"),
    document.getElementById("g2"),
    document.getElementById("g3"),
    document.getElementById("g4"),
    document.getElementById("g5")
  ];

  steps.forEach(step => step.classList.remove("done"));
  bar.style.width = "0%";

  const texts = [
    "正在理解你的创作需求……",
    "正在分析创作者身份与传播场景……",
    "正在匹配Canva模板结构……",
    "正在生成标题、副标题与配色建议……",
    "正在输出可编辑视觉方案……"
  ];

  let progress = 0;

  const timer = setInterval(() => {
    progress += 4;
    bar.style.width = `${progress}%`;

    if (progress >= 18) {
      steps[0].classList.add("done");
      loadingText.textContent = texts[1];
    }

    if (progress >= 38) {
      steps[1].classList.add("done");
      loadingText.textContent = texts[2];
    }

    if (progress >= 58) {
      steps[2].classList.add("done");
      loadingText.textContent = texts[3];
    }

    if (progress >= 78) {
      steps[3].classList.add("done");
      loadingText.textContent = texts[4];
    }

    if (progress >= 96) {
      steps[4].classList.add("done");
    }

    if (progress >= 100) {
      clearInterval(timer);

      setTimeout(() => {
        renderResult();
        goTo(8);
      }, 450);
    }
  }, 80);
}

function renderResult() {
  const result = resultPool[state.resultIndex % resultPool.length];

  const posterTask = document.getElementById("posterTask");
  const posterTitle = document.getElementById("posterTitle");
  const posterSubtitle = document.getElementById("posterSubtitle");
  const posterTag = document.getElementById("posterTag");
  const aiAdvice = document.getElementById("aiAdvice");

  const editorTitle = document.getElementById("editorTitle");
  const editorSubtitle = document.getElementById("editorSubtitle");
  const editorTag = document.getElementById("editorTag");

  const smartTitle = getSmartTitle(result.title);
  const smartSubtitle = getSmartSubtitle(result.subtitle);
  const smartTag = getSmartTag(result.tag);

  posterTask.textContent = state.task || "社媒封面";
  posterTitle.textContent = smartTitle;
  posterSubtitle.textContent = smartSubtitle;
  posterTag.textContent = smartTag;
  aiAdvice.textContent = getAdvice(result.advice);

  editorTitle.textContent = smartTitle;
  editorSubtitle.textContent = smartSubtitle;
  editorTag.textContent = smartTag;

  applyTheme();
}

function applyTheme() {
  const afterPanel = document.getElementById("afterPanel");
  const editorPoster = document.getElementById("editorPoster");

  colorThemes.forEach(theme => {
    afterPanel.classList.remove(theme);
    editorPoster.classList.remove(theme);
  });

  let theme = colorThemes[state.colorIndex % colorThemes.length];

  if (state.style && themeMap[state.style] && state.colorIndex === 0) {
    theme = themeMap[state.style];
  }

  afterPanel.classList.add(theme);
  editorPoster.classList.add(theme);
}

function getSmartTitle(defaultTitle) {
  const text = state.prompt;

  if (text.includes("咖啡")) return "咖啡新品上新";
  if (text.includes("学习")) return "自律学习计划";
  if (text.includes("招新")) return "社团招新季";
  if (text.includes("招聘")) return "寻找发光的你";
  if (text.includes("产品")) return "新品推荐指南";
  if (text.includes("活动")) return "活动预告来了";
  if (text.includes("PPT") || text.includes("汇报")) return "汇报封面提案";
  if (text.includes("小红书")) return "小红书爆款封面";

  return defaultTitle;
}

function getSmartSubtitle(defaultSubtitle) {
  const text = state.prompt;

  if (text.includes("咖啡")) return "一口进入今日松弛感";
  if (text.includes("学习")) return "7天找回生活节奏";
  if (text.includes("招新")) return "加入我们，让热爱被看见";
  if (text.includes("招聘")) return "和优秀的人一起做有趣的事";
  if (text.includes("产品")) return "把卖点讲清楚，把选择变简单";
  if (text.includes("活动")) return "让每一次参与都值得期待";
  if (text.includes("PPT") || text.includes("汇报")) return "让表达更清晰，让观点更有力量";

  return defaultSubtitle;
}

function getSmartTag(defaultTag) {
  const text = state.prompt;

  if (text.includes("咖啡")) return "#新品 #咖啡 #松弛感";
  if (text.includes("学习")) return "#学习 #效率 #成长";
  if (text.includes("招新")) return "#社团 #招新 #校园";
  if (text.includes("招聘")) return "#招聘 #团队 #机会";
  if (text.includes("产品")) return "#产品 #卖点 #推荐";
  if (text.includes("活动")) return "#活动 #报名 #参与";
  if (text.includes("PPT") || text.includes("汇报")) return "#PPT #汇报 #表达";

  return defaultTag;
}

function getAdvice(defaultAdvice) {
  const identity = state.identity ? `针对${state.identity}的真实创作场景，` : "";
  const task = state.task ? `系统将${state.task}作为主要传播载体，` : "";
  const style = state.style ? `采用${state.style}的视觉语言，` : "";

  return `${identity}${task}${style}${defaultAdvice}`;
}

function changeResult() {
  state.resultIndex += 1;
  renderResult();
  showToast("已切换一版模板");
}

function changeColor() {
  state.colorIndex += 1;
  applyTheme();
  showToast("配色已调整");
}

function optimizeTitle() {
  const index = Math.floor(Math.random() * titlePool.length);
  const title = titlePool[index];

  document.getElementById("posterTitle").textContent = title;
  document.getElementById("editorTitle").textContent = title;

  showToast("标题已优化");
}

function showFinal() {
  document.getElementById("finalIdentity").textContent = state.identity || "个人博主";
  document.getElementById("finalTask").textContent = state.task || "小红书封面";
  document.getElementById("finalStyle").textContent = state.style || "清新治愈";
  document.getElementById("finalKeywords").textContent = getKeywords();

  goTo(10);
}

function getKeywords() {
  const map = {
    "清新治愈": "清新 / 柔和 / 留白 / 治愈",
    "高级极简": "极简 / 质感 / 留白 / 专业",
    "活力撞色": "醒目 / 年轻 / 高对比 / 传播感",
    "科技商务": "效率 / 秩序 / 科技 / 专业",
    "可爱潮流": "趣味 / 亲和 / 潮流 / IP感",
    "国潮醒目": "文化 / 节奏 / 识别度 / 国潮"
  };

  return map[state.style] || "高效 / 清晰 / 吸睛 / 轻松";
}

function openCanva() {
  window.open("https://www.canva.cn/", "_blank");
}

function copyReport() {
  const report = `
《灵感急救站：3分钟生成你的社媒封面》答辩说明

本作品选择AIGC方向中的Canva可画H5互动广告赛道，面向社媒创作者、企业新媒体运营、中小创业者和大学生内容创作者等目标人群展开设计。

作品从“临时赶稿、缺少灵感、不会设计、素材分散”的真实痛点出发，将Canva可画设定为一个“灵感急救站”。用户进入H5后，可以依次完成身份选择、创作任务选择、视觉风格选择和一句话需求输入，系统随后模拟AIGC生成过程，输出一张符合用户需求的社媒视觉方案。

作品的交互路径包括：开场代入、痛点洞察、身份选择、任务选择、风格测试、AI生成模拟、结果展示、Canva编辑器模拟和最终转化。视觉风格采用清爽、年轻、轻科技感的移动端界面语言，突出Canva可画“低门槛、高效率、强模板、可编辑、易导出”的品牌价值。

在制作过程中，本作品可使用Google AI Studio辅助生成文案和交互脚本，使用Figma AI辅助完成界面原型，使用CODEBUDDY辅助生成H5代码，并使用Canva可画完成视觉素材、展示图和最终排版。整体作品体现了AIGC工具在设计调研、创意生成、界面设计、交互实现和作品展示中的综合应用价值。

创作者身份：${state.identity || "个人博主"}
创作任务：${state.task || "小红书封面"}
推荐风格：${state.style || "清新治愈"}
创作关键词：${getKeywords()}
用户输入需求：${state.prompt || "未填写"}
  `.trim();

  if (navigator.clipboard) {
    navigator.clipboard.writeText(report).then(() => {
      showToast("答辩说明已复制");
    });
  } else {
    showToast("当前浏览器不支持自动复制");
  }
}

function restart() {
  state.identity = "";
  state.task = "";
  state.style = "";
  state.prompt = "";
  state.resultIndex = 0;
  state.colorIndex = 0;

  document.querySelectorAll(".selected").forEach(item => {
    item.classList.remove("selected");
  });

  const input = document.getElementById("promptInput");
  if (input) {
    input.value = "";
  }

  renderResult();
  goTo(1);
}

function openIntro() {
  document.getElementById("introModal").classList.add("show");
}

function closeIntro() {
  document.getElementById("introModal").classList.remove("show");
}

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeIntro();
  }
});

window.addEventListener("load", () => {
  renderResult();
});
