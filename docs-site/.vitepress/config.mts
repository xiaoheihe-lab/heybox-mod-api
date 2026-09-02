import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// GitHub Pages 项目页固定部署在 /heybox-mod-api/ 子路径。
// 本地 dev/build 也用同一 base，保证所见即所得；可用 DOCS_BASE_PATH 覆盖。
const base = process.env.DOCS_BASE_PATH ?? '/heybox-mod-api/'

export default withMermaid(
  defineConfig({
    base,
    lang: 'zh-CN',
    title: 'heybox-mod-api',
    description: '小黑盒 Mod 管理器扩展（extension）开发文档',
    cleanUrls: true,
    head: [
      ['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>' }],
    ],
    vite: {
      // fastdom（mermaid 依赖）是 CJS 包，dev 模式必须预打包，否则 default 导入失败导致白屏
      optimizeDeps: {
        include: ['fastdom', 'fastdom/extensions/fastdom-promised.js'],
      },
    },
    themeConfig: {
      nav: [
        { text: '指南', link: '/guide/quickstart', activeMatch: '/guide/' },
        { text: '扩展门面', link: '/reference/context/registerGame', activeMatch: '/reference/context/' },
        { text: '工具面 API', link: '/reference/api/events', activeMatch: '/reference/api/' },
        { text: '类型参考', link: '/reference/types/game', activeMatch: '/reference/types/' },
      ],
      sidebar: {
        '/guide/': [
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/guide/quickstart' },
              { text: '扩展运行时序', link: '/guide/lifecycle' },
            ],
          },
        ],
        '/reference/': [
          {
            text: 'API 参考',
            items: [
              { text: '总览', link: '/reference/' },
            ],
          },
          {
            text: '扩展门面 context',
            collapsed: false,
            items: [
              { text: 'registerGame', link: '/reference/context/registerGame' },
              { text: 'registerModType', link: '/reference/context/registerModType' },
              { text: 'registerInstaller', link: '/reference/context/registerInstaller' },
              { text: 'registerAttributeExtractor', link: '/reference/context/registerAttributeExtractor' },
              { text: 'registerPostInstallerAttributeExtractor', link: '/reference/context/registerPostInstallerAttributeExtractor' },
              { text: 'registerManagedDeploymentHook', link: '/reference/context/registerManagedDeploymentHook' },
              { text: 'registerLoadOrder', link: '/reference/context/registerLoadOrder' },
              { text: 'registerExtensionAction', link: '/reference/context/registerExtensionAction' },
              { text: 'registerAction 与 once', link: '/reference/context/registerAction' },
            ],
          },
          {
            text: '工具面 api',
            collapsed: false,
            items: [
              { text: 'events 事件总线', link: '/reference/api/events' },
              { text: 'steam 启动与游戏', link: '/reference/api/steam' },
              { text: 'ui 弹窗', link: '/reference/api/ui' },
              { text: 'fomod 安装向导', link: '/reference/api/fomod' },
              { text: 'path 与 fs', link: '/reference/api/path-fs' },
              { text: 'archive 压缩包', link: '/reference/api/archive' },
              { text: 'vfs 与 loadOrder', link: '/reference/api/vfs-loadorder' },
              { text: '其他工具', link: '/reference/api/util-misc' },
            ],
          },
          {
            text: '类型参考 types',
            collapsed: false,
            items: [
              { text: 'game 游戏注册', link: '/reference/types/game' },
              { text: 'installer 安装时序', link: '/reference/types/installer' },
              { text: 'vfs 托管部署', link: '/reference/types/vfs' },
              { text: 'api 门面工具', link: '/reference/types/api' },
              { text: 'fomod 安装向导', link: '/reference/types/fomod' },
              { text: 'load-order 加载顺序', link: '/reference/types/load-order' },
              { text: 'steam-prerequisite 前置条件', link: '/reference/types/steam-prerequisite' },
              { text: 'ClientInvokeError', link: '/reference/types/client-invoke-error' },
            ],
          },
        ],
      },
      outline: { level: [2, 3] },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/xiaoheihe-lab/heybox-mod-api' },
      ],
      docFooter: { prev: '上一页', next: '下一页' },
      lastUpdated: { text: '最后更新' },
    },
  })
)
