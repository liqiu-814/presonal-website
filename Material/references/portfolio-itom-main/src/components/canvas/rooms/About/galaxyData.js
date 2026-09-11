export const KNOWLEDGE_TOPICS = [
    { id: '01', title: 'LLM 基础', code: 'LLM CORE', cluster: 'foundation', color: '#69e6ff', size: 0.72, summary: 'Token、上下文窗口、采样参数与大模型核心概念。', questions: ['Token 是什么？', 'Temperature、Top-P、Top-K 如何调节？', 'Context Window 如何影响应用设计？'], path: '01-basic-concepts' },
    { id: '02', title: 'Prompt 工程', code: 'PROMPT', cluster: 'foundation', color: '#8c7dff', size: 0.62, summary: '从提示结构、Few-shot 到思维链与提示评测。', questions: ['什么是 Chain of Thought？', 'Few-shot Learning 如何工作？', '如何系统评估一个 Prompt？'], path: '02-prompt-engineering' },
    { id: '03', title: 'RAG 系统', code: 'RAG', cluster: 'retrieval', color: '#42f5b0', size: 0.82, summary: '知识入库、召回、重排、生成与引用校验的完整链路。', questions: ['什么是 RAG，为什么需要它？', 'RAG 的完整流程是什么？', 'Embedding 与向量数据库如何协作？'], path: '03-rag-system' },
    { id: '04', title: 'Transformer', code: 'ATTENTION', cluster: 'foundation', color: '#50a7ff', size: 0.78, summary: '注意力机制、位置编码与 Transformer 架构演进。', questions: ['Self-Attention 如何计算？', 'Encoder 和 Decoder 有什么区别？', '为什么需要 Multi-Head Attention？'], path: '04-transformer-architecture' },
    { id: '05', title: 'Agent 基础', code: 'AGENT', cluster: 'agent', color: '#ff6edb', size: 0.8, summary: '规划、工具调用、记忆与 ReAct 行动循环。', questions: ['AI Agent 的核心组件是什么？', 'ReAct 模式的完整流程是什么？', '如何防止 Agent 进入死循环？'], path: '05-ai-agent-basics' },
    { id: '06', title: '向量检索', code: 'VECTOR', cluster: 'retrieval', color: '#18d9c5', size: 0.65, summary: '向量索引、混合检索、RRF 与两阶段重排。', questions: ['向量索引类型如何选择？', 'RRF 如何融合多路召回？', '为什么需要 Rerank？'], path: '06-vector-index-optimization' },
    { id: '07', title: '模型训练', code: 'TRAINING', cluster: 'foundation', color: '#bb7cff', size: 0.72, summary: '微调、PEFT、LoRA、对齐与训练数据工程。', questions: ['全量微调与 PEFT 有何区别？', '什么时候用微调，什么时候用 RAG？', 'LoRA 的原理是什么？'], path: '07-model-training' },
    { id: '08', title: '推理优化', code: 'INFERENCE', cluster: 'infra', color: '#ffad42', size: 0.74, summary: 'Prefill、Decode、KV Cache、量化与吞吐优化。', questions: ['Prefill 和 Decode 有什么区别？', 'KV Cache 为什么有效？', '如何权衡吞吐与延迟？'], path: '08-inference-optimization' },
    { id: '09', title: '安全评测', code: 'SAFETY', cluster: 'quality', color: '#ff5d75', size: 0.66, summary: '内容安全、隐私保护、红队测试与质量评估。', questions: ['如何防止生成有害内容？', '如何保护用户 PII？', '怎样建立 AI 应用评估体系？'], path: '09-ai-safety-evaluation' },
    { id: '10', title: '生产部署', code: 'PRODUCTION', cluster: 'infra', color: '#ffd166', size: 0.78, summary: '流式输出、网关、监控、容灾与生产可靠性。', questions: ['SSE 和 WebSocket 怎么选？', '如何监控 AI 应用健康度？', '怎样设计可靠的 LLM 服务？'], path: '10-production-deployment' },
    { id: '11', title: '多模态 AI', code: 'MULTIMODAL', cluster: 'quality', color: '#ff7eb6', size: 0.68, summary: '视觉语言模型、CLIP、多模态训练与评测。', questions: ['多模态学习为什么重要？', 'CLIP 的核心思想是什么？', '如何评估多模态模型？'], path: '11-multimodal-ai' },
    { id: '12', title: '框架与工具', code: 'TOOLCHAIN', cluster: 'infra', color: '#8fd14f', size: 0.62, summary: 'LangChain、LangGraph、LlamaIndex 与工程工具链。', questions: ['LangGraph 和 LangChain 怎么选？', 'LlamaIndex 如何构建 RAG？', '框架抽象会带来什么代价？'], path: '12-frameworks-tools' },
    { id: '13', title: '多 Agent', code: 'MULTI AGENT', cluster: 'agent', color: '#ee72ff', size: 0.72, summary: '角色协作、编排、权限、策略与多智能体治理。', questions: ['AutoGen 如何组织协作？', '企业级多 Agent 架构怎么设计？', '如何设计权限与审计？'], path: '13-multi-agent-systems' },
    { id: '14', title: 'MCP / Skills', code: 'MCP', cluster: 'agent', color: '#b46cff', size: 0.7, summary: '模型上下文协议、工具系统与可复用技能。', questions: ['MCP 解决什么集成问题？', 'MCP 三大核心原语是什么？', 'Client、Server、Transport 如何协同？'], path: '14-mcp-skill-systems' },
    { id: '15', title: '高级专题', code: 'FRONTIER', cluster: 'quality', color: '#ff9859', size: 0.68, summary: 'Agentic Workflow、多模态降级与前沿 AI 架构。', questions: ['什么是 Agentic Workflow？', '如何设计自主编程 Agent？', '复杂 AI 工作流如何降级？'], path: '15-advanced-topics' },
    { id: '16', title: '简历与面试', code: 'INTERVIEW', cluster: 'career', color: '#f9e45b', size: 0.64, summary: '简历证据链、STAR 表达与系统设计答题框架。', questions: ['AI 工程师简历应突出什么？', '如何描述 AI 项目经验？', '如何准备系统设计题？'], path: '16-resume-interview-tips' },
    { id: '17', title: 'AI 编程工具', code: 'AI CODING', cluster: 'agent', color: '#67d9ff', size: 0.72, summary: 'AI IDE、Coding Agent、评测与团队落地。', questions: ['AI 编程工具如何评测？', 'Agent 与代码补全有什么区别？', '团队如何治理 Coding Agent？'], path: '17-ai-coding-tools' },
    { id: '18', title: '大厂面试题', code: 'BIG TECH', cluster: 'career', color: '#ffca4b', size: 0.8, summary: '国内大厂 AI 工程岗位的高频考点与准备路径。', questions: ['如何准备高频基础题？', '项目深挖通常追问什么？', '系统设计怎样体现工程取舍？'], path: '18-big-tech-interview-questions' },
    { id: '19', title: '推理框架', code: 'RUNTIME', cluster: 'infra', color: '#ff884d', size: 0.72, summary: 'vLLM、SGLang、TensorRT-LLM 与内存调度。', questions: ['三大推理框架如何定位？', 'PagedAttention 解决什么问题？', 'RadixAttention 有何不同？'], path: '19-inference-frameworks' },
    { id: '20', title: 'RAG 高级优化', code: 'RAG+', cluster: 'retrieval', color: '#24f0a9', size: 0.76, summary: 'RAG-Fusion、HyDE、语义分块与 GraphRAG。', questions: ['RAG-Fusion 如何提升召回？', 'HyDE 的原理是什么？', 'Semantic Chunking 有何优势？'], path: '20-rag-advanced-optimization' },
    { id: '21', title: '多模态 Agent', code: 'VLM AGENT', cluster: 'agent', color: '#ff69be', size: 0.7, summary: '视觉感知、GUI 操作与多模态 Agent 架构。', questions: ['多模态 Agent 有什么不同？', '视觉语言模型架构怎样组成？', 'Perceiver Resampler 有何优势？'], path: '21-multimodal-agents' },
    { id: '22', title: '规划与反思', code: 'PLANNING', cluster: 'agent', color: '#c875ff', size: 0.7, summary: '计划生成、动态重规划、反思记忆与搜索。', questions: ['Copilot 和 Agent 的核心区别？', 'Chain 和 Loop 架构如何选择？', 'Plan-and-Solve 如何工作？'], path: '22-agent-planning-reflection' },
    { id: '23', title: 'Agent 可观测', code: 'OBSERVE', cluster: 'agent', color: '#68b9ff', size: 0.66, summary: '轨迹追踪、成本监控、异常检测与生产调试。', questions: ['Agent 可观测性有哪些指标？', '如何监控 Token 成本？', '怎样发现循环和幻觉？'], path: '23-agent-observability' },
    { id: '24', title: 'Python 工程', code: 'PYTHON', cluster: 'infra', color: '#62d7a8', size: 0.64, summary: '异步、Pydantic、重试、FastAPI 与流式服务。', questions: ['asyncio 的最佳实践是什么？', 'Pydantic v2 如何约束输出？', 'FastAPI 如何实现 SSE？'], path: '24-python-engineering' },
    { id: '25', title: 'AI 系统设计', code: 'SYSTEM', cluster: 'infra', color: '#ffc857', size: 0.82, summary: '客服、知识库、LLM 网关与任务队列系统设计。', questions: ['如何设计百万 DAU AI 客服？', '怎样设计多租户 RAG 平台？', 'LLM API 网关包含哪些能力？'], path: '25-system-design-ai' },
    { id: '26', title: 'FDE', code: 'FDE', cluster: 'career', color: '#39e6d0', size: 0.66, summary: '客户发现、试点选择、交付闭环与现场工程。', questions: ['FDE 与后端工程师有何不同？', '第一次客户会议应问什么？', '如何选择第一个 AI 试点？'], path: '26-forward-deployed-engineer' },
    { id: '27', title: '项目经验', code: 'PROJECT', cluster: 'career', color: '#ffde59', size: 0.78, summary: 'RAG、Agent 项目讲述、难点复盘与指标证明。', questions: ['如何介绍一个 RAG 项目？', '召回率低时怎样排查？', '如何说明项目成本优化？'], path: '27-project-experience' },
    { id: '28', title: '测试 Harness', code: 'EVALUATION', cluster: 'quality', color: '#ff667f', size: 0.68, summary: '可重复测试、Fixture、Mock 与 LLM Eval Harness。', questions: ['Test Harness 是什么？', '如何设计可重复运行的 Harness？', 'Mock、Stub、Fake、Spy 有何区别？'], path: '28-test-harness-evaluation' },
];

export const TOPIC_LINKS = [
    ['01', '02'], ['01', '04'], ['01', '07'], ['01', '08'], ['02', '03'], ['02', '05'],
    ['03', '06'], ['03', '10'], ['03', '20'], ['03', '25'], ['04', '07'], ['04', '08'],
    ['05', '13'], ['05', '14'], ['05', '17'], ['05', '21'], ['05', '22'], ['06', '19'],
    ['07', '08'], ['08', '10'], ['08', '19'], ['09', '10'], ['09', '28'], ['10', '12'],
    ['10', '23'], ['10', '25'], ['11', '15'], ['11', '21'], ['12', '14'], ['12', '24'],
    ['13', '22'], ['13', '23'], ['14', '17'], ['15', '25'], ['16', '18'], ['16', '27'],
    ['17', '24'], ['18', '27'], ['19', '25'], ['20', '25'], ['21', '22'], ['22', '23'],
    ['24', '25'], ['25', '26'], ['25', '28'], ['26', '27'], ['27', '28'],
];

export const CLUSTER_LABELS = {
    foundation: '模型基础', retrieval: '检索与知识', agent: '智能体', infra: '工程与部署', quality: '多模态与质量', career: '面试实战'
};
