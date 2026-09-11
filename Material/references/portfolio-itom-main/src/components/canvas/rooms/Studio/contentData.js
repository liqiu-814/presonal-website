/**
 * Studio development-console data.
 * Five console types are repeated by the infinite monitor tower.
 */
export const PLATFORM_CONFIG = {
    rag: { color: '#071A1F', accentColor: '#53F5C8', icon: 'AI', label: 'RAG Pipeline', shape: 'tv' },
    api: { color: '#101827', accentColor: '#70A7FF', icon: '{}', label: 'Spring Boot API', shape: 'monitor' },
    infra: { color: '#151322', accentColor: '#C59CFF', icon: '::', label: 'Infrastructure', shape: 'monitor' },
    python: { color: '#182015', accentColor: '#F5D565', icon: 'Py', label: 'Python Mascot', shape: 'tv' },
    social: { color: '#191919', accentColor: '#FF708C', icon: '@', label: 'Find Me', shape: 'phone' },
};

export const CONTENT_DATA = [
    {
        id: 'console-rag',
        platform: 'rag',
        title: 'RAG 检索控制台',
        screenTitle: 'RAG PIPELINE',
        screenLines: ['PARSE  >  CHUNK', 'BM25 + EMBEDDING', 'RERANK > CITE', 'STATUS: AVAILABLE'],
        status: 'AVAILABLE',
        description: '文档解析后建立章节级父片段与检索子片段；关键词 Top-4 扩展相邻上下文，可选 Embedding 75% + BM25 25% 混合排序，并接入 Reranker、相似度阈值降级、逐句引用校验与二次事实核验。',
        date: '智学伴 · 2026.08 至今',
        views: 'RAG',
        url: 'https://github.com/liqiu-814',
        device: 'tv',
    },
    {
        id: 'console-api',
        platform: 'api',
        title: 'Spring Boot API 控制台',
        screenTitle: 'SPRING BOOT 3',
        screenLines: ['JWT: VERIFIED', 'USER DATA: ISOLATED', 'CONTROLLERS: 20', 'MAPPINGS: 100+'],
        status: '200 OK',
        description: 'Java 21 + Spring Boot 3 后端，包含 Spring MVC、Spring Security、BCrypt、JWT、MyBatis-Plus、参数校验、统一异常处理和多环境配置；按 Principal 获取身份并以 user_id + kb_id 隔离数据。',
        date: 'Java Backend',
        views: '100+ APIs',
        url: 'https://github.com/liqiu-814',
        device: 'monitor',
    },
    {
        id: 'console-infra',
        platform: 'infra',
        title: '基础设施状态面板',
        screenTitle: 'INFRA STATUS',
        screenLines: ['REDIS       ONLINE', 'RABBITMQ    READY', 'MINIO / S3  READY', 'PGVECTOR    OPTIONAL'],
        status: 'HEALTHY',
        description: '开发环境可用 H2、JSON 向量、本地对象存储和数据库队列零中间件启动；通过 Profile / 环境变量切换 MySQL 或 PostgreSQL + pgvector、MinIO 和 RabbitMQ，Embedding 与 Reranker 不可用时自动降级。',
        date: 'Resilient Infrastructure',
        views: 'Fallback ready',
        url: 'https://github.com/liqiu-814',
        device: 'monitor',
    },
    {
        id: 'console-python',
        platform: 'python',
        title: 'Python 桌宠运行面板',
        screenTitle: 'MASCOT.EXE',
        screenLines: ['CET4 CACHE: READY', 'PRACTICE MODES: 7', 'GIF MASCOT: ACTIVE', 'UNIT TESTS: 14'],
        status: 'ACTIVE',
        description: 'Python / Tkinter / Pillow 桌面学习工具，支持 CET4 词库、7 种练习、学习统计、翻译服务降级、Windows System.Speech 发音与透明置顶 GIF 桌宠；JSON 采用临时文件 + 原子替换可靠持久化。',
        date: '2025.09 - 2026.09',
        views: '14 tests',
        url: 'https://github.com/liqiu-814',
        device: 'tv',
    },
    {
        id: 'console-social',
        platform: 'social',
        title: 'GitHub 与抖音入口',
        screenTitle: 'CONNECT',
        screenLines: ['GITHUB: liqiu-814', 'DOUYIN: ONLINE', 'EMAIL: 17728781058', '@163.com'],
        status: 'ONLINE',
        description: '访问 GitHub 查看代码仓库与项目迭代；访问抖音了解开发与学习记录。',
        date: 'Social Links',
        views: 'Online',
        url: 'https://github.com/liqiu-814',
        secondaryUrl: 'https://v.douyin.com/QRrLYNEOZB0/',
        device: 'phone',
    },
];

export const getContentByPlatform = (platform) => (
    platform === 'all' ? CONTENT_DATA : CONTENT_DATA.filter((item) => item.platform === platform)
);

export const getLatestContent = () => CONTENT_DATA[0];
